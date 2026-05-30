package es.ual.players_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiSportsGames {
  private Integer appearences;
  private Integer lineups;
  private Integer minutes;
  private Integer number;
  private String position;
  private String rating;
  private Boolean captain;
}