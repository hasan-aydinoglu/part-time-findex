// lib/auth.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "session_user";

export type Session = { email: string };

export async function getSession(): Promise<Session | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function signIn(email: string, _password: string) {
  // DEMO: şifre kontrolü yapmıyoruz (gerçekte API çağrısı yapılır)
  const sess: Session = { email };
  await AsyncStorage.setItem(KEY, JSON.stringify(sess));
  return sess;
}

export async function signOut() {
  await AsyncStorage.removeItem(KEY);
}
