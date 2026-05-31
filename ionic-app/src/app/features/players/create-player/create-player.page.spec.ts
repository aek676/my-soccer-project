import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatePlayerPage } from './create-player.page';

describe('CreatePlayerPage', () => {
  let component: CreatePlayerPage;
  let fixture: ComponentFixture<CreatePlayerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlayerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
