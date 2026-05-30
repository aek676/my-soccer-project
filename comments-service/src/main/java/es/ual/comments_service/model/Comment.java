package es.ual.comments_service.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String author;

  @Column(nullable = false, length = 1000)
  private String text;

  @Column(nullable = false)
  private Integer rating;

  private LocalDateTime created;

  @Embedded
  private Location location;

  @Column(nullable = false)
  private Long idPlayer;

  @Column(nullable = false)
  private String idUser;
}