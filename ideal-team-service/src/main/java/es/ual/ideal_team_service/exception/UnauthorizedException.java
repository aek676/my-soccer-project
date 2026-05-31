package es.ual.ideal_team_service.exception;

public class UnauthorizedException extends RuntimeException {

  public UnauthorizedException() {
    super("Unauthorized");
  }

  public UnauthorizedException(String message) {
    super(message);
  }
}