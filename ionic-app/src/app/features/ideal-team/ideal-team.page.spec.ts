import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdealTeamPage } from './ideal-team.page';

describe('IdealTeamPage', () => {
  let component: IdealTeamPage;
  let fixture: ComponentFixture<IdealTeamPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(IdealTeamPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
