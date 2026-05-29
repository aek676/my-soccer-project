import { Observable, of } from 'rxjs';
import { CommentModel } from '@core/models/comment.model';
import { CommentProviderInterface } from '@core/providers/comment-provider.interface';

// TODO: Eliminar este archivo cuando el backend esté listo
const MOCK_COMMENTS: CommentModel[] = [
  {
    id: '1',
    author: 'Scout Alpha',
    text: 'Exceptional pace off the ball. Shows consistent ability to break lines and find space in the final third.',
    rating: 4.5,
    created: 'Oct 12, 2023',
    idPlayer: '1',
    idUser: 'guest',
    location: { type: 'Point', coordinates: [-0.12, 51.51] },
  },
  {
    id: '2',
    author: 'Scout Beta',
    text: 'Elite tactical awareness during transition phases. Acted as the primary pivot in counter-attacks.',
    rating: 5,
    created: 'Sep 28, 2023',
    idPlayer: '1',
    idUser: 'guest',
    location: { type: 'Point', coordinates: [-0.12, 51.51] },
  },
];

export class MockCommentProvider implements CommentProviderInterface {
  private comments: CommentModel[] = [...MOCK_COMMENTS];

  getCommentsByPlayer(playerId: string): Observable<CommentModel[]> {
    return of(this.comments.filter((c) => c.idPlayer === playerId));
  }

  createComment(comment: CommentModel): Observable<CommentModel> {
    this.comments = [...this.comments, comment];
    return of(comment);
  }

  deleteComment(id: string): Observable<void> {
    this.comments = this.comments.filter((c) => c.id !== id);
    return of(undefined);
  }
}
