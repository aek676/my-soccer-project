package es.ual.comments_service.exception;

import static org.assertj.core.api.Assertions.assertThat;

import es.ual.comments_service.controller.CommentController;
import es.ual.comments_service.dto.ErrorResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.TypeMismatchException;
import org.springframework.core.MethodParameter;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

class GlobalExceptionHandlerTest {

  private GlobalExceptionHandler handler;

  @BeforeEach
  void setUp() {
    handler = new GlobalExceptionHandler();
  }

  @Test
  void handleCommentNotFound_shouldReturn404() {
    CommentNotFoundException ex = new CommentNotFoundException(99L);

    ResponseEntity<ErrorResponse> response = handler.handleCommentNotFound(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(404);
    assertThat(response.getBody().getCode()).isEqualTo(404);
    assertThat(response.getBody().getMessage()).isEqualTo("Comment not found with id: 99");
  }

  @Test
  void handlePlayerNotFound_shouldReturn404() {
    PlayerNotFoundException ex = new PlayerNotFoundException(5L);

    ResponseEntity<ErrorResponse> response = handler.handlePlayerNotFound(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(404);
    assertThat(response.getBody().getCode()).isEqualTo(404);
    assertThat(response.getBody().getMessage()).isEqualTo("Player not found with id: 5");
  }

  @Test
  void handleUnauthorized_shouldReturn401() {
    UnauthorizedException ex = new UnauthorizedException();

    ResponseEntity<ErrorResponse> response = handler.handleUnauthorized(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(401);
    assertThat(response.getBody().getCode()).isEqualTo(401);
    assertThat(response.getBody().getMessage()).isEqualTo("Unauthorized");
  }

  @Test
  void handleUnauthorized_shouldReturn401WithCustomMessage() {
    UnauthorizedException ex = new UnauthorizedException("Custom unauthorized message");

    ResponseEntity<ErrorResponse> response = handler.handleUnauthorized(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(401);
    assertThat(response.getBody().getCode()).isEqualTo(401);
    assertThat(response.getBody().getMessage()).isEqualTo("Custom unauthorized message");
  }

  @Test
  void handleTypeMismatch_shouldReturn400() {
    TypeMismatchException ex = new TypeMismatchException("abc", Long.class);

    ResponseEntity<ErrorResponse> response = handler.handleTypeMismatch(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(400);
    assertThat(response.getBody().getCode()).isEqualTo(400);
    assertThat(response.getBody().getMessage()).isEqualTo("Invalid ID format");
  }

  @Test
  void handleValidation_shouldReturn400WithFieldErrors() throws Exception {
    java.lang.reflect.Method method = CommentController.class.getMethod("createComment",
        es.ual.comments_service.dto.CommentCreateRequest.class, String.class);
    MethodParameter param = new MethodParameter(method, 0);
    BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(
        new es.ual.comments_service.dto.CommentCreateRequest(), "request");
    bindingResult.rejectValue("rating", "NotNull", "rating is required");
    MethodArgumentNotValidException ex = new MethodArgumentNotValidException(param, bindingResult);

    ResponseEntity<ErrorResponse> response = handler.handleValidation(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(400);
    assertThat(response.getBody().getCode()).isEqualTo(400);
    assertThat(response.getBody().getMessage()).contains("rating");
  }

  @Test
  void handleGeneral_shouldReturn500() {
    Exception ex = new Exception("test error");

    ResponseEntity<ErrorResponse> response = handler.handleGeneral(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(500);
    assertThat(response.getBody().getCode()).isEqualTo(500);
    assertThat(response.getBody().getMessage()).isEqualTo("Internal server error");
  }
}