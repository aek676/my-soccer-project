package es.ual.comments_service.dto;

import es.ual.comments_service.model.Location;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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
public class CommentCreateRequest {

  @Size(max = 1000, message = "Text must not exceed 1000 characters")
  private String text;

  @NotNull(message = "Rating is required")
  @Min(value = 0, message = "Rating must be at least 0")
  @Max(value = 5, message = "Rating must be at most 5")
  private Integer rating;

  private String author;

  @NotNull(message = "Player ID is required")
  private Long idPlayer;

  private Location location;
}