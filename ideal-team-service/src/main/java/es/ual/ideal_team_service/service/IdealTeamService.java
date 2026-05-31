package es.ual.ideal_team_service.service;

import es.ual.ideal_team_service.client.PlayerServiceClient;
import es.ual.ideal_team_service.dto.AiSelectionResult;
import es.ual.ideal_team_service.dto.IdealTeamResponse;
import es.ual.ideal_team_service.dto.IdealTeamSaveRequest;
import es.ual.ideal_team_service.dto.PlayerResponse;
import es.ual.ideal_team_service.exception.AiConfigurationException;
import es.ual.ideal_team_service.exception.InsufficientPlayersException;
import es.ual.ideal_team_service.exception.InvalidPlayerCountException;
import es.ual.ideal_team_service.exception.PlayerNotFoundException;
import es.ual.ideal_team_service.model.IdealTeam;
import es.ual.ideal_team_service.repository.IdealTeamRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class IdealTeamService {

  private final IdealTeamRepository idealTeamRepository;
  private final PlayerServiceClient playerServiceClient;
  private final ChatModel chatModel;

  public List<PlayerResponse> generateIdealTeam() {
    ResponseEntity<List<PlayerResponse>> response = playerServiceClient.getAllPlayers();
    if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
      throw new InsufficientPlayersException("Failed to retrieve players");
    }
    List<PlayerResponse> allPlayers = response.getBody();

    if (allPlayers.size() < 11) {
      throw new InsufficientPlayersException(
          "Not enough players in database. Found: " + allPlayers.size());
    }

    String apiKey = System.getenv("GROQ_API_KEY");
    if (apiKey == null || apiKey.isBlank()) {
      throw new AiConfigurationException("GROQ_API_KEY not configured");
    }

    StringBuilder promptBuilder = new StringBuilder();
    promptBuilder.append(
        "You are a football expert. Select exactly 11 players from the list below to form an ideal team. ");
    promptBuilder.append("You must select exactly 1 goalkeeper. ");
    promptBuilder.append(
        "Return a valid JSON object with a 'selectedIndices' field containing exactly 11 one-based indices. ");
    promptBuilder.append(
        "Example: {\"selectedIndices\": [1, 5, 8, 12, 15, 20, 25, 30, 35, 40, 45]}\n\n");
    for (int i = 0; i < allPlayers.size(); i++) {
      PlayerResponse p = allPlayers.get(i);
      promptBuilder.append((i + 1) + ". " + p.getName() + " | Position: " + p.getPosition()
          + " | Team: " + p.getTeam() + " | Age: " + p.getAge() + " | Nationality: "
          + p.getNationality() + "\n");
    }

    ChatClient chatClient = ChatClient.builder(chatModel)
        .defaultOptions(OpenAiChatOptions.builder()
            .model("llama-3.3-70b-versatile")
            .temperature(0.8))
        .build();

    AiSelectionResult result = chatClient.prompt()
        .user(promptBuilder.toString())
        .call()
        .entity(AiSelectionResult.class);

    List<PlayerResponse> selectedPlayers = new ArrayList<>();
    if (result != null && result.getSelectedIndices() != null) {
      for (Integer idx : result.getSelectedIndices()) {
        int zeroBased = idx - 1;
        if (zeroBased >= 0 && zeroBased < allPlayers.size()) {
          selectedPlayers.add(allPlayers.get(zeroBased));
        }
      }
    }

    return selectedPlayers;
  }

  public IdealTeamResponse saveIdealTeam(IdealTeamSaveRequest request, String userId) {
    if (request.getPlayers() == null || request.getPlayers().size() != 11) {
      throw new InvalidPlayerCountException("Team must have exactly 11 players");
    }

    for (Long playerId : request.getPlayers()) {
      try {
        ResponseEntity<PlayerResponse> resp = playerServiceClient.getPlayerById(playerId);
        if (!resp.getStatusCode().is2xxSuccessful() || resp.getBody() == null) {
          throw new PlayerNotFoundException(playerId);
        }
      } catch (Exception e) {
        throw new PlayerNotFoundException(playerId);
      }
    }

    IdealTeam team = IdealTeam.builder()
        .name(request.getName())
        .playerIds(request.getPlayers())
        .idUser(userId)
        .created(LocalDateTime.now())
        .build();
    IdealTeam saved = idealTeamRepository.save(team);

    List<PlayerResponse> players = new ArrayList<>();
    for (Long playerId : saved.getPlayerIds()) {
      ResponseEntity<PlayerResponse> resp = playerServiceClient.getPlayerById(playerId);
      if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
        players.add(resp.getBody());
      }
    }

    log.info("Created ideal team with id: {}", saved.getId());
    return IdealTeamResponse.builder()
        .id(saved.getId())
        .name(saved.getName())
        .players(players)
        .created(saved.getCreated())
        .idUser(saved.getIdUser())
        .build();
  }

  public List<IdealTeamResponse> getUserTeams(String userId) {
    List<IdealTeam> teams = idealTeamRepository.findByIdUser(userId);
    List<IdealTeamResponse> responses = new ArrayList<>();
    for (IdealTeam team : teams) {
      List<PlayerResponse> players = new ArrayList<>();
      if (team.getPlayerIds() != null) {
        for (Long playerId : team.getPlayerIds()) {
          ResponseEntity<PlayerResponse> resp = playerServiceClient.getPlayerById(playerId);
          if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
            players.add(resp.getBody());
          }
        }
      }
      responses.add(IdealTeamResponse.builder()
          .id(team.getId())
          .name(team.getName())
          .players(players)
          .created(team.getCreated())
          .idUser(team.getIdUser())
          .build());
    }
    return responses;
  }
}
