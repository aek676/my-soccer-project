import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { PlayerModel } from '@core/models/player.model';
import { of } from 'rxjs';

import { PlayersPage } from './players.page';

const mockPlayers: PlayerModel[] = [
  {
    id: '1',
    name: 'Marcus Rashford',
    position: 'Forward',
    team: 'Manchester United',
    league: 'Premier League',
    nationality: 'England',
    created: '2024-01-01T00:00:00',
  },
  {
    id: '2',
    name: 'Jude Bellingham',
    position: 'Midfielder',
    team: 'Real Madrid',
    league: 'La Liga',
    nationality: 'England',
    created: '2024-02-01T00:00:00',
  },
  {
    id: '3',
    name: 'Bukayo Saka',
    position: 'Winger',
    team: 'Arsenal',
    league: 'Premier League',
    nationality: 'England',
    created: '2024-03-01T00:00:00',
  },
  {
    id: '4',
    name: 'Kylian Mbappé',
    position: 'Forward',
    team: 'Real Madrid',
    league: 'La Liga',
    nationality: 'France',
    created: '2024-04-01T00:00:00',
  },
];

describe('PlayersPage', () => {
  let component: PlayersPage;
  let fixture: ComponentFixture<PlayersPage>;
  const mockPlayersSignal = signal<PlayerModel[]>(mockPlayers);

  const mockBackendManager = {
    players: () => mockPlayersSignal(),
  };

  beforeEach(async () => {
    mockPlayersSignal.set(mockPlayers);

    await TestBed.configureTestingModule({
      imports: [PlayersPage],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
        { provide: BackendManagerService, useValue: mockBackendManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return all players when no query and no filter', () => {
    expect(component.filteredPlayers().length).toBe(4);
  });

  describe('search', () => {
    it('should filter players by name', () => {
      component.searchQuery.set('rash');
      expect(component.filteredPlayers().length).toBe(1);
      expect(component.filteredPlayers()[0].name).toBe('Marcus Rashford');
    });

    it('should filter players by team', () => {
      component.searchQuery.set('real madrid');
      expect(component.filteredPlayers().length).toBe(2);
    });

    it('should filter players by league', () => {
      component.searchQuery.set('premier');
      expect(component.filteredPlayers().length).toBe(2);
    });

    it('should filter players by nationality', () => {
      component.searchQuery.set('france');
      expect(component.filteredPlayers().length).toBe(1);
      expect(component.filteredPlayers()[0].name).toBe('Kylian Mbappé');
    });

    it('should filter players by position', () => {
      component.searchQuery.set('midfielder');
      expect(component.filteredPlayers().length).toBe(1);
      expect(component.filteredPlayers()[0].name).toBe('Jude Bellingham');
    });

    it('should return empty when no match', () => {
      component.searchQuery.set('xyz');
      expect(component.filteredPlayers().length).toBe(0);
    });
  });

  describe('sort', () => {
    it('should sort by Team ascending', () => {
      component.selectedFilter.set({ filter: 'Team', direction: 'asc' });
      const names = component.filteredPlayers().map((p) => p.team);
      expect(names).toEqual([
        'Arsenal',
        'Manchester United',
        'Real Madrid',
        'Real Madrid',
      ]);
    });

    it('should sort by Team descending', () => {
      component.selectedFilter.set({ filter: 'Team', direction: 'desc' });
      const names = component.filteredPlayers().map((p) => p.team);
      expect(names).toEqual([
        'Real Madrid',
        'Real Madrid',
        'Manchester United',
        'Arsenal',
      ]);
    });

    it('should sort by League ascending', () => {
      component.selectedFilter.set({ filter: 'League', direction: 'asc' });
      const leagues = component.filteredPlayers().map((p) => p.league);
      expect(leagues).toEqual([
        'La Liga',
        'La Liga',
        'Premier League',
        'Premier League',
      ]);
    });

    it('should sort by League descending', () => {
      component.selectedFilter.set({ filter: 'League', direction: 'desc' });
      const leagues = component.filteredPlayers().map((p) => p.league);
      expect(leagues).toEqual([
        'Premier League',
        'Premier League',
        'La Liga',
        'La Liga',
      ]);
    });

    it('should sort by Date Added ascending', () => {
      component.selectedFilter.set({ filter: 'Date Added', direction: 'asc' });
      const ids = component.filteredPlayers().map((p) => p.id);
      expect(ids).toEqual(['1', '2', '3', '4']);
    });

    it('should sort by Date Added descending', () => {
      component.selectedFilter.set({ filter: 'Date Added', direction: 'desc' });
      const ids = component.filteredPlayers().map((p) => p.id);
      expect(ids).toEqual(['4', '3', '2', '1']);
    });
  });

  describe('search and sort combined', () => {
    it('should filter and sort simultaneously', () => {
      component.searchQuery.set('real madrid');
      component.selectedFilter.set({ filter: 'Name', direction: 'asc' });
      const result = component.filteredPlayers();
      expect(result.length).toBe(2);
      expect(result[0].team).toBe('Real Madrid');
      expect(result[1].team).toBe('Real Madrid');
    });
  });
});
