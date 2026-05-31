package es.ual.news_service.client;

import es.ual.news_service.dto.PlayerResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "players-service")
public interface PlayerServiceClient {

  @GetMapping("/players/{id}")
  ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id);
}