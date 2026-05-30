package es.ual.comments_service.dto;

import es.ual.comments_service.model.Location;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentResponse {
  private Long id;
  private String author;
  private String text;
  private Integer rating;
  private LocalDateTime created;
  private Long idPlayer;
  private String idUser;
  private Location location;
}