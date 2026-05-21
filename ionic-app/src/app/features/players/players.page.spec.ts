import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '@core/services/auth-state.service';
import { of } from 'rxjs';

import { PlayersPage } from './players.page';

describe('PlayersPage', () => {
  let component: PlayersPage;
  let fixture: ComponentFixture<PlayersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersPage],
      providers: [
        provideRouter([]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
