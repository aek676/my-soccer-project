package es.ual.players_service.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.ual.players_service.dto.PlayerCreateRequest;
import es.ual.players_service.dto.PlayerImportRequest;
import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.dto.PlayerUpdateRequest;
import es.ual.players_service.exception.GlobalExceptionHandler;
import es.ual.players_service.exception.PlayerNotFoundException;
import es.ual.players_service.model.Location;
import es.ual.players_service.service.PlayerService;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class PlayerControllerTest {

  @Mock
  private PlayerService playerService;

  @InjectMocks
  private PlayerController playerController;

  private MockMvc mockMvc;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(playerController)
        .setControllerAdvice(new GlobalExceptionHandler())
        .build();
    objectMapper = new ObjectMapper();
  }

  @Test
  void getAllPlayers_shouldReturn200() throws Exception {
    Location loc = Location.builder().type("Point").coordinates(new Double[]{-3.7038, 40.4168}).build();
    PlayerResponse player = PlayerResponse.builder()
        .id(1L).name("Vinícius Júnior").position("Forward").number(7).age(23)
        .photo("https://i.pravatar.cc/64?img=14").location(loc)
        .build();
    when(playerService.getAllPlayers()).thenReturn(List.of(player));

    mockMvc.perform(get("/players")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Vinícius Júnior"))
        .andExpect(jsonPath("$[0].location.type").value("Point"))
        .andExpect(jsonPath("$[0].location.coordinates[0]").value(-3.7038))
        .andExpect(jsonPath("$[0].location.coordinates[1]").value(40.4168));
  }

  @Test
  void getPlayerById_shouldReturn200WhenFound() throws Exception {
    PlayerResponse player = PlayerResponse.builder()
        .id(1L).name("Vinícius Júnior").position("Forward").number(7).age(23)
        .build();
    when(playerService.getPlayerById(1L)).thenReturn(player);

    mockMvc.perform(get("/players/1")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Vinícius Júnior"));
  }

  @Test
  void getPlayerById_shouldReturn404WhenNotFound() throws Exception {
    when(playerService.getPlayerById(99L)).thenThrow(new PlayerNotFoundException(99L));

    mockMvc.perform(get("/players/99")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404))
        .andExpect(jsonPath("$.message").value("Player not found with id: 99"));
  }

  @Test
  void searchPlayerByName_shouldReturn200() throws Exception {
    PlayerResponse player = PlayerResponse.builder()
        .id(100L).name("Vinícius Júnior").position("Forward").number(7).age(23)
        .build();
    when(playerService.searchPlayerByName("Vinícius")).thenReturn(List.of(player));

    mockMvc.perform(get("/players/search/Vinícius")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].name").value("Vinícius Júnior"));
  }

  @Test
  void createPlayer_shouldReturn201() throws Exception {
    PlayerCreateRequest request = PlayerCreateRequest.builder()
        .name("Vinícius Júnior")
        .firstName("Vinícius")
        .lastName("Júnior")
        .age(23)
        .birthdate("2000-01-12")
        .nationality("Brazil")
        .height("180 cm")
        .weight("70 kg")
        .number(7)
        .team("Real Madrid")
        .league("La Liga")
        .position("Forward")
        .photo("https://example.com/photo.jpg")
        .build();

    PlayerResponse response = PlayerResponse.builder()
        .id(1L).name("Vinícius Júnior").firstName("Vinícius").lastName("Jñón")
        .age(23).team("Real Madrid").league("La Liga").position("Forward")
        .number(7).build();

    when(playerService.createPlayer(any(PlayerCreateRequest.class))).thenReturn(response);

    mockMvc.perform(post("/players")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.name").value("Vinícius Júnior"));
  }

  @Test
  void importPlayerFromApi_shouldReturn201() throws Exception {
    PlayerImportRequest request = PlayerImportRequest.builder()
        .location(Location.builder().type("Point").coordinates(new Double[]{-3.7, 40.4}).build())
        .build();

    PlayerResponse response = PlayerResponse.builder()
        .id(2L).name("Vinícius Júnior").externalId(456L)
        .build();

    when(playerService.importPlayerFromApi(anyLong(), any(PlayerImportRequest.class))).thenReturn(response);

    mockMvc.perform(post("/players/import/456")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(2))
        .andExpect(jsonPath("$.externalId").value(456));
  }

  @Test
  void updatePlayer_shouldReturn204WhenSuccessful() throws Exception {
    PlayerUpdateRequest request = PlayerUpdateRequest.builder()
        .team("Barcelona")
        .position("Midfielder")
        .build();

    doNothing().when(playerService).updatePlayer(anyLong(), any(PlayerUpdateRequest.class));

    mockMvc.perform(patch("/players/1")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNoContent());
  }

  @Test
  void updatePlayer_shouldReturn404WhenNotFound() throws Exception {
    PlayerUpdateRequest request = PlayerUpdateRequest.builder()
        .team("Barcelona")
        .build();

    doThrow(new PlayerNotFoundException(99L)).when(playerService).updatePlayer(anyLong(), any(PlayerUpdateRequest.class));

    mockMvc.perform(patch("/players/99")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404))
        .andExpect(jsonPath("$.message").value("Player not found with id: 99"));
  }
}