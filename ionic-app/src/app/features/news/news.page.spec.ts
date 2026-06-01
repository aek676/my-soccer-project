import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { NewsModel } from '@core/models/news.model';

import { of } from 'rxjs';
import { NavController } from '@ionic/angular';

import { NewsPage } from './news.page';

const mockNews: NewsModel[] = [
  {
    idNews: 1,
    title: 'Contract Renegotiations Stall',
    body: 'Preliminary talks regarding an extension have hit a wall.',
    tags: 'contract,negotiation',
    created: 'Oct 24, 2023',
    playerName: 'Player One',
  },
  {
    idNews: 2,
    title: 'Medical Clearance Granted',
    body: 'The medical staff has officially cleared Thorne.',
    tags: 'medical,playoffs',
    created: 'Oct 23, 2023',
    playerName: 'Player Two',
  },
];

describe('NewsPage', () => {
  let component: NewsPage;
  let fixture: ComponentFixture<NewsPage>;

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
        { provide: AuthStateService, useValue: { role$: of('guest'), isGuest$: of(true) } },
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

  it('should navigate to create-news on onCreateNews', () => {
    const navCtrl = TestBed.inject(NavController);
    spyOn(navCtrl, 'navigateForward');
    component.onCreateNews();
    expect(navCtrl.navigateForward).toHaveBeenCalledWith('/create-news');
  });

  it('should load articles on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(component.articles().length).toBe(2);
    expect(component.articles()[0].title).toBe('Contract Renegotiations Stall');
  });
});