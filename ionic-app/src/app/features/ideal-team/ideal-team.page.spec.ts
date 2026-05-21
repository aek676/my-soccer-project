import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AuthStateService } from '@core/services/auth-state.service';
import { of } from 'rxjs';

import { IdealTeamPage } from './ideal-team.page';

describe('IdealTeamPage', () => {
  let component: IdealTeamPage;
  let fixture: ComponentFixture<IdealTeamPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdealTeamPage],
      providers: [
        provideRouter([]),
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IdealTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
