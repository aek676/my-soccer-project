import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { of } from 'rxjs';
import { CreateNewsPage } from './create-news.page';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { PlayerModel } from '@core/models/player.model';

const mockPlayers: PlayerModel[] = [
  { id: '1', name: 'Marcus Rashford', position: 'Forward' },
  { id: '2', name: 'Jude Bellingham', position: 'Midfielder' },
];

describe('CreateNewsPage', () => {
  let component: CreateNewsPage;
  let fixture: ComponentFixture<CreateNewsPage>;
  const mockPlayersSignal = signal<PlayerModel[]>(mockPlayers);

  const mockBackendManager = {
    players: () => mockPlayersSignal(),
    loadPlayers: jasmine.createSpy('loadPlayers'),
  };

  beforeEach(async () => {
    mockPlayersSignal.set(mockPlayers);

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
});