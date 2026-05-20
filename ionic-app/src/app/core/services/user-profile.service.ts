import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  docData,
  DocumentData,
} from '@angular/fire/firestore';
import { firstValueFrom, Observable, map } from 'rxjs';
import { UserProfile, UserRole } from '../../shared/models/user.model';
import { User } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private firestore = inject(Firestore);

  createProfile(user: User, role: UserRole): Promise<void> {
    const profile: Omit<UserProfile, 'createdAt'> & { createdAt: Date } = {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
      role,
      createdAt: new Date(),
    };
    return setDoc(doc(this.firestore, 'users', user.uid), profile);
  }

  async getProfile(uid: string): Promise<UserProfile | undefined> {
    const data = await firstValueFrom(
      docData(doc(this.firestore, 'users', uid), { idField: 'uid' }),
    );
    if (!data) return undefined;
    return {
      ...data,
      createdAt:
        (data as DocumentData)['createdAt']?.toDate?.() ??
        (data as DocumentData)['createdAt'],
    } as UserProfile;
  }

  profile$(uid: string): Observable<UserProfile | undefined> {
    return docData(doc(this.firestore, 'users', uid), { idField: 'uid' }).pipe(
      map((data) => {
        if (!data) return undefined;
        return {
          ...data,
          createdAt:
            (data as DocumentData)['createdAt']?.toDate?.() ??
            (data as DocumentData)['createdAt'],
        } as UserProfile;
      }),
    );
  }
}
