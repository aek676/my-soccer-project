package es.ual.players_service.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import es.ual.players_service.dto.PlayerResponse;
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

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(playerController)
        .setControllerAdvice(new GlobalExceptionHandler())
        .build();
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
}
