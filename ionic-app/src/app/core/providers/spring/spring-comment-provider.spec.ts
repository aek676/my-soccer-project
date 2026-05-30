import { SpringCommentProvider } from './spring-comment-provider';
import { CommentModel } from '@core/models/comment.model';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('SpringCommentProvider', () => {
  let provider: SpringCommentProvider;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const httpClient = TestBed.inject(HttpClient);
    provider = new SpringCommentProvider(config, httpClient);
  });

  it('should create an instance with config', () => {
    expect(provider).toBeTruthy();
  });

  describe('getCommentsByPlayer', () => {
    it('should throw Comments service not available', () => {
      expect(() => provider.getCommentsByPlayer('1')).toThrowError(
        'Comments service not available',
      );
    });
  });

  describe('createComment', () => {
    it('should throw Comments service not available', () => {
      const comment = {
        id: '1',
        author: 'A',
        text: 'T',
        rating: 5,
        created: '',
        idPlayer: '1',
        idUser: 'u1',
        location: { type: 'Point' as const, coordinates: [2, 41] },
      } as CommentModel;

      expect(() => provider.createComment(comment)).toThrowError(
        'Comments service not available',
      );
    });
  });

  describe('deleteComment', () => {
    it('should throw Comments service not available', () => {
      expect(() => provider.deleteComment('1')).toThrowError(
        'Comments service not available',
      );
    });
  });
});
