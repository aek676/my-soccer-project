package es.ual.news_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsCreateRequest {
  private String title;
  private String body;
  private String tags;
  private String playerName;
}