import { AuthUser, SignInDTO, SignUpDTO, AuthError } from '../types';

const usersDB: Record<
  string,
  { id: string; email: string; name?: string; password: string }
> = {};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const VALID_EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email: string): AuthError | null {
  if (!VALID_EMAIL_REGEX.test(email)) {
    return { code: 'INVALID_EMAIL', message: 'E-mail inválido.' };
  }
  return null;
}

export async function mockSignUp(payload: SignUpDTO): Promise<AuthUser> {
  await delay(400);

  const emailErr = validateEmail(payload.email);
  if (emailErr) throw emailErr;

  if (!payload.name || payload.name.trim().length < 2) {
    throw {
      code: 'INVALID_NAME',
      message: 'Nome deve ter pelo menos 2 caracteres.',
    };
  }

  if (!payload.password || payload.password.length < 6) {
    throw {
      code: 'WEAK_PASSWORD',
      message: 'Senha deve ter pelo menos 6 caracteres.',
    };
  }

  const emailKey = payload.email.toLowerCase();
  if (usersDB[emailKey]) {
    throw { code: 'EMAIL_IN_USE', message: 'E-mail já cadastrado.' };
  }

  const id = `user_${Date.now()}`;
  usersDB[emailKey] = {
    id,
    email: emailKey,
    name: payload.name.trim(),
    password: payload.password,
  };

  return { id, email: emailKey, name: payload.name.trim() };
}

export async function mockSignIn(payload: SignInDTO): Promise<AuthUser> {
  await delay(400);

  const emailErr = validateEmail(payload.email);
  if (emailErr) throw emailErr;

  if (!payload.password) {
    throw { code: 'MISSING_PASSWORD', message: 'Senha é obrigatória.' };
  }

  const emailKey = payload.email.toLowerCase();
  const rec = usersDB[emailKey];
  if (!rec) {
    throw { code: 'NOT_FOUND', message: 'Usuário não encontrado.' };
  }

  if (rec.password !== payload.password) {
    throw {
      code: 'INVALID_CREDENTIALS',
      message: 'E-mail ou senha incorretos.',
    };
  }

  return { id: rec.id, email: rec.email, name: rec.name };
}

export async function mockSignOut(): Promise<void> {
  await delay(200);
}
