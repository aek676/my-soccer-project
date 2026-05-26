package es.ual.players_service.exception;

import es.ual.players_service.dto.ErrorResponse;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(PlayerNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleNotFound(PlayerNotFoundException ex) {
    return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
  }

  @ExceptionHandler(TypeMismatchException.class)
  public ResponseEntity<ErrorResponse> handleTypeMismatch(TypeMismatchException ex) {
    return ResponseEntity.status(400).body(new ErrorResponse(400, "Invalid ID format"));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
    return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal server error"));
  }
}
