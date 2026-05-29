import { Observable, of } from 'rxjs';
import { CommentModel } from '@core/models/comment.model';
import { BaseProvider } from '@core/providers/base-provider';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';

// TODO: Conectar con bun-backend/api/comments cuando esté implementado
// TODO: Definir los endpoints exactos (GET /bun-backend/comments?playerid=, POST /bun-backend/comments, DELETE /bun-backend/comments/:id)
export class NodeCommentProvider extends BaseProvider implements CommentProviderInterface {
  getCommentsByPlayer(playerId: string): Observable<CommentModel[]> {
    // TODO: return this.http.get<CommentModel[]>(`${this.gatewayUrl}/bun-backend/comments?playerid=${playerId}`);
    return of([]);
  }

  createComment(comment: CommentModel): Observable<CommentModel> {
    // TODO: return this.http.post<CommentModel>(`${this.gatewayUrl}/bun-backend/comments`, comment);
    return of(comment);
  }

  deleteComment(id: string): Observable<void> {
    // TODO: return this.http.delete<void>(`${this.gatewayUrl}/bun-backend/comments/${id}`);
    return of(undefined);
  }
}
