import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { signal } from '@angular/core';
import { EditPlayerPage } from './edit-player.page';
import { AuthStateService } from '@core/services/auth-state.service';
import { AuthService } from '@core/services/auth.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { PlayerModel } from '@core/models/player.model';
import { NavController } from '@ionic/angular';

const mockPlayer: PlayerModel = {
  id: '123',
  name: 'Marcus Rashford',
  firstName: 'Marcus',
  lastName: 'Rashford',
  position: 'Forward',
  team: 'Manchester United',
  league: 'Premier League',
  nationality: 'England',
  age: 24,
  height: '185 cm',
  weight: '78 kg',
  number: 9,
  photo: 'https://example.com/photo.jpg',
  birthdate: '1997-12-31',
  location: { type: 'Point', coordinates: [-1.234, 51.234] },
  created: '2024-01-01T00:00:00',
};

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
      getPlayerById: (id: string) => of(mockPlayer),
      updatePlayer: (id: string, player: Partial<PlayerModel>) => of({ ...mockPlayer, ...player }),
    },
  }),
};

const mockGeoService = {
  getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.resolveTo({ latitude: 51.51, longitude: -0.12 }),
};

const mockActivatedRoute = {
  snapshot: {
    paramMap: {
      get: (key: string) => (key === 'id' ? '123' : null),
    },
  },
};

describe('EditPlayerPage', () => {
  let component: EditPlayerPage;
  let fixture: ComponentFixture<EditPlayerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlayerPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: AuthService, useValue: { currentUser: null } },
        { provide: BackendManagerService, useValue: mockBackendManager },
        { provide: GeolocationService, useValue: mockGeoService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditPlayerPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load player data on ionViewWillEnter', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();

    expect(component.alias()).toBe('Marcus Rashford');
    expect(component.firstName()).toBe('Marcus');
    expect(component.lastName()).toBe('Rashford');
    expect(component.position()).toBe('Forward');
    expect(component.team()).toBe('Manchester United');
    expect(component.number()).toBe(9);
    expect(component.photo()).toBe('https://example.com/photo.jpg');
    expect(component.location().coordinates).toEqual([-1.234, 51.234]);
  }));

  it('should navigate back on cancel', () => {
    const nav = TestBed.inject(NavController);
    spyOn(nav, 'back');
    component.cancel();
    expect(nav.back).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    component.alias.set('');
    component.firstName.set('');
    component.lastName.set('');
    component.birthdate.set('');
    component.nationality.set('');
    component.height.set('');
    component.weight.set('');
    component.league.set('');
    component.team.set('');
    component.position.set('');
    component.number.set(null);
    component.photo.set(null);
    component.location.set({ type: 'Point', coordinates: null });

    const errors = (component as any).validate();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('Alias is required');
    expect(errors).toContain('First name is required');
    expect(errors).toContain('Photo is required');
    expect(errors).toContain('Location is required. Tap the map to pin the position.');
  });

  it('should not have validation errors when all fields are filled', fakeAsync(() => {
    component.ionViewWillEnter();
    tick();
    fixture.detectChanges();

    const errors = (component as any).validate();
    expect(errors.length).toBe(0);
  }));
});