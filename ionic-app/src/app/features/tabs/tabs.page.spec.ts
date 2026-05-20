import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { FIREBASE_AUTH_FUNCTIONS } from '@core/tokens/firebase-auth.token';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;

  beforeEach(async () => {
    const mockAuth = { currentUser: null } as any;
    const mockAuthFns = {
      user: () => ({ pipe: () => ({ pipe: () => null }) }),
    } as any;
    const mockFirestore = {} as any;

    await TestBed.configureTestingModule({
      imports: [TabsPage],
      providers: [
        provideRouter([]),
        { provide: Auth, useValue: mockAuth },
        { provide: FIREBASE_AUTH_FUNCTIONS, useValue: mockAuthFns },
        { provide: Firestore, useValue: mockFirestore },
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
});
