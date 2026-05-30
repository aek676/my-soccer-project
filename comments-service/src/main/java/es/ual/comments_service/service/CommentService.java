package es.ual.comments_service.service;

import es.ual.comments_service.client.PlayerServiceClient;
import es.ual.comments_service.dto.CommentCreateRequest;
import es.ual.comments_service.dto.CommentResponse;
import es.ual.comments_service.dto.PlayerResponse;
import es.ual.comments_service.exception.CommentNotFoundException;
import es.ual.comments_service.exception.PlayerNotFoundException;
import es.ual.comments_service.model.Comment;
import es.ual.comments_service.repository.CommentRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

  private final CommentRepository commentRepository;
  private final PlayerServiceClient playerServiceClient;

  public List<CommentResponse> getCommentsByPlayerId(Long playerId) {
    verifyPlayerExists(playerId);
    List<Comment> comments = commentRepository.findByIdPlayer(playerId);
    return comments.stream().map(this::toResponse).toList();
  }

  public CommentResponse createComment(CommentCreateRequest request, String userId) {
    verifyPlayerExists(request.getIdPlayer());
    Comment comment = Comment.builder()
        .text(request.getText())
        .rating(request.getRating())
        .author(request.getAuthor())
        .idPlayer(request.getIdPlayer())
        .idUser(userId)
        .location(request.getLocation())
        .created(LocalDateTime.now())
        .build();
    Comment saved = commentRepository.save(comment);
    log.info("Created comment with id: {}", saved.getId());
    return toResponse(saved);
  }

  public void deleteComment(Long id) {
    Comment comment = commentRepository.findById(id)
        .orElseThrow(() -> new CommentNotFoundException(id));
    commentRepository.delete(comment);
    log.info("Deleted comment with id: {}", id);
  }

  private void verifyPlayerExists(Long playerId) {
    try {
      ResponseEntity<PlayerResponse> response = playerServiceClient.getPlayerById(playerId);
      if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
        throw new PlayerNotFoundException(playerId);
      }
    } catch (Exception e) {
      throw new PlayerNotFoundException(playerId);
    }
  }

  private CommentResponse toResponse(Comment comment) {
    return CommentResponse.builder()
        .id(comment.getId())
        .author(comment.getAuthor())
        .text(comment.getText())
        .rating(comment.getRating())
        .created(comment.getCreated())
        .idPlayer(comment.getIdPlayer())
        .idUser(comment.getIdUser())
        .location(comment.getLocation())
        .build();
  }
}