package es.ual.players_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiSportsPlayer {
  private Long id;
  private String name;
  private String firstname;
  private String lastname;
  private Integer age;
  private ApiSportsBirth birth;
  private String nationality;
  private String height;
  private String weight;
  private Integer number;
  private String position;
  private String photo;
}