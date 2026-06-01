import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import L from 'leaflet';
import { CreatePlayerPage } from './create-player.page';
import { AuthStateService } from '@core/services/auth-state.service';
import { AuthService } from '@core/services/auth.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { ImageUploadService } from '@core/services/image-upload.service';
import { CAMERA_PLUGIN } from '@core/tokens/camera.token';
import { AlertController, NavController } from '@ionic/angular/standalone';

const mockAuthStateService = {
  isGuest$: of(true),
  isAuthenticated$: of(false),
  role$: of('guest'),
};

describe('CreatePlayerPage', () => {
  let component: CreatePlayerPage;
  let fixture: ComponentFixture<CreatePlayerPage>;
  let mockCreatePlayer: jasmine.Spy;
  let mockTakePhoto: jasmine.Spy;
  let mockUploadPlayerPhoto: jasmine.Spy;
  let mockGetCurrentPosition: jasmine.Spy;
  let mockAlertCreate: jasmine.Spy;
  let mockAlertPresent: jasmine.Spy;
  let mockNavBack: jasmine.Spy;

  beforeEach(async () => {
    mockCreatePlayer = jasmine.createSpy('createPlayer').and.returnValue(of({ id: '1', name: 'Test' }));
    mockTakePhoto = jasmine.createSpy('takePhoto').and.resolveTo({
      uri: 'file://photo.jpg',
      webPath: 'file://photo.jpg',
      type: 'image/jpeg',
      saved: false,
    });
    mockUploadPlayerPhoto = jasmine.createSpy('uploadPlayerPhoto').and.resolveTo('https://example.com/photo.jpg');
    mockGetCurrentPosition = jasmine.createSpy('getCurrentPosition').and.resolveTo({
      latitude: 40.4168,
      longitude: -3.7038,
    });
    mockAlertPresent = jasmine.createSpy('present').and.resolveTo();
    mockAlertCreate = jasmine.createSpy('create').and.callFake(() =>
      Promise.resolve({ present: mockAlertPresent } as never),
    );
    mockNavBack = jasmine.createSpy('back');

    spyOn(L, 'map').and.returnValue(
      jasmine.createSpyObj('Map', ['on', 'remove', 'setView', 'addTo']),
    );
    spyOn(L, 'tileLayer').and.returnValue(
      jasmine.createSpyObj('tileLayer', ['addTo']),
    );

    await TestBed.configureTestingModule({
      imports: [CreatePlayerPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthStateService, useValue: mockAuthStateService },
        { provide: AuthService, useValue: { currentUser: null } },
        {
          provide: BackendManagerService,
          useValue: {
            players: () => signal([]),
            loadPlayers: () => {},
            providers: () => ({
              playerProvider: { createPlayer: mockCreatePlayer },
            }),
          },
        },
        { provide: CAMERA_PLUGIN, useValue: { takePhoto: mockTakePhoto } },
        { provide: ImageUploadService, useValue: { uploadPlayerPhoto: mockUploadPlayerPhoto } },
        { provide: GeolocationService, useValue: { getCurrentPosition: mockGetCurrentPosition } },
        { provide: AlertController, useValue: { create: mockAlertCreate } },
        { provide: NavController, useValue: { back: mockNavBack } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('validate', () => {
    it('should return errors when all fields are empty', () => {
      const errors = component['validate']();
      expect(errors.length).toBe(13);
      expect(errors).toContain('Alias is required');
      expect(errors).toContain('First name is required');
      expect(errors).toContain('Last name is required');
      expect(errors).toContain('Birthdate is required');
      expect(errors).toContain('Nationality is required');
      expect(errors).toContain('Height is required');
      expect(errors).toContain('Weight is required');
      expect(errors).toContain('League is required');
      expect(errors).toContain('Team is required');
      expect(errors).toContain('Position is required');
      expect(errors).toContain('Shirt number is required');
      expect(errors).toContain('Photo is required');
      expect(errors).toContain('Location is required. Tap the map to pin the position.');
    });

    it('should return empty array when all fields are valid', () => {
      component.alias.set('Magic');
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.birthdate.set('2000-01-15');
      component.nationality.set('Spanish');
      component.height.set('185');
      component.weight.set('80');
      component.league.set('Premier League');
      component.team.set('Arsenal');
      component.position.set('Forward');
      component.number.set(10);
      component.photo.set('https://example.com/photo.jpg');
      component.location.set({ type: 'Point', coordinates: [10, 20] });

      const errors = component['validate']();
      expect(errors.length).toBe(0);
    });
  });

  describe('savePlayer', () => {
    it('should show validation errors when form is invalid', async () => {
      component.savePlayer();

      await fixture.whenStable();

      expect(mockAlertCreate).toHaveBeenCalledWith({
        header: 'Missing Information',
        message: jasmine.any(String),
        buttons: ['OK'],
      });
      expect(mockAlertPresent).toHaveBeenCalled();
      expect(mockCreatePlayer).not.toHaveBeenCalled();
    });

    it('should call provider and navigate back when form is valid', () => {
      component.alias.set('Magic');
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.birthdate.set('2000-01-15');
      component.nationality.set('Spanish');
      component.height.set('185');
      component.weight.set('80');
      component.league.set('Premier League');
      component.team.set('Arsenal');
      component.position.set('Forward');
      component.number.set(10);
      component.photo.set('https://example.com/photo.jpg');
      component.location.set({ type: 'Point', coordinates: [10, 20] });

      component.savePlayer();

      expect(mockCreatePlayer).toHaveBeenCalledTimes(1);
      expect(mockCreatePlayer).toHaveBeenCalledWith({
        name: 'Magic',
        firstName: 'John',
        lastName: 'Doe',
        birthdate: '2000-01-15',
        nationality: 'Spanish',
        height: '185 cm',
        weight: '80 kg',
        league: 'Premier League',
        team: 'Arsenal',
        position: 'Forward',
        number: 10,
        photo: 'https://example.com/photo.jpg',
        age: jasmine.any(Number),
        location: { type: 'Point', coordinates: [10, 20] },
      });
      expect(mockNavBack).toHaveBeenCalled();
    });

    it('should include location data when coordinates are set', () => {
      component.alias.set('Magic');
      component.firstName.set('John');
      component.lastName.set('Doe');
      component.birthdate.set('2000-01-15');
      component.nationality.set('Spanish');
      component.height.set('185');
      component.weight.set('80');
      component.league.set('Premier League');
      component.team.set('Arsenal');
      component.position.set('Forward');
      component.number.set(10);
      component.photo.set('https://example.com/photo.jpg');
      component.location.set({ type: 'Point', coordinates: [10, 20] });

      component.savePlayer();

      expect(mockCreatePlayer).toHaveBeenCalledWith(
        jasmine.objectContaining({
          location: { type: 'Point', coordinates: [10, 20] },
        }),
      );
    });
  });

  describe('cancel', () => {
    it('should navigate back', () => {
      component.cancel();
      expect(mockNavBack).toHaveBeenCalled();
    });
  });

  describe('takePhoto', () => {
    it('should upload photo on successful capture', async () => {
      await component['takePhoto']();

      expect(mockTakePhoto).toHaveBeenCalledWith({ quality: 80 });
      expect(mockUploadPlayerPhoto).toHaveBeenCalledWith(
        'file://photo.jpg',
        undefined,
      );
      expect(component.photo()).toBe('https://example.com/photo.jpg');
    });

    it('should handle camera errors gracefully', async () => {
      mockTakePhoto.and.rejectWith(new Error('Camera denied'));

      await component['takePhoto']();

      expect(component.isUploading()).toBeFalse();
    });

    it('should use alias for photo filename when available', async () => {
      component.alias.set('Magic');

      await component['takePhoto']();

      expect(mockUploadPlayerPhoto).toHaveBeenCalledWith(
        'file://photo.jpg',
        'Magic',
      );
    });
  });

  describe('useCurrentLocation', () => {
    it('should call geoService and set loading state', async () => {
      spyOn(component as any, 'setMarker');
      (component as any).map = jasmine.createSpyObj('Map', ['setView', 'on', 'remove', 'addTo']);

      await component['useCurrentLocation']();

      expect(mockGetCurrentPosition).toHaveBeenCalled();
      expect(component.isLocating()).toBeFalse();
    });

    it('should do nothing when position is null', async () => {
      mockGetCurrentPosition.and.resolveTo(null);

      await component['useCurrentLocation']();

      expect(component.isLocating()).toBeFalse();
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const age = component['calculateAge']('2000-01-15');
      expect(age).toBeGreaterThanOrEqual(24);
    });
  });

  describe('toOptional', () => {
    it('should return undefined for falsy values', () => {
      expect(component['toOptional']('')).toBeUndefined();
      expect(component['toOptional'](undefined)).toBeUndefined();
      expect(component['toOptional'](null as unknown as string)).toBeUndefined();
    });

    it('should return value when provided', () => {
      expect(component['toOptional']('test')).toBe('test');
    });

    it('should append suffix when provided', () => {
      expect(component['toOptional']('185', 'cm')).toBe('185 cm');
    });
  });

  describe('nullishToUndefined', () => {
    it('should return undefined for null', () => {
      expect(component['nullishToUndefined'](null)).toBeUndefined();
    });

    it('should return value for non-null', () => {
      expect(component['nullishToUndefined'](10)).toBe(10);
    });
  });

  describe('showValidationErrors', () => {
    it('should create and present an alert', async () => {
      await component['showValidationErrors'](['Error 1', 'Error 2']);

      expect(mockAlertCreate).toHaveBeenCalledWith({
        header: 'Missing Information',
        message: 'Error 1\nError 2',
        buttons: ['OK'],
      });
      expect(mockAlertPresent).toHaveBeenCalled();
    });
  });
});
