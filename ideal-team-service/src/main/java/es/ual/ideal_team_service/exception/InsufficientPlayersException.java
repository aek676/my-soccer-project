package es.ual.ideal_team_service.exception;

public class InsufficientPlayersException extends RuntimeException {
  public InsufficientPlayersException(String message) {
    super(message);
  }
}