package es.ual.ideal_team_service.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.ual.ideal_team_service.dto.IdealTeamResponse;
import es.ual.ideal_team_service.dto.IdealTeamSaveRequest;
import es.ual.ideal_team_service.dto.PlayerResponse;
import es.ual.ideal_team_service.exception.AiConfigurationException;
import es.ual.ideal_team_service.exception.GlobalExceptionHandler;
import es.ual.ideal_team_service.exception.InsufficientPlayersException;
import es.ual.ideal_team_service.exception.InvalidPlayerCountException;
import es.ual.ideal_team_service.exception.PlayerNotFoundException;
import es.ual.ideal_team_service.service.IdealTeamService;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class IdealTeamControllerTest {

  @Mock
  private IdealTeamService idealTeamService;

  @InjectMocks
  private IdealTeamController idealTeamController;

  private MockMvc mockMvc;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(idealTeamController)
        .setControllerAdvice(new GlobalExceptionHandler())
        .build();
    objectMapper = new ObjectMapper();
  }

  private List<PlayerResponse> makePlayers(int count) {
    List<PlayerResponse> players = new ArrayList<>();
    for (int i = 0; i < count; i++) {
      players.add(PlayerResponse.builder()
          .id((long) (i + 1))
          .name("Player " + (i + 1))
          .position("Midfielder")
          .team("Test Team")
          .build());
    }
    return players;
  }

  private List<Long> makePlayerIds(int count) {
    List<Long> ids = new ArrayList<>();
    for (int i = 0; i < count; i++) {
      ids.add((long) (i + 1));
    }
    return ids;
  }

  @Test
  void generateIdealTeam_shouldReturn400WhenFewerThan11Players() throws Exception {
    when(idealTeamService.generateIdealTeam())
        .thenThrow(new InsufficientPlayersException(
            "Not enough players in database. Found: 1"));

    mockMvc.perform(get("/ideal-team/generate"))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(400))
        .andExpect(jsonPath("$.message").value("Not enough players in database. Found: 1"));
  }

  @Test
  void generateIdealTeam_shouldReturn500WhenGroqApiKeyNotConfigured() throws Exception {
    when(idealTeamService.generateIdealTeam())
        .thenThrow(new AiConfigurationException("GROQ_API_KEY not configured"));

    mockMvc.perform(get("/ideal-team/generate"))
        .andExpect(status().isInternalServerError())
        .andExpect(jsonPath("$.code").value(500))
        .andExpect(jsonPath("$.message").value("GROQ_API_KEY not configured"));
  }

  @Test
  void generateIdealTeam_shouldReturn200WithPlayers() throws Exception {
    when(idealTeamService.generateIdealTeam()).thenReturn(makePlayers(11));

    mockMvc.perform(get("/ideal-team/generate"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$[0].name").value("Player 1"));
  }

  @Test
  void saveIdealTeam_shouldReturn401WithoutAuth() throws Exception {
    List<Long> playerIds = makePlayerIds(11);
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("My Team")
        .players(playerIds)
        .build();

    mockMvc.perform(post("/ideal-team")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value(401))
        .andExpect(jsonPath("$.message").value("Unauthorized"));
  }

  @Test
  void saveIdealTeam_shouldReturn201WithValidBody() throws Exception {
    List<Long> playerIds = makePlayerIds(11);
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("My Team")
        .players(playerIds)
        .build();

    IdealTeamResponse response = IdealTeamResponse.builder()
        .id(1L)
        .name("My Team")
        .players(makePlayers(11))
        .created(LocalDateTime.now())
        .idUser("user-123")
        .build();
    when(idealTeamService.saveIdealTeam(any(IdealTeamSaveRequest.class), anyString()))
        .thenReturn(response);

    mockMvc.perform(post("/ideal-team")
            .contentType(MediaType.APPLICATION_JSON)
            .header("X-User-Id", "user-123")
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.name").value("My Team"))
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.idUser").value("user-123"));
  }

  @Test
  void saveIdealTeam_shouldReturn400WithWrongPlayerCount() throws Exception {
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("Bad Team")
        .players(makePlayerIds(1))
        .build();

    when(idealTeamService.saveIdealTeam(any(IdealTeamSaveRequest.class), anyString()))
        .thenThrow(new InvalidPlayerCountException("Team must have exactly 11 players"));

    mockMvc.perform(post("/ideal-team")
            .contentType(MediaType.APPLICATION_JSON)
            .header("X-User-Id", "user-123")
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.code").value(400));
  }

  @Test
  void saveIdealTeam_shouldReturn400WhenPlayersNotFound() throws Exception {
    List<Long> playerIds = makePlayerIds(11);
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("My Team")
        .players(playerIds)
        .build();

    when(idealTeamService.saveIdealTeam(any(IdealTeamSaveRequest.class), anyString()))
        .thenThrow(new PlayerNotFoundException(999L));

    mockMvc.perform(post("/ideal-team")
            .contentType(MediaType.APPLICATION_JSON)
            .header("X-User-Id", "user-123")
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404));
  }

  @Test
  void getUserTeams_shouldReturn401WithoutAuth() throws Exception {
    mockMvc.perform(get("/ideal-team"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value(401))
        .andExpect(jsonPath("$.message").value("Unauthorized"));
  }

  @Test
  void getUserTeams_shouldReturn200WithTeams() throws Exception {
    List<PlayerResponse> players = makePlayers(11);
    IdealTeamResponse team = IdealTeamResponse.builder()
        .id(1L)
        .name("My Team")
        .players(players)
        .created(LocalDateTime.now())
        .idUser("user-1")
        .build();
    when(idealTeamService.getUserTeams("user-1")).thenReturn(List.of(team));

    mockMvc.perform(get("/ideal-team")
            .header("X-User-Id", "user-1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("My Team"))
        .andExpect(jsonPath("$[0].players").isArray())
        .andExpect(jsonPath("$[0].players[0].name").value("Player 1"));
  }

  @Test
  void getUserTeams_shouldReturn200WithEmptyArray() throws Exception {
    when(idealTeamService.getUserTeams("user-1")).thenReturn(List.of());

    mockMvc.perform(get("/ideal-team")
            .header("X-User-Id", "user-1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$").isArray())
        .andExpect(jsonPath("$").isEmpty());
  }

  @Test
  void getUserTeams_shouldOnlyReturnTeamsForAuthenticatedUser() throws Exception {
    List<PlayerResponse> players = makePlayers(11);
    IdealTeamResponse team = IdealTeamResponse.builder()
        .id(1L)
        .name("User 1 Team")
        .players(players)
        .created(LocalDateTime.now())
        .idUser("user-1")
        .build();
    when(idealTeamService.getUserTeams("user-1")).thenReturn(List.of(team));

    mockMvc.perform(get("/ideal-team")
            .header("X-User-Id", "user-1"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("User 1 Team"));
  }
}