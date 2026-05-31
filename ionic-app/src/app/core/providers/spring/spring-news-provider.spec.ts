import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpringNewsProvider } from './spring-news-provider';
import { BackendConfigType } from '@core/types/backend-config.type';
import { NewsModel } from '@core/models/news.model';

describe('SpringNewsProvider', () => {
  let provider: SpringNewsProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new SpringNewsProvider(config, httpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getNews', () => {
    it('should fetch news via GET and map response', () => {
      const apiResponse = [
        {
          idNews: 1,
          title: 'Contract Renegotiations Stall',
          body: 'Preliminary talks have hit a wall.',
          tags: 'contract,negotiation',
          created: '2024-01-15T00:00:00',
          idPlayer: 1,
        },
        {
          idNews: 2,
          title: 'Medical Clearance Granted',
          body: 'The medical staff has officially cleared Thorne.',
          tags: 'medical,playoffs',
          created: '2024-01-16T00:00:00',
          idPlayer: 2,
        },
      ];

      let result: NewsModel[] | undefined;
      provider.getNews().subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/news-service/news',
      );
      expect(req.request.method).toBe('GET');
      req.flush(apiResponse);

      expect(result?.length).toBe(2);
      expect(result![0].created).toBe('Jan 15, 2024');
      expect(result![1].created).toBe('Jan 16, 2024');
      expect(result![0].idPlayer).toBe('1');
      expect(result![1].idPlayer).toBe('2');
    });
  });

  describe('getNewsById', () => {
    it('should fetch single news article via GET and map response', () => {
      const apiResponse = {
        idNews: 1,
        title: 'Contract Renegotiations Stall',
        body: 'Preliminary talks have hit a wall.',
        tags: 'contract,negotiation',
        created: '2024-01-15T00:00:00',
        idPlayer: 1,
      };

      let result: NewsModel | undefined;
      provider.getNewsById(1).subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/news-service/news/1',
      );
      expect(req.request.method).toBe('GET');
      req.flush(apiResponse);

      expect(result!.idNews).toBe(1);
      expect(result!.created).toBe('Jan 15, 2024');
      expect(result!.idPlayer).toBe('1');
    });
  });

  describe('createNews', () => {
    it('should POST news article and map response', () => {
      const input = {
        title: 'New Contract',
        body: 'A new contract has been signed.',
        tags: 'contract',
        idPlayer: '1' as string | number,
      };

      const apiResponse = {
        idNews: 3,
        title: 'New Contract',
        body: 'A new contract has been signed.',
        tags: 'contract',
        created: '2024-06-01T12:00:00',
        idPlayer: 1,
      };

      let result: NewsModel | undefined;
      provider.createNews(input).subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/news-service/news',
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        title: 'New Contract',
        body: 'A new contract has been signed.',
        tags: 'contract',
        idPlayer: '1',
      });
      req.flush(apiResponse);

      expect(result!.idNews).toBe(3);
      expect(result!.created).toBe('Jun 1, 2024');
      expect(result!.idPlayer).toBe('1');
    });

    it('should default tags to empty string when undefined', () => {
      const input = {
        title: 'New Contract',
        body: 'A new contract has been signed.',
        tags: undefined as string | undefined,
        idPlayer: '1' as string | number,
      };

      const apiResponse = {
        idNews: 3,
        title: 'New Contract',
        body: 'A new contract has been signed.',
        tags: '',
        created: '2024-06-01T12:00:00',
        idPlayer: 1,
      };

      let result: NewsModel | undefined;
      provider.createNews(input).subscribe((r) => (result = r));

      const req = httpMock.expectOne('http://localhost:8080/news-service/news');
      expect(req.request.method).toBe('POST');
      expect(req.request.body.tags).toBe('');
      req.flush(apiResponse);

      expect(result!.idNews).toBe(3);
    });
  });
});