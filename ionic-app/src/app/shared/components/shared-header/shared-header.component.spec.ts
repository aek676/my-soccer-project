import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthStateService } from '@core/services/auth-state.service';
import { SharedHeaderComponent } from './shared-header.component';

describe('SharedHeaderComponent', () => {
  let component: SharedHeaderComponent;
  let fixture: ComponentFixture<SharedHeaderComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SharedHeaderComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: AuthStateService, useValue: { isGuest$: of(true) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit back event on goBack', () => {
    const spy = spyOn(component.back, 'emit');
    component.goBack();
    expect(spy).toHaveBeenCalled();
  });

  it('should navigate to login on goToLogin', () => {
    component.goToLogin();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
