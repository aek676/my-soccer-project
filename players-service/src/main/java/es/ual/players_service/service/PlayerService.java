package es.ual.players_service.service;

import es.ual.players_service.dto.PlayerResponse;
import es.ual.players_service.exception.PlayerNotFoundException;
import es.ual.players_service.model.Player;
import es.ual.players_service.repository.PlayerRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PlayerService {

  private final PlayerRepository playerRepository;

  public List<PlayerResponse> getAllPlayers() {
    return playerRepository.findAll().stream()
        .map(PlayerService::toResponse)
        .toList();
  }

  public PlayerResponse getPlayerById(Long id) {
    return playerRepository.findById(id)
        .map(PlayerService::toResponse)
        .orElseThrow(() -> new PlayerNotFoundException(id));
  }

  private static PlayerResponse toResponse(Player player) {
    return PlayerResponse.builder()
        .id(player.getId())
        .name(player.getName())
        .firstName(player.getFirstName())
        .lastName(player.getLastName())
        .age(player.getAge())
        .birthdate(player.getBirthdate())
        .nationality(player.getNationality())
        .height(player.getHeight())
        .weight(player.getWeight())
        .number(player.getNumber())
        .team(player.getTeam())
        .league(player.getLeague())
        .position(player.getPosition())
        .photo(player.getPhoto())
        .location(player.getLocation())
        .created(player.getCreated())
        .build();
  }
}
