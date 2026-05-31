import { Observable } from 'rxjs';
import { NewsModel } from '@core/models/news.model';

export interface NewsProviderInterface {
  getNews(): Observable<NewsModel[]>;
  getNewsById(id: number): Observable<NewsModel>;
  createNews(news: Partial<NewsModel>): Observable<NewsModel>;
}