import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NodeNewsProvider } from './node-news-provider';
import { BackendConfigType } from '@core/types/backend-config.type';

describe('NodeNewsProvider', () => {
  let provider: NodeNewsProvider;
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  const config: BackendConfigType = { gatewayUrl: 'http://localhost:8080' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    provider = new NodeNewsProvider(config, httpClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(provider).toBeTruthy();
  });

  describe('getNews', () => {
    it('should throw error indicating not implemented', (done) => {
      provider.getNews().subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('not implemented');
          done();
        },
      });
    });
  });

  describe('getNewsById', () => {
    it('should throw error indicating not implemented', (done) => {
      provider.getNewsById(1).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('not implemented');
          done();
        },
      });
    });
  });

  describe('createNews', () => {
    it('should throw error indicating not implemented', (done) => {
      provider.createNews({ title: 'Test', body: 'Test body' }).subscribe({
        error: (err: Error) => {
          expect(err.message).toContain('not implemented');
          done();
        },
      });
    });
  });
});