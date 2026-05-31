package es.ual.ideal_team_service.exception;

import static org.assertj.core.api.Assertions.assertThat;

import es.ual.ideal_team_service.dto.ErrorResponse;
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
  void handlePlayerNotFound_shouldReturn404() {
    PlayerNotFoundException ex = new PlayerNotFoundException(99L);

    ResponseEntity<ErrorResponse> response = handler.handlePlayerNotFound(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(404);
    assertThat(response.getBody().getCode()).isEqualTo(404);
    assertThat(response.getBody().getMessage()).isEqualTo("Player not found with id: 99");
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
  void handleInvalidPlayerCount_shouldReturn400() {
    InvalidPlayerCountException ex =
        new InvalidPlayerCountException("Team must have exactly 11 players");

    ResponseEntity<ErrorResponse> response = handler.handleInvalidPlayerCount(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(400);
    assertThat(response.getBody().getCode()).isEqualTo(400);
    assertThat(response.getBody().getMessage()).isEqualTo("Team must have exactly 11 players");
  }

  @Test
  void handleInsufficientPlayers_shouldReturn400() {
    InsufficientPlayersException ex =
        new InsufficientPlayersException("Not enough players in database. Found: 5");

    ResponseEntity<ErrorResponse> response = handler.handleInsufficientPlayers(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(400);
    assertThat(response.getBody().getCode()).isEqualTo(400);
    assertThat(response.getBody().getMessage()).contains("Not enough players");
  }

  @Test
  void handleAiConfiguration_shouldReturn500() {
    AiConfigurationException ex = new AiConfigurationException("GROQ_API_KEY not configured");

    ResponseEntity<ErrorResponse> response = handler.handleAiConfiguration(ex);

    assertThat(response.getStatusCode().value()).isEqualTo(500);
    assertThat(response.getBody().getCode()).isEqualTo(500);
    assertThat(response.getBody().getMessage()).isEqualTo("GROQ_API_KEY not configured");
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
    java.lang.reflect.Method method =
        es.ual.ideal_team_service.controller.IdealTeamController.class.getMethod(
            "saveIdealTeam",
            es.ual.ideal_team_service.dto.IdealTeamSaveRequest.class, String.class);
    MethodParameter param = new MethodParameter(method, 0);
    BeanPropertyBindingResult bindingResult = new BeanPropertyBindingResult(
        new es.ual.ideal_team_service.dto.IdealTeamSaveRequest(), "request");
    bindingResult.rejectValue("name", "NotBlank", "Name is required");
    MethodArgumentNotValidException ex =
        new MethodArgumentNotValidException(param, bindingResult);

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