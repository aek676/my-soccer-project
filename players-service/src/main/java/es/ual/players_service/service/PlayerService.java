package es.ual.players_service.service;

import es.ual.players_service.client.ApiSportsClient;
import es.ual.players_service.dto.ApiSportsPlayerEntry;
import es.ual.players_service.dto.ApiSportsStatistics;
import es.ual.players_service.dto.PlayerCreateRequest;
import es.ual.players_service.dto.PlayerImportRequest;
import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.dto.PlayerUpdateRequest;
import es.ual.players_service.exception.PlayerNotFoundException;
import es.ual.players_service.model.Player;
import es.ual.players_service.repository.PlayerRepository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlayerService {

  private final PlayerRepository playerRepository;
  private final ApiSportsClient apiSportsClient;

  @Value("${api.football.key}")
  private String apiFootballKey;

  public List<PlayerResponse> getAllPlayers() {
    return playerRepository.findAll().stream()
        .map(PlayerService::toResponse)
        .toList();
  }

  public PlayerResponse getPlayerById(Long id) {
    return playerRepository.findById(id)
        .map(PlayerService::toResponse)
        .orElseThrow(() -> new PlayerNotFoundException(id));
  }

  public PlayerResponse createPlayer(PlayerCreateRequest request) {
    Player player = Player.builder()
        .name(request.getName())
        .firstName(request.getFirstName())
        .lastName(request.getLastName())
        .age(request.getAge())
        .birthdate(request.getBirthdate() != null ? LocalDate.parse(request.getBirthdate()) : null)
        .nationality(request.getNationality())
        .height(request.getHeight())
        .weight(request.getWeight())
        .number(request.getNumber())
        .team(request.getTeam())
        .league(request.getLeague())
        .position(request.getPosition())
        .photo(request.getPhoto())
        .location(request.getLocation())
        .externalId(null)
        .created(LocalDateTime.now())
        .build();

    Player saved = playerRepository.save(player);
    log.info("Created player with id: {}", saved.getId());
    return toResponse(saved);
  }

  public List<PlayerResponse> searchPlayerByName(String name) {
    if (apiFootballKey == null || apiFootballKey.isBlank()) {
      log.error("API key not configured");
      throw new RuntimeException("API key not configured");
    }

    try {
      var response = apiSportsClient.searchPlayers(name, apiFootballKey);
      if (response == null || response.getResponse() == null || response.getResponse().isEmpty()) {
        return List.of();
      }

      return response.getResponse().stream()
          .map(this::mapApiEntryToResponse)
          .toList();
    } catch (RuntimeException e) {
      log.error("API-Football search failed for '{}'", name, e);
      throw new RuntimeException("Failed to search players: " + e.getMessage());
    }
  }

  public PlayerResponse importPlayerFromApi(Long apiPlayerId, PlayerImportRequest request) {
    Optional<Player> existing = playerRepository.findByExternalId(apiPlayerId);
    if (existing.isPresent()) {
      log.info("Player with externalId {} already exists, returning existing", apiPlayerId);
      return toResponse(existing.get());
    }

    if (apiFootballKey == null || apiFootballKey.isBlank()) {
      log.error("API key not configured");
      throw new RuntimeException("API key not configured");
    }

    var response = apiSportsClient.getPlayers(apiPlayerId, 2024, apiFootballKey);
    if (response == null || response.getResponse() == null || response.getResponse().isEmpty()) {
      throw new PlayerNotFoundException(apiPlayerId);
    }

    ApiSportsPlayerEntry entry = response.getResponse().get(0);
    String teamName = null;
    String leagueName = null;
    Integer playerNumber = null;
    String playerPosition = null;

    if (entry.getStatistics() != null && !entry.getStatistics().isEmpty()) {
      ApiSportsStatistics best = entry.getStatistics().stream()
          .max(Comparator.comparingInt(s -> s.getGames() != null && s.getGames().getAppearences() != null
              ? s.getGames().getAppearences()
              : 0))
          .orElse(entry.getStatistics().get(0));

      if (best.getTeam() != null)
        teamName = best.getTeam().getName();
      if (best.getLeague() != null)
        leagueName = best.getLeague().getName();
      if (best.getGames() != null) {
        playerNumber = best.getGames().getNumber();
        playerPosition = best.getGames().getPosition();
      }
    }

    String birthdateStr = entry.getPlayer() != null && entry.getPlayer().getBirth() != null
        ? entry.getPlayer().getBirth().getDate()
        : null;
    LocalDate birthdate = birthdateStr != null ? LocalDate.parse(birthdateStr) : null;

    Player player = Player.builder()
        .name(entry.getPlayer().getName())
        .firstName(entry.getPlayer().getFirstname())
        .lastName(entry.getPlayer().getLastname())
        .age(entry.getPlayer().getAge())
        .birthdate(birthdate)
        .nationality(entry.getPlayer().getNationality())
        .height(entry.getPlayer().getHeight())
        .weight(entry.getPlayer().getWeight())
        .number(playerNumber)
        .position(playerPosition)
        .photo(entry.getPlayer().getPhoto())
        .team(teamName)
        .league(leagueName)
        .externalId(apiPlayerId)
        .location(request.getLocation())
        .created(LocalDateTime.now())
        .build();

    Player saved = playerRepository.save(player);
    log.info("Imported player from API with id: {}", saved.getId());
    return toResponse(saved);
  }

  public void updatePlayer(Long id, PlayerUpdateRequest request) {
    Player player = playerRepository.findById(id)
        .orElseThrow(() -> new PlayerNotFoundException(id));

    if (request.getName() != null) player.setName(request.getName());
    if (request.getFirstName() != null) player.setFirstName(request.getFirstName());
    if (request.getLastName() != null) player.setLastName(request.getLastName());
    if (request.getAge() != null) player.setAge(request.getAge());
    if (request.getBirthdate() != null) player.setBirthdate(LocalDate.parse(request.getBirthdate()));
    if (request.getNationality() != null) player.setNationality(request.getNationality());
    if (request.getHeight() != null) player.setHeight(request.getHeight());
    if (request.getWeight() != null) player.setWeight(request.getWeight());
    if (request.getNumber() != null) player.setNumber(request.getNumber());
    if (request.getTeam() != null) player.setTeam(request.getTeam());
    if (request.getLeague() != null) player.setLeague(request.getLeague());
    if (request.getPosition() != null) player.setPosition(request.getPosition());
    if (request.getPhoto() != null) player.setPhoto(request.getPhoto());
    if (request.getLocation() != null) player.setLocation(request.getLocation());

    playerRepository.save(player);
    log.info("Updated player with id: {}", id);
  }

  private PlayerResponse mapApiEntryToResponse(ApiSportsPlayerEntry entry) {
    return PlayerResponse.builder()
        .id(entry.getPlayer().getId())
        .name(entry.getPlayer().getName())
        .firstName(entry.getPlayer().getFirstname())
        .lastName(entry.getPlayer().getLastname())
        .age(entry.getPlayer().getAge())
        .birthdate(entry.getPlayer().getBirth() != null
            && entry.getPlayer().getBirth().getDate() != null
                ? LocalDate.parse(entry.getPlayer().getBirth().getDate())
                : null)
        .nationality(entry.getPlayer().getNationality())
        .height(entry.getPlayer().getHeight())
        .weight(entry.getPlayer().getWeight())
        .number(entry.getPlayer().getNumber())
        .position(entry.getPlayer().getPosition())
        .photo(entry.getPlayer().getPhoto())
        .externalId(entry.getPlayer().getId())
        .build();
  }

  private static PlayerResponse toResponse(Player player) {
    return PlayerResponse.builder()
        .id(player.getId())
        .name(player.getName())
        .firstName(player.getFirstName())
        .lastName(player.getLastName())
        .age(player.getAge())
        .birthdate(player.getBirthdate())
        .nationality(player.getNationality())
        .height(player.getHeight())
        .weight(player.getWeight())
        .number(player.getNumber())
        .team(player.getTeam())
        .league(player.getLeague())
        .position(player.getPosition())
        .photo(player.getPhoto())
        .location(player.getLocation())
        .externalId(player.getExternalId())
        .created(player.getCreated())
        .build();
  }
}
