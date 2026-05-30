package es.ual.comments_service.dto;

import es.ual.comments_service.model.Location;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlayerResponse {
  private Long id;
  private String name;
  private String firstName;
  private String lastName;
  private Integer age;
  private String nationality;
  private String height;
  private String weight;
  private Integer number;
  private String team;
  private String league;
  private String position;
  private String photo;
  private Location location;
  private Long externalId;
}