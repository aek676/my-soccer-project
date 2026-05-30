import { Observable } from 'rxjs';
import { CommentModel } from '@core/models/comment.model';
import { BaseProvider } from '../base-provider';
import { CommentProviderInterface } from '../comment-provider.interface';

export class SpringCommentProvider
  extends BaseProvider
  implements CommentProviderInterface
{
  getCommentsByPlayer(_playerId: string): Observable<CommentModel[]> {
    throw new Error('Comments service not available');
  }

  createComment(_comment: CommentModel): Observable<CommentModel> {
    throw new Error('Comments service not available');
  }

  deleteComment(_id: string): Observable<void> {
    throw new Error('Comments service not available');
  }
}
