import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavController } from '@ionic/angular';
import { of } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { ProfilePage } from './profile.page';

describe('ProfilePage', () => {
  let component: ProfilePage;
  let fixture: ComponentFixture<ProfilePage>;
  let mockNavController: jasmine.SpyObj<NavController>;

  const mockAuthService = {
    logout: () => of(undefined),
  };

  const mockBackendManager = {
    currentBackend: () => 'NODE' as const,
    teams: () => [],
  };

  beforeEach(async () => {
    mockNavController = jasmine.createSpyObj('NavController', ['navigateRoot']);

    await TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
        { provide: BackendManagerService, useValue: mockBackendManager },
        { provide: NavController, useValue: mockNavController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle team expanded state', () => {
    expect(component.expandedTeamId()).toBeNull();

    component.toggleTeam('team-1');
    expect(component.expandedTeamId()).toBe('team-1');

    component.toggleTeam('team-1');
    expect(component.expandedTeamId()).toBeNull();
  });

  it('should toggle to a different team', () => {
    component.toggleTeam('team-1');
    expect(component.expandedTeamId()).toBe('team-1');

    component.toggleTeam('team-2');
    expect(component.expandedTeamId()).toBe('team-2');
  });

  it('should return correct isTeamExpanded state', () => {
    expect(component.isTeamExpanded('team-1')).toBeFalse();
    component.toggleTeam('team-1');
    expect(component.isTeamExpanded('team-1')).toBeTrue();
    expect(component.isTeamExpanded('team-2')).toBeFalse();
  });

  it('should navigate to login on logout', () => {
    component.logout();
    expect(mockNavController.navigateRoot).toHaveBeenCalledWith(['/auth/login']);
  });
});
