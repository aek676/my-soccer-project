import { Observable, map } from 'rxjs';
import { NewsModel } from '@core/models/news.model';
import { BaseProvider } from '../base-provider';
import { NewsProviderInterface } from '../news-provider.interface';

export class SpringNewsProvider
  extends BaseProvider
  implements NewsProviderInterface
{
  getNews(): Observable<NewsModel[]> {
    return this.http
      .get<NewsModel[]>(`${this.gatewayUrl}/news-service/news`)
      .pipe(map((articles) => articles.map((a) => this.mapNews(a))));
  }

  getNewsById(id: number): Observable<NewsModel> {
    return this.http
      .get<NewsModel>(`${this.gatewayUrl}/news-service/news/${id}`)
      .pipe(map((a) => this.mapNews(a)));
  }

  createNews(news: Partial<NewsModel>): Observable<NewsModel> {
    const tags = news.tags ?? '';
    return this.http
      .post<NewsModel>(`${this.gatewayUrl}/news-service/news`, {
        title: news.title,
        body: news.body,
        tags,
        idPlayer: news.idPlayer,
      })
      .pipe(map((a) => this.mapNews(a)));
  }

  private mapNews(article: NewsModel): NewsModel {
    const created = article.created
      ? new Date(article.created).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '';
    return { ...article, idPlayer: String(article.idPlayer), created };
  }
}
