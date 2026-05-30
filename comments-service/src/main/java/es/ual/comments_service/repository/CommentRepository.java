package es.ual.comments_service.repository;

import es.ual.comments_service.model.Comment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
  List<Comment> findByIdPlayer(Long idPlayer);
}