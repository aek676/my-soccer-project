import { Observable, of } from 'rxjs';
import { CommentModel } from '@core/models/comment.model';
import { BaseProvider } from '@core/providers/base-provider';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';

// TODO: Conectar con comments-service/api/comments cuando esté implementado
// TODO: Definir los endpoints exactos (GET /comments-service/comments?playerid=, POST /comments-service/comments, DELETE /comments-service/comments/:id)
export class SpringCommentProvider extends BaseProvider implements CommentProviderInterface {
  getCommentsByPlayer(playerId: string): Observable<CommentModel[]> {
    // TODO: return this.http.get<CommentModel[]>(`${this.gatewayUrl}/comments-service/comments?playerid=${playerId}`);
    return of([]);
  }

  createComment(comment: CommentModel): Observable<CommentModel> {
    // TODO: return this.http.post<CommentModel>(`${this.gatewayUrl}/comments-service/comments`, comment);
    return of(comment);
  }

  deleteComment(id: string): Observable<void> {
    // TODO: return this.http.delete<void>(`${this.gatewayUrl}/comments-service/comments/${id}`);
    return of(undefined);
  }
}
