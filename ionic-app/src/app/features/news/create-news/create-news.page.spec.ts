import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { of, throwError } from 'rxjs';
import { CreateNewsPage } from './create-news.page';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { PlayerModel } from '@core/models/player.model';
import { NavController } from '@ionic/angular';
import { NewsModel } from '@core/models/news.model';

const mockPlayers: PlayerModel[] = [
  { id: '1', name: 'Marcus Rashford', position: 'Forward' },
  { id: '2', name: 'Jude Bellingham', position: 'Midfielder' },
];

describe('CreateNewsPage', () => {
  let component: CreateNewsPage;
  let fixture: ComponentFixture<CreateNewsPage>;
  const mockPlayersSignal = signal<PlayerModel[]>(mockPlayers);

  const mockNewsProvider = {
    getNews: jasmine.createSpy('getNews').and.returnValue(of([])),
    getNewsById: jasmine.createSpy('getNewsById'),
    createNews: jasmine.createSpy('createNews').and.returnValue(
      of({
        idNews: 1,
        title: 'Test',
        body: 'Test body',
        tags: '',
        created: 'Jun 1, 2024',
        idPlayer: '1',
      } as NewsModel),
    ),
  };

  const mockBackendManager = {
    players: () => mockPlayersSignal(),
    loadPlayers: jasmine.createSpy('loadPlayers'),
    providers: () => ({ newsProvider: mockNewsProvider }),
  };

  beforeEach(async () => {
    mockPlayersSignal.set(mockPlayers);
    mockNewsProvider.createNews.calls.reset();

    await TestBed.configureTestingModule({
      imports: [CreateNewsPage, ReactiveFormsModule],
      providers: [
        provideRouter([]),
        FormBuilder,
        {
          provide: ToastController,
          useValue: {
            create: () =>
              Promise.resolve({ present: () => Promise.resolve() }),
          },
        },
        {
          provide: NavController,
          useValue: {
            back: jasmine.createSpy('back'),
            navigateBack: jasmine.createSpy('navigateBack').and.returnValue(Promise.resolve()),
          },
        },
        {
          provide: AuthStateService,
          useValue: {
            isGuest$: of(true),
            isAuthenticated$: of(false),
            role$: of('guest'),
          },
        },
        {
          provide: BackendManagerService,
          useValue: mockBackendManager,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateNewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an invalid form initially', () => {
    expect(component.form.invalid).toBeTrue();
  });

  it('should validate title and body as required', () => {
    component.form.setValue({ title: '', body: '', tags: '', idPlayer: null });
    expect(component.form.get('title')?.invalid).toBeTrue();
    expect(component.form.get('body')?.invalid).toBeTrue();
  });

  it('should mark form as touched when onSave is called with invalid form', () => {
    spyOn(component.form, 'markAllAsTouched');
    component.onSave();
    expect(component.form.markAllAsTouched).toHaveBeenCalled();
  });

  it('should call loadPlayers on ionViewWillEnter', () => {
    component.ionViewWillEnter();
    expect(mockBackendManager.loadPlayers).toHaveBeenCalled();
  });

  it('should navigate back on goBack', () => {
    const navCtrl = TestBed.inject(NavController);
    component.goBack();
    expect(navCtrl.back).toHaveBeenCalled();
  });

  it('should call createNews and navigate on valid form submit', fakeAsync(async () => {
    component.form.setValue({
      title: 'Test Title',
      body: 'Test body',
      tags: 'tag1',
      idPlayer: '1',
    });
    await component.onSave();
    tick();
    expect(mockNewsProvider.createNews).toHaveBeenCalledWith(
      jasmine.objectContaining({ title: 'Test Title' }),
    );
    const navCtrl = TestBed.inject(NavController);
    expect(navCtrl.navigateBack).toHaveBeenCalledWith('/tabs/news');
    expect(component.submitting()).toBeFalse();
  }));

  it('should show error toast on createNews failure', fakeAsync(() => {
    mockNewsProvider.createNews.and.returnValue(
      throwError(() => new Error('API error')),
    );
    component.form.setValue({
      title: 'Test Title',
      body: 'Test body',
      tags: '',
      idPlayer: '1',
    });
    const toastCtrl = TestBed.inject(ToastController);
    spyOn(toastCtrl, 'create').and.callThrough();
    component.onSave();
    flush();
    expect(toastCtrl.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ color: 'danger' }),
    );
    expect(component.submitting()).toBeFalse();
  }));
});