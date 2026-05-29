import { Observable } from 'rxjs';
import { CommentModel } from '@core/models/comment.model';

export interface CommentProviderInterface {
  getCommentsByPlayer(playerId: string): Observable<CommentModel[]>;
  createComment(comment: CommentModel): Observable<CommentModel>;
  deleteComment(id: string): Observable<void>;
}
