package es.ual.news_service.exception;

public class PlayerNotFoundException extends RuntimeException {
  public PlayerNotFoundException(int id) {
    super("Player with id " + id + " not found");
  }
}