package es.ual.ideal_team_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import es.ual.ideal_team_service.client.PlayerServiceClient;
import es.ual.ideal_team_service.dto.IdealTeamResponse;
import es.ual.ideal_team_service.dto.IdealTeamSaveRequest;
import es.ual.ideal_team_service.dto.PlayerResponse;
import es.ual.ideal_team_service.exception.InsufficientPlayersException;
import es.ual.ideal_team_service.exception.InvalidPlayerCountException;
import es.ual.ideal_team_service.exception.PlayerNotFoundException;
import es.ual.ideal_team_service.model.IdealTeam;
import es.ual.ideal_team_service.repository.IdealTeamRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class IdealTeamServiceTest {

  @Mock
  private IdealTeamRepository idealTeamRepository;

  @Mock
  private PlayerServiceClient playerServiceClient;

  @InjectMocks
  private IdealTeamService idealTeamService;

  @Test
  void generateIdealTeam_shouldThrowWhenFewerThan11Players() {
    when(playerServiceClient.getAllPlayers())
        .thenReturn(ResponseEntity.ok(List.of(PlayerResponse.builder()
            .id(1L).name("Only Player").position("GK").build())));

    assertThatThrownBy(() -> idealTeamService.generateIdealTeam())
        .isInstanceOf(InsufficientPlayersException.class)
        .hasMessageContaining("Not enough players");
  }

  @Test
  void saveIdealTeam_shouldThrowWhenNot11Players() {
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("Bad Team")
        .players(List.of(1L))
        .build();

    assertThatThrownBy(() -> idealTeamService.saveIdealTeam(request, "user-1"))
        .isInstanceOf(InvalidPlayerCountException.class)
        .hasMessage("Team must have exactly 11 players");
  }

  @Test
  void saveIdealTeam_shouldThrowWhenPlayersNotFound() {
    List<Long> playerIds = new ArrayList<>();
    for (int i = 0; i < 11; i++) {
      playerIds.add((long) (i + 1));
    }
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("My Team")
        .players(playerIds)
        .build();

    when(playerServiceClient.getPlayerById(any(Long.class)))
        .thenReturn(ResponseEntity.status(HttpStatus.NOT_FOUND).build());

    assertThatThrownBy(() -> idealTeamService.saveIdealTeam(request, "user-1"))
        .isInstanceOf(PlayerNotFoundException.class);
  }

  @Test
  void saveIdealTeam_shouldSaveAndReturnTeam() {
    List<Long> playerIds = new ArrayList<>();
    for (int i = 0; i < 11; i++) {
      playerIds.add((long) (i + 1));
    }
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("My Team")
        .players(playerIds)
        .build();

    for (int i = 0; i < 11; i++) {
      when(playerServiceClient.getPlayerById((long) (i + 1)))
          .thenReturn(ResponseEntity.ok(PlayerResponse.builder()
              .id((long) (i + 1))
              .name("Player " + (i + 1))
              .position("Midfielder")
              .team("Test Team")
              .build()));
    }

    IdealTeam savedTeam = IdealTeam.builder()
        .id(1L)
        .name("My Team")
        .idUser("user-1")
        .playerIds(playerIds)
        .created(LocalDateTime.now())
        .build();
    when(idealTeamRepository.save(any(IdealTeam.class))).thenReturn(savedTeam);

    IdealTeamResponse result = idealTeamService.saveIdealTeam(request, "user-1");

    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getName()).isEqualTo("My Team");
    assertThat(result.getIdUser()).isEqualTo("user-1");
    assertThat(result.getPlayers()).hasSize(11);
    verify(idealTeamRepository).save(any(IdealTeam.class));
  }

  @Test
  void saveIdealTeam_shouldCallRepositoryWithCorrectFields() {
    List<Long> playerIds = new ArrayList<>();
    for (int i = 0; i < 11; i++) {
      playerIds.add((long) (i + 1));
    }
    IdealTeamSaveRequest request = IdealTeamSaveRequest.builder()
        .name("My Team")
        .players(playerIds)
        .build();

    for (int i = 0; i < 11; i++) {
      when(playerServiceClient.getPlayerById((long) (i + 1)))
          .thenReturn(ResponseEntity.ok(PlayerResponse.builder()
              .id((long) (i + 1))
              .name("Player " + (i + 1))
              .position("Midfielder")
              .build()));
    }

    IdealTeam savedTeam = IdealTeam.builder()
        .id(1L)
        .name("My Team")
        .idUser("user-1")
        .playerIds(playerIds)
        .created(LocalDateTime.now())
        .build();
    when(idealTeamRepository.save(any(IdealTeam.class))).thenReturn(savedTeam);

    idealTeamService.saveIdealTeam(request, "user-1");

    verify(idealTeamRepository).save(any(IdealTeam.class));
  }

  @Test
  void getUserTeams_shouldReturnTeamsWithPopulatedPlayers() {
    List<Long> playerIds = new ArrayList<>();
    for (int i = 0; i < 11; i++) {
      playerIds.add((long) (i + 1));
    }

    IdealTeam team = IdealTeam.builder()
        .id(1L)
        .name("Team A")
        .idUser("user-1")
        .playerIds(playerIds)
        .created(LocalDateTime.now())
        .build();
    when(idealTeamRepository.findByIdUser("user-1")).thenReturn(List.of(team));

    for (int i = 0; i < 11; i++) {
      when(playerServiceClient.getPlayerById((long) (i + 1)))
          .thenReturn(ResponseEntity.ok(PlayerResponse.builder()
              .id((long) (i + 1))
              .name("Player " + (i + 1))
              .position("Midfielder")
              .team("Test Team")
              .build()));
    }

    List<IdealTeamResponse> result = idealTeamService.getUserTeams("user-1");

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("Team A");
    assertThat(result.get(0).getPlayers()).hasSize(11);
  }

  @Test
  void getUserTeams_shouldReturnEmptyListWhenNoTeams() {
    when(idealTeamRepository.findByIdUser("user-1")).thenReturn(List.of());

    List<IdealTeamResponse> result = idealTeamService.getUserTeams("user-1");

    assertThat(result).isEmpty();
  }

  @Test
  void getUserTeams_shouldOnlyReturnTeamsForUser() {
    IdealTeam team1 = IdealTeam.builder()
        .id(1L).name("User 1 Team").idUser("user-1").playerIds(List.of())
        .created(LocalDateTime.now()).build();
    IdealTeam team2 = IdealTeam.builder()
        .id(2L).name("User 2 Team").idUser("user-2").playerIds(List.of())
        .created(LocalDateTime.now()).build();
    when(idealTeamRepository.findByIdUser("user-1")).thenReturn(List.of(team1));

    List<IdealTeamResponse> result = idealTeamService.getUserTeams("user-1");

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getName()).isEqualTo("User 1 Team");
  }
}
