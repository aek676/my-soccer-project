package es.ual.comments_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import es.ual.comments_service.client.PlayerServiceClient;
import es.ual.comments_service.dto.CommentCreateRequest;
import es.ual.comments_service.dto.CommentResponse;
import es.ual.comments_service.dto.PlayerResponse;
import es.ual.comments_service.exception.CommentNotFoundException;
import es.ual.comments_service.exception.PlayerNotFoundException;
import es.ual.comments_service.model.Comment;
import es.ual.comments_service.model.Location;
import es.ual.comments_service.repository.CommentRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

  @Mock
  private CommentRepository commentRepository;

  @Mock
  private PlayerServiceClient playerServiceClient;

  @InjectMocks
  private CommentService commentService;

  @Test
  void getCommentsByPlayerId_shouldReturnComments() {
    Location loc = Location.builder().type("Point").coordinates(new Double[]{-3.7038, 40.4168}).build();
    Comment comment = Comment.builder()
        .id(1L).text("Great!").rating(5).author("John").idPlayer(1L).idUser("user123")
        .location(loc).created(LocalDateTime.now()).build();
    PlayerResponse player = PlayerResponse.builder().id(1L).name("Vinícius").build();

    when(playerServiceClient.getPlayerById(1L)).thenReturn(ResponseEntity.ok(player));
    when(commentRepository.findByIdPlayer(1L)).thenReturn(List.of(comment));

    List<CommentResponse> result = commentService.getCommentsByPlayerId(1L);

    assertThat(result).hasSize(1);
    assertThat(result.get(0).getText()).isEqualTo("Great!");
    assertThat(result.get(0).getRating()).isEqualTo(5);
  }

  @Test
  void getCommentsByPlayerId_shouldThrowWhenPlayerNotFound() {
    when(playerServiceClient.getPlayerById(99L)).thenThrow(new RuntimeException("Not found"));

    assertThatThrownBy(() -> commentService.getCommentsByPlayerId(99L))
        .isInstanceOf(PlayerNotFoundException.class);
  }

  @Test
  void createComment_shouldSaveAndReturnComment() {
    Location loc = Location.builder().type("Point").coordinates(new Double[]{-3.7038, 40.4168}).build();
    CommentCreateRequest request = CommentCreateRequest.builder()
        .text("Great!").rating(5).author("John").idPlayer(1L).location(loc).build();
    PlayerResponse player = PlayerResponse.builder().id(1L).name("Vinícius").build();

    Comment savedComment = Comment.builder()
        .id(1L).text("Great!").rating(5).author("John").idPlayer(1L).idUser("user123")
        .location(loc).created(LocalDateTime.now()).build();

    when(playerServiceClient.getPlayerById(1L)).thenReturn(ResponseEntity.ok(player));
    when(commentRepository.save(any(Comment.class))).thenReturn(savedComment);

    CommentResponse result = commentService.createComment(request, "user123");

    assertThat(result).isNotNull();
    assertThat(result.getId()).isEqualTo(1L);
    assertThat(result.getText()).isEqualTo("Great!");
    assertThat(result.getIdUser()).isEqualTo("user123");
    verify(commentRepository).save(any(Comment.class));
  }

  @Test
  void createComment_shouldThrowWhenPlayerNotFound() {
    CommentCreateRequest request = CommentCreateRequest.builder()
        .text("Great!").rating(5).idPlayer(99L).build();

    when(playerServiceClient.getPlayerById(99L)).thenThrow(new RuntimeException("Not found"));

    assertThatThrownBy(() -> commentService.createComment(request, "user123"))
        .isInstanceOf(PlayerNotFoundException.class);
  }

  @Test
  void deleteComment_shouldDeleteWhenFound() {
    Comment comment = Comment.builder()
        .id(1L).text("Great!").rating(5).idPlayer(1L).idUser("user123").build();
    when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));

    commentService.deleteComment(1L);

    verify(commentRepository).delete(comment);
  }

  @Test
  void deleteComment_shouldThrowWhenNotFound() {
    when(commentRepository.findById(99L)).thenReturn(Optional.empty());

    assertThatThrownBy(() -> commentService.deleteComment(99L))
        .isInstanceOf(CommentNotFoundException.class)
        .hasMessage("Comment not found with id: 99");
  }
}