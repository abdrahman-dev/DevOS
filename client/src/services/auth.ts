export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: 'free' | 'pro';
}

export async function signIn(_email: string, _password: string): Promise<AuthUser> {
  throw new Error('Auth not yet implemented');
}

export async function signOut(): Promise<void> {
  throw new Error('Auth not yet implemented');
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  return null;
}
