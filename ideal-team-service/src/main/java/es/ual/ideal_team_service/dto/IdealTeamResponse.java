package es.ual.ideal_team_service.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdealTeamResponse {
  private Long id;
  private String name;
  private List<PlayerResponse> players;
  private LocalDateTime created;
  private String idUser;
}