import { TestBed } from '@angular/core/testing';
import { UserProfileService } from './user-profile.service';
import { Firestore } from '@angular/fire/firestore';

describe('UserProfileService', () => {
  let service: UserProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }],
    });

    service = TestBed.inject(UserProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
