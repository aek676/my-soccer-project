package es.ual.players_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiSportsStatistics {
  private ApiSportsTeam team;
  private ApiSportsLeague league;
  private ApiSportsGames games;
}