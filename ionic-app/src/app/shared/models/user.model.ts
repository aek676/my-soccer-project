export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string | null;
  username: string | null;
  role: UserRole;
  createdAt: Date;
}
