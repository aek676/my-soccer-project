import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerItemComponent } from './player-item.component';
import { PlayerModel } from '@core/models/player.model';

const mockPlayer: PlayerModel = {
  id: '1',
  name: 'Marcus Rashford',
  position: 'Forward',
};

describe('PlayerItemComponent', () => {
  let component: PlayerItemComponent;
  let fixture: ComponentFixture<PlayerItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerItemComponent);
    component = fixture.componentInstance;
    component.player = mockPlayer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit tap event on onTap when not selectable', () => {
    component.selectable = false;
    spyOn(component.tap, 'emit');
    component.onTap();
    expect(component.tap.emit).toHaveBeenCalledWith(mockPlayer);
  });

  it('should not emit tap event on onTap when selectable', () => {
    component.selectable = true;
    spyOn(component.tap, 'emit');
    component.onTap();
    expect(component.tap.emit).not.toHaveBeenCalled();
  });

  it('should emit selectionChange on checkbox change', () => {
    spyOn(component.selectionChange, 'emit');
    component.onCheckboxChange({ detail: { checked: true } });
    expect(component.selectionChange.emit).toHaveBeenCalledWith(true);
  });
});
