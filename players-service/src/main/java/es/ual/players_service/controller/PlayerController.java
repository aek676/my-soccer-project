package es.ual.players_service.controller;

import es.ual.players_service.dto.PlayerCreateRequest;
import es.ual.players_service.dto.PlayerImportRequest;
import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.dto.PlayerUpdateRequest;
import es.ual.players_service.service.PlayerService;
import java.util.List;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

  @GetMapping("/search/{name}")
  public ResponseEntity<List<PlayerResponse>> searchPlayerByName(@PathVariable String name) {
    return ResponseEntity.ok(playerService.searchPlayerByName(name));
  }

  @PostMapping
  public ResponseEntity<PlayerResponse> createPlayer(@RequestBody PlayerCreateRequest request) {
    PlayerResponse response = playerService.createPlayer(request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PostMapping("/import/{apiPlayerId}")
  public ResponseEntity<PlayerResponse> importPlayerFromApi(
      @PathVariable Long apiPlayerId,
      @RequestBody PlayerImportRequest request) {
    PlayerResponse response = playerService.importPlayerFromApi(apiPlayerId, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @PatchMapping("/{id}")
  public ResponseEntity<Void> updatePlayer(
      @PathVariable Long id,
      @RequestBody PlayerUpdateRequest request) {
    playerService.updatePlayer(id, request);
    return ResponseEntity.noContent().build();
  }
}
