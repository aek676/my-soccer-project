package es.ual.comments_service.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import es.ual.comments_service.dto.CommentCreateRequest;
import es.ual.comments_service.dto.CommentResponse;
import es.ual.comments_service.exception.CommentNotFoundException;
import es.ual.comments_service.exception.GlobalExceptionHandler;
import es.ual.comments_service.exception.PlayerNotFoundException;
import es.ual.comments_service.exception.UnauthorizedException;
import es.ual.comments_service.model.Location;
import es.ual.comments_service.service.CommentService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

@ExtendWith(MockitoExtension.class)
class CommentControllerTest {

  @Mock
  private CommentService commentService;

  @InjectMocks
  private CommentController commentController;

  private MockMvc mockMvc;
  private ObjectMapper objectMapper;

  @BeforeEach
  void setUp() {
    mockMvc = MockMvcBuilders.standaloneSetup(commentController)
        .setControllerAdvice(new GlobalExceptionHandler())
        .build();
    objectMapper = new ObjectMapper();
  }

  @Test
  void getCommentsByPlayerId_shouldReturn200() throws Exception {
    Location loc = Location.builder().type("Point").coordinates(new Double[]{-3.7038, 40.4168}).build();
    CommentResponse comment = CommentResponse.builder()
        .id(1L).text("Great player!").rating(5).author("John").idPlayer(1L).idUser("user123")
        .location(loc).created(LocalDateTime.now()).build();
    when(commentService.getCommentsByPlayerId(1L)).thenReturn(List.of(comment));

    mockMvc.perform(get("/comments")
            .param("playerId", "1")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].text").value("Great player!"))
        .andExpect(jsonPath("$[0].rating").value(5));
  }

  @Test
  void getCommentsByPlayerId_shouldReturn404WhenPlayerNotFound() throws Exception {
    when(commentService.getCommentsByPlayerId(99L)).thenThrow(new PlayerNotFoundException(99L));

    mockMvc.perform(get("/comments")
            .param("playerId", "99")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404));
  }

  @Test
  void createComment_shouldReturn201() throws Exception {
    CommentCreateRequest request = CommentCreateRequest.builder()
        .text("Great player!").rating(5).author("John").idPlayer(1L).build();

    CommentResponse response = CommentResponse.builder()
        .id(1L).text("Great player!").rating(5).author("John").idPlayer(1L).idUser("user123").build();

    when(commentService.createComment(any(CommentCreateRequest.class), anyString())).thenReturn(response);

    mockMvc.perform(post("/comments")
            .contentType(MediaType.APPLICATION_JSON)
            .header("X-User-Id", "user123")
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1))
        .andExpect(jsonPath("$.text").value("Great player!"));
  }

  @Test
  void createComment_shouldReturn401WhenNoUserId() throws Exception {
    CommentCreateRequest request = CommentCreateRequest.builder()
        .text("Great player!").rating(5).idPlayer(1L).build();

    mockMvc.perform(post("/comments")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.code").value(401));
  }

  @Test
  void createComment_shouldReturn404WhenPlayerNotFound() throws Exception {
    CommentCreateRequest request = CommentCreateRequest.builder()
        .text("Great player!").rating(5).idPlayer(99L).build();

    when(commentService.createComment(any(CommentCreateRequest.class), anyString()))
        .thenThrow(new PlayerNotFoundException(99L));

    mockMvc.perform(post("/comments")
            .contentType(MediaType.APPLICATION_JSON)
            .header("X-User-Id", "user123")
            .content(objectMapper.writeValueAsString(request)))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404));
  }

  @Test
  void deleteComment_shouldReturn204() throws Exception {
    mockMvc.perform(delete("/comments/1")).andExpect(status().isNoContent());
  }

  @Test
  void deleteComment_shouldReturn404WhenNotFound() throws Exception {
    org.mockito.Mockito.doThrow(new CommentNotFoundException(99L))
        .when(commentService).deleteComment(anyLong());

    mockMvc.perform(delete("/comments/99"))
        .andExpect(status().isNotFound())
        .andExpect(jsonPath("$.code").value(404));
  }
}