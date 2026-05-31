import { Observable, throwError } from 'rxjs';
import { BaseProvider } from '../base-provider';
import { NewsProviderInterface } from '../news-provider.interface';
import { NewsModel } from '@core/models/news.model';

export class NodeNewsProvider
  extends BaseProvider
  implements NewsProviderInterface
{
  getNews(): Observable<NewsModel[]> {
    // TODO: Implement when news-service backend is ready
    return throwError(() => new Error('NodeNewsProvider.getNews() not implemented yet'));
  }

  getNewsById(id: number): Observable<NewsModel> {
    // TODO: Implement when news-service backend is ready
    return throwError(() => new Error('NodeNewsProvider.getNewsById() not implemented yet'));
  }

  createNews(news: Partial<NewsModel>): Observable<NewsModel> {
    // TODO: Implement when news-service backend is ready
    return throwError(() => new Error('NodeNewsProvider.createNews() not implemented yet'));
  }
}