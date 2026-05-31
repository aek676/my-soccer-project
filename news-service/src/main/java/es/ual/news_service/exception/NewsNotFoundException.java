package es.ual.news_service.exception;

public class NewsNotFoundException extends RuntimeException {
  public NewsNotFoundException(int id) {
    super("News with id " + id + " not found");
  }
}