package es.ual.ideal_team_service.exception;

public class InvalidPlayerCountException extends RuntimeException {
  public InvalidPlayerCountException(String message) {
    super(message);
  }
}