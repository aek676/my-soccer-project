package es.ual.players_service.exception;

public class PlayerNotFoundException extends RuntimeException {

  public PlayerNotFoundException(Long id) {
    super("Player not found with id: " + id);
  }
}
