import { Observable, throwError } from 'rxjs';
import { BaseProvider } from '../base-provider';
import { NewsProviderInterface } from '../news-provider.interface';
import { NewsModel } from '@core/models/news.model';

export class SpringNewsProvider
  extends BaseProvider
  implements NewsProviderInterface
{
  getNews(): Observable<NewsModel[]> {
    // TODO: Implement when news-service backend is ready
    return throwError(() => new Error('SpringNewsProvider.getNews() not implemented yet'));
  }

  getNewsById(id: number): Observable<NewsModel> {
    // TODO: Implement when news-service backend is ready
    return throwError(() => new Error('SpringNewsProvider.getNewsById() not implemented yet'));
  }

  createNews(news: Partial<NewsModel>): Observable<NewsModel> {
    // TODO: Implement when news-service backend is ready
    return throwError(() => new Error('SpringNewsProvider.createNews() not implemented yet'));
  }
}