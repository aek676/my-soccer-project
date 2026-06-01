import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { CreatePlayerPage } from './create-player.page';
import { AuthStateService } from '@core/services/auth-state.service';
import { AuthService } from '@core/services/auth.service';
import { BackendManagerService } from '@core/services/backend-manager.service';

const mockAuthStateService = {
  isGuest$: of(true),
  isAuthenticated$: of(false),
  role$: of('guest'),
};

const mockBackendManager = {
  players: () => signal([]),
  loadPlayers: () => {},
  providers: () => ({
    playerProvider: {
      createPlayer: () => of({}),
    },
  }),
};

describe('CreatePlayerPage', () => {
  let component: CreatePlayerPage;
  let fixture: ComponentFixture<CreatePlayerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePlayerPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: AuthService, useValue: { currentUser: null } },
        { provide: BackendManagerService, useValue: mockBackendManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});