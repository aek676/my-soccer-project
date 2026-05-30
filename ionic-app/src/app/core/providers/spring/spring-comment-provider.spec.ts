import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SpringCommentProvider } from './spring-comment-provider';
import { BackendConfigType } from '@core/types/backend-config.type';
import { CommentModel } from '@core/models/comment.model';

describe('SpringCommentProvider', () => {
  let provider: SpringCommentProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new SpringCommentProvider(config, httpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create an instance with config', () => {
    expect(provider).toBeTruthy();
  });

  describe('getCommentsByPlayer', () => {
    it('should fetch comments via GET and map response', () => {
      const playerId = '1';
      const apiResponse = [
        {
          id: 1,
          author: 'Scout A',
          text: 'Great player',
          rating: 5,
          created: '2024-01-15T00:00:00',
          idPlayer: 1,
          idUser: 'u1',
          location: { type: 'Point', coordinates: [-3.7038, 40.4168] },
        },
        {
          id: 2,
          author: 'Scout B',
          text: 'Needs work',
          rating: 3,
          idPlayer: 1,
          idUser: 'u2',
          location: { type: 'Point', coordinates: [2.1686, 41.3874] },
        },
      ];

      let result: CommentModel[] | undefined;
      provider.getCommentsByPlayer(playerId).subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/comments-service/comments?playerId=1',
      );
      expect(req.request.method).toBe('GET');
      req.flush(apiResponse);

      expect(result?.length).toBe(2);
      expect(result![0].created).toBe('Jan 15, 2024');
      expect(result![1].created).toBe('');
    });
  });

  describe('createComment', () => {
    it('should POST comment without id/idUser/created and map response', () => {
      const input: CommentModel = {
        id: 'ignored',
        author: 'Scout C',
        text: 'New comment',
        rating: 5,
        created: 'should-be-stripped',
        idPlayer: '2',
        idUser: 'ignored-user',
        location: { type: 'Point', coordinates: [4, 43] },
      };

      const apiResponse = {
        id: 3,
        author: 'Scout C',
        text: 'New comment',
        rating: 5,
        created: '2024-06-01T12:00:00',
        idPlayer: 2,
        idUser: 'ignored-user',
        location: { type: 'Point', coordinates: [4, 43] },
      };

      let result: CommentModel | undefined;
      provider.createComment(input).subscribe((r) => (result = r));

      const req = httpMock.expectOne(
        'http://localhost:8080/comments-service/comments',
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        author: 'Scout C',
        text: 'New comment',
        rating: 5,
        idPlayer: '2',
        location: { type: 'Point', coordinates: [4, 43] },
      });
      req.flush(apiResponse);

      expect(result?.created).toBe('Jun 1, 2024');
    });
  });

  describe('deleteComment', () => {
    it('should DELETE comment by id', () => {
      let called = false;
      provider.deleteComment('1').subscribe(() => (called = true));

      const req = httpMock.expectOne(
        'http://localhost:8080/comments-service/comments/1',
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      expect(called).toBeTrue();
    });
  });
});