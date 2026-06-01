package es.ual.players_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import es.ual.players_service.dto.ApiSportsPlayerEntry;
import es.ual.players_service.dto.ApiSportsPlayerResponse;
import es.ual.players_service.dto.ApiSportsStatistics;
import es.ual.players_service.dto.ApiSportsTeam;
import es.ual.players_service.dto.ApiSportsLeague;
import es.ual.players_service.dto.ApiSportsGames;
import es.ual.players_service.dto.PlayerCreateRequest;
import es.ual.players_service.dto.PlayerImportRequest;
import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.dto.PlayerUpdateRequest;
import es.ual.players_service.exception.PlayerNotFoundException;
import es.ual.players_service.model.Location;
import es.ual.players_service.model.Player;
import es.ual.players_service.repository.PlayerRepository;
import es.ual.players_service.dto.ApiSportsBirth;
import es.ual.players_service.dto.ApiSportsPlayer;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

@ExtendWith(MockitoExtension.class)
class PlayerServiceTest {

  @Mock
  private PlayerRepository playerRepository;

  @Mock
  private es.ual.players_service.client.ApiSportsClient apiSportsClient;

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

  @Test
  void createPlayer_shouldSaveAndReturnPlayer() {
    Location loc = Location.builder().type("Point").coordinates(new Double[]{-3.7038, 40.4168}).build();
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
        .location(loc)
        .build();

    Player savedPlayer = Player.builder()
        .id(1L).name("Vinícius Júnior").firstName("Vinícius").lastName("Júnior")
        .age(23).birthdate(LocalDate.of(2000, 1, 12)).nationality("Brazil")
        .height("180 cm").weight("70 kg").number(7).team("Real Madrid")
        .league("La Liga").position("Forward").photo("https://example.com/photo.jpg")
        .location(loc).created(LocalDateTime.now())
        .build();

    when(playerRepository.save(any(Player.class))).thenReturn(savedPlayer);

    PlayerResponse result = playerService.createPlayer(request);

    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getName()).isEqualTo("Vinícius Júnior");
    assertThat(result.getTeam()).isEqualTo("Real Madrid");
    verify(playerRepository).save(any(Player.class));
  }

  @Test
  void importPlayerFromApi_shouldReturnExistingIfAlreadyImported() {
    Player existingPlayer = Player.builder()
        .id(1L).name("Vinícius Júnior").externalId(123L)
        .created(LocalDateTime.now()).build();
    when(playerRepository.findByExternalId(123L)).thenReturn(Optional.of(existingPlayer));

    PlayerImportRequest request = PlayerImportRequest.builder()
        .location(Location.builder().type("Point").coordinates(new Double[]{1.0, 2.0}).build())
        .build();

    PlayerResponse result = playerService.importPlayerFromApi(123L, request);

    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getExternalId()).isEqualTo(123L);
  }

  @Test
  void importPlayerFromApi_shouldFetchFromApiAndSave() {
    ReflectionTestUtils.setField(playerService, "apiFootballKey", "test-api-key");

    PlayerImportRequest request = PlayerImportRequest.builder()
        .location(Location.builder().type("Point").coordinates(new Double[]{1.0, 2.0}).build())
        .build();

    ApiSportsPlayerEntry entry = ApiSportsPlayerEntry.builder()
        .player(es.ual.players_service.dto.ApiSportsPlayer.builder()
            .id(456L)
            .name("Vinícius Júnior")
            .firstname("Vinícius")
            .lastname("J Júnior")
            .age(23)
            .birth(es.ual.players_service.dto.ApiSportsBirth.builder()
                .date("2000-01-12").place("São Paulo").country("Brazil").build())
            .nationality("Brazil")
            .height("180 cm")
            .weight("70 kg")
            .position("Forward")
            .photo("https://example.com/photo.jpg")
            .build())
        .statistics(List.of(
            ApiSportsStatistics.builder()
                .team(ApiSportsTeam.builder().id(1L).name("Real Madrid").logo("logo.png").build())
                .league(ApiSportsLeague.builder().id(1L).name("La Liga").country("Spain").season(2024).build())
                .games(ApiSportsGames.builder().appearences(20).number(7).position("Forward").build())
                .build()))
        .build();

    when(playerRepository.findByExternalId(456L)).thenReturn(Optional.empty());
    when(apiSportsClient.getPlayers(456L, 2024, "test-api-key"))
        .thenReturn(ApiSportsPlayerResponse.builder().response(List.of(entry)).build());
    when(playerRepository.save(any(Player.class))).thenAnswer(inv -> {
      Player p = inv.getArgument(0);
      p.setId(2L);
      return p;
    });

    PlayerResponse result = playerService.importPlayerFromApi(456L, request);

    assertThat(result).isNotNull();
    assertThat(result.getName()).isEqualTo("Vinícius Júnior");
    assertThat(result.getExternalId()).isEqualTo(456L);
    verify(playerRepository).save(any(Player.class));
  }

  @Test
  void importPlayerFromApi_shouldThrowWhenNotFoundInApi() {
    ReflectionTestUtils.setField(playerService, "apiFootballKey", "test-api-key");
    PlayerImportRequest request = PlayerImportRequest.builder().build();

    when(playerRepository.findByExternalId(999L)).thenReturn(Optional.empty());
    when(apiSportsClient.getPlayers(999L, 2024, "test-api-key"))
        .thenReturn(ApiSportsPlayerResponse.builder().response(List.of()).build());

    assertThatThrownBy(() -> playerService.importPlayerFromApi(999L, request))
        .isInstanceOf(PlayerNotFoundException.class)
        .hasMessage("Player not found with id: 999");
  }

  @Test
  void searchPlayerByName_shouldReturnPlayers_whenApiReturnsResults() {
    ReflectionTestUtils.setField(playerService, "apiFootballKey", "test-api-key");

    ApiSportsPlayerEntry entry = ApiSportsPlayerEntry.builder()
        .player(ApiSportsPlayer.builder()
            .id(456L)
            .name("Vinícius Júnior")
            .firstname("Vinícius")
            .lastname("Júnior")
            .age(23)
            .birth(ApiSportsBirth.builder().date("2000-01-12").build())
            .nationality("Brazil")
            .height("180 cm")
            .weight("70 kg")
            .number(7)
            .position("Forward")
            .photo("https://example.com/photo.jpg")
            .build())
        .build();

    when(apiSportsClient.searchPlayers("Vinícius", "test-api-key"))
        .thenReturn(ApiSportsPlayerResponse.builder().response(List.of(entry)).build());

    List<PlayerResponse> result = playerService.searchPlayerByName("Vinícius");

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("Vinícius Júnior");
  }

  @Test
  void searchPlayerByName_shouldReturnEmptyList_whenApiReturnsNoResults() {
    ReflectionTestUtils.setField(playerService, "apiFootballKey", "test-api-key");

    when(apiSportsClient.searchPlayers("Unknown", "test-api-key"))
        .thenReturn(ApiSportsPlayerResponse.builder().response(List.of()).build());

    List<PlayerResponse> result = playerService.searchPlayerByName("Unknown");

    assertThat(result).isEmpty();
  }

  @Test
  void searchPlayerByName_shouldThrow_whenApiKeyNotConfigured() {
    assertThatThrownBy(() -> playerService.searchPlayerByName("Vinícius"))
        .isInstanceOf(RuntimeException.class)
        .hasMessage("API key not configured");
  }

  @Test
  void searchPlayerByName_shouldThrow_whenApiCallFails() {
    ReflectionTestUtils.setField(playerService, "apiFootballKey", "test-api-key");

    when(apiSportsClient.searchPlayers("Vinícius", "test-api-key"))
        .thenThrow(new RuntimeException("API connection error"));

    assertThatThrownBy(() -> playerService.searchPlayerByName("Vinícius"))
        .isInstanceOf(RuntimeException.class)
        .hasMessage("Failed to search players: API connection error");
  }

  @Test
  void updatePlayer_shouldUpdateOnlyProvidedFields() {
    Player existing = Player.builder()
        .id(1L).name("Lionel Messi").firstName("Lionel").lastName("Messi")
        .age(36).team("Inter Miami").position("Forward")
        .build();
    when(playerRepository.findById(1L)).thenReturn(Optional.of(existing));
    when(playerRepository.save(any(Player.class))).thenAnswer(inv -> inv.getArgument(0));

    playerService.updatePlayer(1L, PlayerUpdateRequest.builder()
        .team("Barcelona")
        .position("Midfielder")
        .build());

    assertThat(existing.getTeam()).isEqualTo("Barcelona");
    assertThat(existing.getPosition()).isEqualTo("Midfielder");
    assertThat(existing.getName()).isEqualTo("Lionel Messi");
    assertThat(existing.getAge()).isEqualTo(36);
  }

  @Test
  void updatePlayer_shouldThrowWhenPlayerNotFound() {
    when(playerRepository.findById(99L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> playerService.updatePlayer(99L, PlayerUpdateRequest.builder().team("Barça").build()))
        .isInstanceOf(PlayerNotFoundException.class)
        .hasMessage("Player not found with id: 99");
  }
}