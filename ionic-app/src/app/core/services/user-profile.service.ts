import { Injectable, inject } from '@angular/core';
import { Firestore, DocumentData } from '@angular/fire/firestore';
import { firstValueFrom, Observable, map, from } from 'rxjs';
import { UserProfile, UserRole } from '../../shared/models/user.model';
import { User } from '@angular/fire/auth';
import { FIRESTORE_FUNCTIONS } from '../tokens/firestore.token';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private firestore = inject(Firestore);
  private fns = inject(FIRESTORE_FUNCTIONS);

  createProfile(user: User, role: UserRole): Promise<void> {
    const profile: Omit<UserProfile, 'createdAt'> & { createdAt: Date } = {
      uid: user.uid,
      email: user.email,
      username: user.displayName,
      role,
      createdAt: new Date(),
    };
    return this.fns.setDoc(this.fns.doc(this.firestore, 'users', user.uid), profile);
  }

  async getProfile(uid: string): Promise<UserProfile | undefined> {
    const data = await firstValueFrom(
      this.fns.docData(this.fns.doc(this.firestore, 'users', uid), { idField: 'uid' }),
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
    return this.fns.docData(this.fns.doc(this.firestore, 'users', uid), { idField: 'uid' }).pipe(
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
