package es.ual.comments_service.exception;

import es.ual.comments_service.dto.ErrorResponse;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ControllerAdvice;

@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(CommentNotFoundException.class)
  public ResponseEntity<ErrorResponse> handleCommentNotFound(CommentNotFoundException ex) {
    return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
  }

  @ExceptionHandler(PlayerNotFoundException.class)
  public ResponseEntity<ErrorResponse> handlePlayerNotFound(PlayerNotFoundException ex) {
    return ResponseEntity.status(404).body(new ErrorResponse(404, ex.getMessage()));
  }

  @ExceptionHandler(UnauthorizedException.class)
  public ResponseEntity<ErrorResponse> handleUnauthorized(UnauthorizedException ex) {
    return ResponseEntity.status(401).body(new ErrorResponse(401, ex.getMessage()));
  }

  @ExceptionHandler(TypeMismatchException.class)
  public ResponseEntity<ErrorResponse> handleTypeMismatch(TypeMismatchException ex) {
    return ResponseEntity.status(400).body(new ErrorResponse(400, "Invalid ID format"));
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
    String message = ex.getBindingResult().getFieldErrors().stream()
        .map(e -> e.getField() + ": " + e.getDefaultMessage())
        .reduce((a, b) -> a + "; " + b)
        .orElse("Validation error");
    return ResponseEntity.status(400).body(new ErrorResponse(400, message));
  }

  @ExceptionHandler(Exception.class)
  public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
    return ResponseEntity.status(500).body(new ErrorResponse(500, "Internal server error"));
  }
}