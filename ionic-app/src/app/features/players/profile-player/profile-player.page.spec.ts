import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { AuthStateService } from '@core/services/auth-state.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { PlayerModel } from '@core/models/player.model';
import { ProfilePlayerPage } from './profile-player.page';

const mockPlayers: PlayerModel[] = [
  {
    id: '1',
    name: 'Marcus Rashford',
    position: 'Forward',
    team: 'Manchester United',
    league: 'Premier League',
    nationality: 'England',
    age: 24,
    height: '185 cm',
    weight: '78 kg',
    number: 9,
    created: '2024-01-01T00:00:00',
  },
];

describe('ProfilePlayerPage', () => {
  let component: ProfilePlayerPage;
  let fixture: ComponentFixture<ProfilePlayerPage>;
  const mockPlayersSignal = signal<PlayerModel[]>(mockPlayers);

  const mockBackendManager = {
    players: () => mockPlayersSignal(),
  };

  beforeEach(async () => {
    mockPlayersSignal.set(mockPlayers);

    await TestBed.configureTestingModule({
      imports: [ProfilePlayerPage],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'profile-player/:id', component: ProfilePlayerPage },
        ]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
        { provide: BackendManagerService, useValue: mockBackendManager },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfilePlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle modal', () => {
    expect(component.showModal()).toBeFalse();
    component.openModal();
    expect(component.showModal()).toBeTrue();
    component.closeModal();
    expect(component.showModal()).toBeFalse();
  });

  it('should set rating', () => {
    component.setRating(4);
    expect(component.newComment().rating).toBe(4);
  });

  it('should reset form on modal open', () => {
    component.newComment.set({ author: 'test', text: 'test', rating: 3 });
    component.openModal();
    expect(component.newComment()).toEqual({ author: '', text: '', rating: 0 });
  });

  it('should return correct star icons for rating', () => {
    expect(component.isFilledStar(4.5, 0)).toBeTrue();
    expect(component.isFilledStar(4.5, 4)).toBeFalse();
    expect(component.isHalfStar(4.5, 4)).toBeTrue();
  });

  it('should not submit comment without text', () => {
    component.newComment.set({ author: '', text: '', rating: 3 });
    component.submitComment();
    expect(component.showModal()).toBeFalse();
  });

  it('should not submit comment without rating', () => {
    component.newComment.set({ author: '', text: 'some text', rating: 0 });
    component.submitComment();
    expect(component.showModal()).toBeFalse();
  });
});
