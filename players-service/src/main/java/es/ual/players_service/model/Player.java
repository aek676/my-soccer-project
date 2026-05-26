package es.ual.players_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "players")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String name;

  private String firstName;

  private String lastName;

  private Integer age;

  private LocalDate birthdate;

  private String nationality;

  private String height;

  private String weight;

  private Integer number;

  private String team;

  private String league;

  private String position;

  private String photo;

  @JdbcTypeCode(SqlTypes.JSON)
  @Column(columnDefinition = "jsonb")
  private Location location;

  private LocalDateTime created;
}
