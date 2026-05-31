import { MockNewsProvider } from './mock-news-provider';
import { NewsModel } from '@core/models/news.model';

const EXTRA_NEWS: NewsModel = {
  idNews: 99,
  title: 'Extra Article',
  body: 'Extra body content',
  tags: 'extra',
  created: '2024-01-01 00:00 EST',
  idPlayer: 99,
};

describe('MockNewsProvider', () => {
  let provider: MockNewsProvider;

  beforeEach(() => {
    provider = new MockNewsProvider();
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getNews', () => {
    it('should return all seeded news articles', (done) => {
      provider.getNews().subscribe((news) => {
        expect(news.length).toBe(3);
        done();
      });
    });
  });

  describe('getNewsById', () => {
    it('should return the correct article by id', (done) => {
      provider.getNewsById(1).subscribe((article) => {
        expect(article.idNews).toBe(1);
        expect(article.title).toContain('Contract');
        done();
      });
    });

    it('should return undefined for nonexistent id', (done) => {
      provider.getNewsById(999).subscribe((article) => {
        expect(article).toBeUndefined();
        done();
      });
    });
  });

  describe('createNews', () => {
    it('should add a new article and return it', (done) => {
      provider.getNews().subscribe((before) => {
        expect(before.length).toBe(3);

        provider.createNews(EXTRA_NEWS).subscribe((created) => {
          expect(created.idNews).toBe(4);
          expect(created.title).toBe('Extra Article');

          provider.getNews().subscribe((after) => {
            expect(after.length).toBe(4);
            done();
          });
        });
      });
    });
  });
});