package es.ual.players_service.exception;

import static org.assertj.core.api.Assertions.assertThat;

import es.ual.players_service.controller.PlayerController;
import es.ual.players_service.dto.ErrorResponse;
import es.ual.players_service.dto.PlayerCreateRequest;
import java.lang.reflect.Method;
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
  void handleNotFound_shouldReturn404() {
    PlayerNotFoundException ex = new PlayerNotFoundException(99L);

    ResponseEntity<ErrorResponse> response = handler.handleNotFound(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(404);
    assertThat(response.getBody().getCode()).isEqualTo(404);
    assertThat(response.getBody().getMessage()).isEqualTo("Player not found with id: 99");
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
    Method method = PlayerController.class.getMethod("createPlayer", PlayerCreateRequest.class);
    MethodParameter param = new MethodParameter(method, 0);
    BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(new PlayerCreateRequest(), "request");
    bindingResult.rejectValue("name", "NotBlank", "name is required");
    MethodArgumentNotValidException ex = new MethodArgumentNotValidException(param, bindingResult);

    ResponseEntity<ErrorResponse> response = handler.handleValidation(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(400);
    assertThat(response.getBody().getCode()).isEqualTo(400);
    assertThat(response.getBody().getMessage()).contains("name");
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
