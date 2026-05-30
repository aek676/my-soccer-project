package es.ual.players_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiSportsLeague {
  private Long id;
  private String name;
  private String country;
  private String logo;
  private String flag;
  private Integer season;
}