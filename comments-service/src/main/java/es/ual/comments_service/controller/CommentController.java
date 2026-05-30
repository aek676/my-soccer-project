package es.ual.comments_service.controller;

import es.ual.comments_service.dto.CommentCreateRequest;
import es.ual.comments_service.dto.CommentResponse;
import es.ual.comments_service.dto.ErrorResponse;
import es.ual.comments_service.exception.UnauthorizedException;
import es.ual.comments_service.service.CommentService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;

  @GetMapping
  public ResponseEntity<List<CommentResponse>> getCommentsByPlayerId(
      @RequestParam("playerId") Long playerId) {
    return ResponseEntity.ok(commentService.getCommentsByPlayerId(playerId));
  }

  @PostMapping
  public ResponseEntity<CommentResponse> createComment(
      @Valid @RequestBody CommentCreateRequest request,
      @RequestHeader(value = "X-User-Id", required = false) String userId) {
    if (userId == null || userId.isBlank()) {
      throw new UnauthorizedException();
    }
    CommentResponse response = commentService.createComment(request, userId);
    return ResponseEntity.status(HttpStatus.CREATED).body(response);
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
    commentService.deleteComment(id);
    return ResponseEntity.noContent().build();
  }
}