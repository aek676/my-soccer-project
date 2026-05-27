import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { NavController } from '@ionic/angular';
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

  const mockBackendManager = {
    players: () => [],
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

  it('should call navController.navigateBack on confirmImport', () => {
    component.confirmImport();
    expect(mockNavController.navigateBack).toHaveBeenCalledWith('/tabs/players');
  });
});
