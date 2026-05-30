import { Observable, map } from 'rxjs';
import { CommentModel } from '@core/models/comment.model';
import { BaseProvider } from '../base-provider';
import { CommentProviderInterface } from '../comment-provider.interface';

interface CommentResponse extends Omit<CommentModel, 'created'> {
  created?: string;
}

export class NodeCommentProvider
  extends BaseProvider
  implements CommentProviderInterface
{
  getCommentsByPlayer(playerId: string): Observable<CommentModel[]> {
    return this.http
      .get<CommentResponse[]>(`${this.gatewayUrl}/bun-backend/comments`, {
        params: { playerId },
      })
      .pipe(map((comments) => comments.map((c) => this.mapComment(c))));
  }

  createComment(comment: CommentModel): Observable<CommentModel> {
    const { id, idUser, created, ...body } = comment;
    return this.http
      .post<CommentResponse>(`${this.gatewayUrl}/bun-backend/comments`, body)
      .pipe(map((c) => this.mapComment(c)));
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.gatewayUrl}/bun-backend/comments/${id}`,
    );
  }

  private mapComment(comment: CommentResponse): CommentModel {
    const created = comment.created
      ? new Date(comment.created).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';
    return { ...comment, created };
  }
}
