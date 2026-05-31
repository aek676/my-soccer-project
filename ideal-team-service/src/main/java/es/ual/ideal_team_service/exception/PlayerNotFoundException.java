package es.ual.ideal_team_service.exception;

public class PlayerNotFoundException extends RuntimeException {
  public PlayerNotFoundException(Long id) {
    super("Player not found with id: " + id);
  }
}