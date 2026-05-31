import { Observable, of } from 'rxjs';
import { NewsModel } from '@core/models/news.model';
import { NewsProviderInterface } from '@core/providers/news-provider.interface';

const MOCK_NEWS: NewsModel[] = [
  {
    idNews: 1,
    title: 'Contract Renegotiations Stall After Final Quarter Performance Dip',
    body: 'Preliminary talks regarding an extension for the star forward have hit a wall. Sources indicate that management is hesitant to commit long-term capital following a statistically weak final quarter, despite Johnson\'s historic early-season run. Agents are reportedly exploring lateral moves.',
    tags: 'contract,negotiation',
    created: '2023-10-24 09:15 EST',
    idPlayer: 1,
  },
  {
    idNews: 2,
    title: 'Medical Clearance Granted Ahead of Critical Playoffs',
    body: 'The medical staff has officially cleared Thorne for full-contact practice. This unexpected early recovery bolsters the squad\'s defensive rating significantly. Analysts predict his return could shift the series odds by a considerable margin, pending his integration back into the starting lineup.',
    tags: 'medical,playoffs',
    created: '2023-10-23 14:30 EST',
    idPlayer: 2,
  },
  {
    idNews: 3,
    title: 'Sponsorship Deal Finalized with Major Apparel Brand',
    body: 'A multi-year endorsement contract has been signed, elevating Pierce\'s commercial profile. The agreement includes performance-based incentives and an exclusive footwear line slated for next fiscal year. Financial details remain undisclosed but are rumored to be top-tier for his position.',
    tags: 'sponsorship,commercial',
    created: '2023-10-21 11:00 EST',
    idPlayer: 3,
  },
];

export class MockNewsProvider implements NewsProviderInterface {
  private news: NewsModel[] = [...MOCK_NEWS];

  getNews(): Observable<NewsModel[]> {
    return of(this.news);
  }

  getNewsById(id: number): Observable<NewsModel> {
    const article = this.news.find((n) => n.idNews === id);
    return of(article!);
  }

  createNews(news: Partial<NewsModel>): Observable<NewsModel> {
    const newArticle: NewsModel = {
      idNews: Math.max(...this.news.map((n) => n.idNews)) + 1,
      title: news.title ?? '',
      body: news.body ?? '',
      tags: news.tags,
      created: new Date().toISOString(),
      idPlayer: news.idPlayer,
    };
    this.news = [...this.news, newArticle];
    return of(newArticle);
  }
}