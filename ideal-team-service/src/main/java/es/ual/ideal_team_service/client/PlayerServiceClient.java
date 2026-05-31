package es.ual.ideal_team_service.client;

import es.ual.ideal_team_service.dto.PlayerResponse;
import java.util.List;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "players-service")
public interface PlayerServiceClient {

  @GetMapping("/players")
  ResponseEntity<List<PlayerResponse>> getAllPlayers();

  @GetMapping("/players/{id}")
  ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id);
}