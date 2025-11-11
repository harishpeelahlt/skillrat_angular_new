export interface AuthState {
  user: { id: string; name: string; role: 'admin' | 'teacher' | 'student' } | null;
  tokens: { accessToken: string; refreshToken: string; expiresAt: number } | null;
}
