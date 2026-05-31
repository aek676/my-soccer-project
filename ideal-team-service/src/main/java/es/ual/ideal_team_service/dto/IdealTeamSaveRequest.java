package es.ual.ideal_team_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IdealTeamSaveRequest {

  @NotBlank(message = "Name is required")
  @Size(max = 100, message = "Name must be at most 100 characters")
  private String name;

  @NotNull(message = "Players list is required")
  @Size(min = 11, max = 11, message = "Team must have exactly 11 players")
  private java.util.List<Long> players;
}