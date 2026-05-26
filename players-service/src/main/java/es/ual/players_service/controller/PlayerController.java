package es.ual.players_service.controller;

import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.service.PlayerService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/players")
@RequiredArgsConstructor
public class PlayerController {

  private final PlayerService playerService;

  @GetMapping
  public ResponseEntity<List<PlayerResponse>> getAllPlayers() {
    return ResponseEntity.ok(playerService.getAllPlayers());
  }

  @GetMapping("/{id}")
  public ResponseEntity<PlayerResponse> getPlayerById(@PathVariable Long id) {
    return ResponseEntity.ok(playerService.getPlayerById(id));
  }
}
