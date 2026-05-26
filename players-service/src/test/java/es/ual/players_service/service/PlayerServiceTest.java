package es.ual.players_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.exception.PlayerNotFoundException;
import es.ual.players_service.model.Location;
import es.ual.players_service.model.Player;
import es.ual.players_service.repository.PlayerRepository;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

  @Mock
  private PlayerRepository playerRepository;

  @InjectMocks
  private PlayerService playerService;

  @Test
  void getAllPlayers_shouldReturnList() {
    Location loc = Location.builder().type("Point").coordinates(new Double[]{-3.7038, 40.4168}).build();
    Player player = Player.builder()
        .id(1L).name("Vinícius Júnior").position("Forward").number(7).age(23)
        .photo("https://i.pravatar.cc/64?img=14").location(loc)
        .build();
    when(playerRepository.findAll()).thenReturn(List.of(player));

    List<PlayerResponse> result = playerService.getAllPlayers();

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("Vinícius Júnior");
    assertThat(result.get(0).getLocation().getType()).isEqualTo("Point");
    assertThat(result.get(0).getLocation().getCoordinates()).containsExactly(-3.7038, 40.4168);
  }

  @Test
  void getPlayerById_shouldReturnPlayerWhenFound() {
    Player player = Player.builder()
        .id(1L).name("Vinícius Júnior").position("Forward").number(7).age(23)
        .build();
    when(playerRepository.findById(1L)).thenReturn(Optional.of(player));

    PlayerResponse result = playerService.getPlayerById(1L);

    assertThat(result).isNotNull();
    assertThat(result.getName()).isEqualTo("Vinícius Júnior");
  }

  @Test
  void getPlayerById_shouldThrowWhenNotFound() {
    when(playerRepository.findById(99L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> playerService.getPlayerById(99L))
        .isInstanceOf(PlayerNotFoundException.class)
        .hasMessage("Player not found with id: 99");
  }
}
