import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { NavController, ToastController } from '@ionic/angular';
import { of } from 'rxjs';

import { ImportPlayersPage } from './import-players.page';

describe('ImportPlayersPage', () => {
  let component: ImportPlayersPage;
  let fixture: ComponentFixture<ImportPlayersPage>;

  const mockNavController = {
    back: jasmine.createSpy('back'),
    navigateForward: jasmine.createSpy('navigateForward'),
    navigateBack: jasmine.createSpy('navigateBack'),
  };

  const mockToastController = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve({
      present: jasmine.createSpy('present').and.returnValue(Promise.resolve()),
    })),
  };

  const mockPlayerProvider = {
    searchPlayers: jasmine.createSpy('searchPlayers').and.returnValue(of([{ id: 1, name: 'Test Player' }])),
    importPlayer: jasmine.createSpy('importPlayer').and.returnValue(of({ status: 200 })),
  };

  const mockBackendManager = {
    providers: () => ({ playerProvider: mockPlayerProvider }),
  };

  const mockGeoService = {
    getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.resolveTo({ latitude: 40.4168, longitude: -3.7038 }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportPlayersPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
        { provide: BackendManagerService, useValue: mockBackendManager },
        { provide: NavController, useValue: mockNavController },
        { provide: ToastController, useValue: mockToastController },
        { provide: GeolocationService, useValue: mockGeoService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ImportPlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle player selection', () => {
    component.togglePlayer('1', true);
    expect(component.isSelected('1')).toBeTrue();

    component.togglePlayer('1', false);
    expect(component.isSelected('1')).toBeFalse();
  });

  it('should call navController.back on goBack', () => {
    component.goBack();
    expect(mockNavController.back).toHaveBeenCalled();
  });

  it('should call navController.navigateBack on confirmImport', fakeAsync(() => {
    component.onSearchChange('test');
    tick(300);

    component.togglePlayer('1', true);

    component.confirmImport();
    flush();

    expect(mockNavController.navigateBack).toHaveBeenCalledWith('/tabs/players');
  }));
});
