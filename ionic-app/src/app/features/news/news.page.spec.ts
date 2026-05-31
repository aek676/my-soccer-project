import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { NewsModel } from '@core/models/news.model';
import { of } from 'rxjs';

import { NewsPage } from './news.page';

const mockNews: NewsModel[] = [
  {
    idNews: 1,
    title: 'Contract Renegotiations Stall',
    body: 'Preliminary talks regarding an extension have hit a wall.',
    tags: 'contract,negotiation',
    created: 'Oct 24, 2023',
    idPlayer: '1',
  },
  {
    idNews: 2,
    title: 'Medical Clearance Granted',
    body: 'The medical staff has officially cleared Thorne.',
    tags: 'medical,playoffs',
    created: 'Oct 23, 2023',
    idPlayer: '2',
  },
];

describe('NewsPage', () => {
  let component: NewsPage;
  let fixture: ComponentFixture<NewsPage>;
  const mockNewsSignal = signal<NewsModel[]>(mockNews);

  const mockNewsProvider = {
    getNews: () => of(mockNews),
    getNewsById: (id: number) => of(mockNews.find((n) => n.idNews === id)!),
    createNews: () => of(mockNews[0]),
  };

  const mockBackendManager = {
    providers: () => ({ newsProvider: mockNewsProvider }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
        { provide: BackendManagerService, useValue: mockBackendManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});