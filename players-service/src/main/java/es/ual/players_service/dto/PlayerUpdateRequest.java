package es.ual.players_service.dto;

import es.ual.players_service.model.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerUpdateRequest {
  private String name;
  private String firstName;
  private String lastName;
  private Integer age;
  private String birthdate;
  private String nationality;
  private String height;
  private String weight;
  private Integer number;
  private String team;
  private String league;
  private String position;
  private String photo;
  private Location location;
}