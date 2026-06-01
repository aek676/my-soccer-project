package es.ual.news_service.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsResponse {
  private int idNews;
  private String title;
  private String body;
  private String tags;
  private LocalDateTime created;
  private String playerName;
}