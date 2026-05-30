package es.ual.players_service.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiSportsPlayerEntry {
  private ApiSportsPlayer player;
  private List<ApiSportsStatistics> statistics;
}