import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AuthStateService } from '@core/services/auth-state.service';
import { UserRole } from '@core/models/user.model';
import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  let roleSubject: BehaviorSubject<UserRole>;

  beforeEach(async () => {
    roleSubject = new BehaviorSubject<UserRole>('guest');

    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [
        provideRouter([]),
        { provide: AuthStateService, useValue: { role$: roleSubject.asObservable() } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show limited tabs for guest role', () => {
    let tabs: any[];
    component.tabs$.subscribe((t) => (tabs = t));
    expect(tabs!).toEqual([
      { tab: 'players', icon: 'people', label: 'Players' },
      { tab: 'profile', icon: 'person', label: 'Profile' },
    ]);
  });

  it('should show all tabs for authenticated user', () => {
    roleSubject.next('user');

    let tabs: any[];
    component.tabs$.subscribe((t) => (tabs = t));
    expect(tabs!.map((t) => t.tab)).toEqual(['players', 'news', 'ideal-team', 'profile']);
  });
});
