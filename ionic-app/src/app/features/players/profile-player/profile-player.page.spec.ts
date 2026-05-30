import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthStateService } from '@core/services/auth-state.service';
import { AuthService } from '@core/services/auth.service';
import { BackendManagerService } from '@core/services/backend-manager.service';
import { GeolocationService } from '@core/services/geolocation.service';
import { PlayerModel } from '@core/models/player.model';
import { CommentModel } from '@core/models/comment.model';
import { ProfilePlayerPage } from './profile-player.page';
import { NavController } from '@ionic/angular';

const mockPlayer: PlayerModel = {
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
};

const mockComment: CommentModel = {
  id: 'c1',
  author: 'Scout Gamma',
  text: 'Great potential',
  rating: 4,
  created: 'Jan 15, 2024',
  idPlayer: '1',
  idUser: 'guest',
  location: { type: 'Point', coordinates: [0, 0] },
};

const mockBackendManager = {
  providers: () => ({
    playerProvider: {
      getPlayerById: (id: string) => of(id === '1' ? mockPlayer : null),
      getPlayers: () => of([mockPlayer]),
    },
    teamProvider: {},
    commentProvider: {
      getCommentsByPlayer: () => of([]),
      createComment: (comment: CommentModel) => of(comment),
      deleteComment: () => of(undefined),
    },
  }),
};

const mockGeoService = {
  getCurrentPosition: jasmine.createSpy('getCurrentPosition').and.resolveTo({ latitude: 51.51, longitude: -0.12 }),
};

describe('ProfilePlayerPage', () => {
  let component: ProfilePlayerPage;
  let fixture: ComponentFixture<ProfilePlayerPage>;

  beforeEach(async () => {
    mockGeoService.getCurrentPosition = jasmine.createSpy('getCurrentPosition').and.resolveTo({ latitude: 51.51, longitude: -0.12 });

    await TestBed.configureTestingModule({
      imports: [ProfilePlayerPage],
      providers: [
        provideHttpClient(),
        provideRouter([
          { path: 'profile-player/:id', component: ProfilePlayerPage },
        ]),
        { provide: AuthStateService, useValue: { role$: of('guest'), isGuest$: of(true) } },
        { provide: AuthService, useValue: { currentUser: null } },
        { provide: BackendManagerService, useValue: mockBackendManager },
        { provide: GeolocationService, useValue: mockGeoService },
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

  it('should return correct star helpers for rating', () => {
    expect(component.isFilledStar(4.5, 0)).toBeTrue();
    expect(component.isFilledStar(4.5, 4)).toBeFalse();
    expect(component.isHalfStar(4.5, 4)).toBeTrue();
  });

  it('should return correct star icon names', () => {
    expect(component.getStarIcons(4.5)).toEqual(['star', 'star', 'star', 'star', 'star-half']);
    expect(component.getStarIcons(5)).toEqual(['star', 'star', 'star', 'star', 'star']);
    expect(component.getStarIcons(0)).toEqual(['star', 'star', 'star', 'star', 'star']);
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

  it('should delete a comment', () => {
    component.comments.set([mockComment]);
    component.deleteComment('c1');
    expect(component.comments().length).toBe(0);
  });

  it('should set delete alert state on confirmDelete', () => {
    component.confirmDelete(mockComment);
    expect(component.deleteCommentId()).toBe('c1');
    expect(component.showDeleteAlert()).toBeTrue();
  });

  it('should delete comment on destructive dismiss', () => {
    component.comments.set([mockComment]);
    component.deleteCommentId.set('c1');
    component.showDeleteAlert.set(true);
    component.onDeleteDismiss({ detail: { role: 'destructive' } });
    expect(component.comments().length).toBe(0);
    expect(component.showDeleteAlert()).toBeFalse();
  });

  it('should not delete comment on cancel dismiss', () => {
    component.comments.set([mockComment]);
    component.deleteCommentId.set('c1');
    component.onDeleteDismiss({ detail: { role: 'cancel' } });
    expect(component.comments().length).toBe(1);
    expect(component.showDeleteAlert()).toBeFalse();
  });

  it('should navigate back on goBack', () => {
    const nav = TestBed.inject(NavController);
    spyOn(nav, 'back');
    component.goBack();
    expect(nav.back).toHaveBeenCalled();
  });

  describe('submitComment with valid data', () => {
    it('should submit comment and add to list', fakeAsync(() => {
      const initialLength = component.comments().length;
      component.newComment.set({ author: 'Tester', text: 'Nice player', rating: 4 });
      component.submitComment();
      flush();
      expect(component.comments().length).toBe(initialLength + 1);
      expect(component.showModal()).toBeFalse();
    }));

    it('should include geolocation coordinates in new comment', fakeAsync(() => {
      component.newComment.set({ author: 'Tester', text: 'Nice player', rating: 4 });
      component.submitComment();
      flush();
      const latest = component.comments()[component.comments().length - 1];
      expect(latest.location).toBeDefined();
      expect(latest.location!.coordinates).toEqual([-0.12, 51.51]);
    }));
  });
});
