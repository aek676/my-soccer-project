import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { IdealTeamPage } from './ideal-team.page';

const MOCK_PLAYERS = [
  { id: '1', name: 'Alisson', position: 'Goalkeeper' },
  { id: '2', name: 'Davies', position: 'Defender' },
  { id: '3', name: 'Dias', position: 'Defender' },
  { id: '4', name: 'Saliba', position: 'Defender' },
  { id: '5', name: 'Walker', position: 'Defender' },
  { id: '6', name: 'Bellingham', position: 'Midfielder' },
  { id: '7', name: 'Rodri', position: 'Midfielder' },
  { id: '8', name: 'De Bruyne', position: 'Midfielder' },
  { id: '9', name: 'Vinícius Jr', position: 'Forward' },
  { id: '10', name: 'Haaland', position: 'Forward' },
  { id: '11', name: 'Saka', position: 'Forward' },
];

const MOCK_TEAM = {
  id: 'team1',
  name: 'My Team',
  players: MOCK_PLAYERS,
  created: '2024-01-01',
  idUser: 'user1',
};

describe('IdealTeamPage', () => {
  let component: IdealTeamPage;
  let fixture: ComponentFixture<IdealTeamPage>;

  const mockTeamProvider = {
    generateIdealTeam: jasmine.createSpy('generateIdealTeam').and.returnValue(of(MOCK_PLAYERS)),
    saveIdealTeam: jasmine.createSpy('saveIdealTeam').and.returnValue(of(MOCK_TEAM)),
    getUserTeams: jasmine.createSpy('getUserTeams').and.returnValue(of([])),
  };

  const mockBackendManager = {
    providers: () => ({ teamProvider: mockTeamProvider }),
    loadTeams: jasmine.createSpy('loadTeams'),
  };

  const mockToastController = jasmine.createSpyObj('ToastController', ['create']);

  beforeEach(async () => {
    mockTeamProvider.generateIdealTeam.calls.reset();
    mockTeamProvider.generateIdealTeam.and.returnValue(of(MOCK_PLAYERS));
    mockTeamProvider.saveIdealTeam.calls.reset();
    mockTeamProvider.saveIdealTeam.and.returnValue(of(MOCK_TEAM));
    mockTeamProvider.getUserTeams.calls.reset();
    mockTeamProvider.getUserTeams.and.returnValue(of([]));
    mockToastController.create.calls.reset();
    mockToastController.create.and.returnValue(
      Promise.resolve({
        present: jasmine.createSpy('present'),
      } as any),
    );

    await TestBed.configureTestingModule({
      imports: [IdealTeamPage],
      providers: [
        provideRouter([]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
        { provide: BackendManagerService, useValue: mockBackendManager },
        { provide: ToastController, useValue: mockToastController },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IdealTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have squad empty initially', () => {
    expect(component.squad()).toEqual([]);
  });

  it('should have isGenerated false initially', () => {
    expect(component.isGenerated()).toBe(false);
  });

  it('should have showSaveModal false initially', () => {
    expect(component.showSaveModal()).toBe(false);
  });

  it('should generate squad on generateSquad call', async () => {
    await component.generateSquad();
    expect(component.squad().length).toBe(11);
    expect(component.isGenerated()).toBe(true);
  });

  it('should open save modal on openSaveModal call', () => {
    component.openSaveModal();
    expect(component.showSaveModal()).toBe(true);
  });

  it('should close save modal and reset name on closeSaveModal call', () => {
    component.openSaveModal();
    component.closeSaveModal();
    expect(component.showSaveModal()).toBe(false);
    expect(component.teamName()).toBe('');
  });

  it('should show toast with backend error message on generateSquad failure', async () => {
    mockTeamProvider.generateIdealTeam.and.returnValue(
      throwError(() => ({ error: { message: 'Not enough players in database' } })),
    );

    await component.generateSquad();

    expect(mockToastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Not enough players in database', color: 'danger' }),
    );
  });

  it('should show toast with backend error message on save failure', async () => {
    mockTeamProvider.saveIdealTeam.and.returnValue(
      throwError(() => ({ error: { message: 'Team name already exists' } })),
    );

    component.teamName.set('My Team');
    await component.confirmSaveTeam();

    expect(mockToastController.create).toHaveBeenCalledWith(
      jasmine.objectContaining({ message: 'Team name already exists', color: 'danger' }),
    );
  });
});