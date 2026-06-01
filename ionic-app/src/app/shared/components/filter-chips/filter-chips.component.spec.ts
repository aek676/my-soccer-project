import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterChipsComponent } from './filter-chips.component';

describe('FilterChipsComponent', () => {
  let component: FilterChipsComponent;
  let fixture: ComponentFixture<FilterChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterChipsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FilterChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit asc when no previous selection', () => {
    const spy = spyOn(component.selectedChange, 'emit');
    component.selected = null;
    component.cycleFilter('name');
    expect(spy).toHaveBeenCalledWith({ filter: 'name', direction: 'asc' });
  });

  it('should emit asc when a different filter was selected', () => {
    const spy = spyOn(component.selectedChange, 'emit');
    component.selected = { filter: 'age', direction: 'asc' };
    component.cycleFilter('name');
    expect(spy).toHaveBeenCalledWith({ filter: 'name', direction: 'asc' });
  });

  it('should emit desc when same filter was previously asc', () => {
    const spy = spyOn(component.selectedChange, 'emit');
    component.selected = { filter: 'name', direction: 'asc' };
    component.cycleFilter('name');
    expect(spy).toHaveBeenCalledWith({ filter: 'name', direction: 'desc' });
  });

  it('should emit null when same filter was previously desc', () => {
    const spy = spyOn(component.selectedChange, 'emit');
    component.selected = { filter: 'name', direction: 'desc' };
    component.cycleFilter('name');
    expect(spy).toHaveBeenCalledWith(null);
  });
});
