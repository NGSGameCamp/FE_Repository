export type StoredUser = {
  id: string; // internal id
  userId: string; // username/id
  nickname: string;
  email: string;
  passHash: string;
  createdAt: string;
};

const USERS_KEY = "auth:users";

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

export async function hashPassword(pwd: string): Promise<string> {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const enc = new TextEncoder();
    const buf = await window.crypto.subtle.digest("SHA-256", enc.encode(pwd));
    const hashArray = Array.from(new Uint8Array(buf));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  // Fallback (non-crypto): NOT secure—demo only.
  let h = 0;
  for (let i = 0; i < pwd.length; i++) h = (h * 31 + pwd.charCodeAt(i)) >>> 0;
  return String(h);
}

export async function registerUser(input: {
  userId: string;
  nickname: string;
  email: string;
  password: string;
}): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const users = loadUsers();
  const emailLower = input.email.trim().toLowerCase();
  const idTrim = input.userId.trim();

  if (!/^\S+@\S+\.\S+$/.test(emailLower)) {
    return { ok: false, error: "올바른 이메일 형식이 아닙니다." };
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(input.password)) {
    return { ok: false, error: "비밀번호는 영문/숫자 포함 8자 이상이어야 합니다." };
  }
  if (users.some((u) => u.userId.toLowerCase() === idTrim.toLowerCase())) {
    return { ok: false, error: "이미 사용 중인 아이디입니다." };
  }
  if (users.some((u) => u.email.toLowerCase() === emailLower)) {
    return { ok: false, error: "이미 등록된 이메일입니다." };
  }

  const passHash = await hashPassword(input.password);
  const user: StoredUser = {
    id: String(Date.now()),
    userId: idTrim,
    nickname: input.nickname.trim() || idTrim,
    email: emailLower,
    passHash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}

export async function loginWithPassword(login: string, password: string): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }>
{
  const users = loadUsers();
  const loginNorm = login.trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === loginNorm || u.userId.toLowerCase() === loginNorm);
  if (!user) return { ok: false, error: "계정을 찾을 수 없습니다." };
  const passHash = await hashPassword(password);
  if (user.passHash !== passHash) return { ok: false, error: "비밀번호가 올바르지 않습니다." };
  return { ok: true, user };
}

export function isEmailTaken(email: string): boolean {
  return loadUsers().some((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export function isUserIdTaken(userId: string): boolean {
  return loadUsers().some((u) => u.userId.toLowerCase() === userId.trim().toLowerCase());
}

export async function changePassword(identifier: string, newPassword: string): Promise<{ ok: boolean; error?: string }> {
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(newPassword)) {
    return { ok: false, error: "비밀번호는 영문/숫자 포함 8자 이상이어야 합니다." };
  }
  const users = loadUsers();
  const key = identifier.trim().toLowerCase();
  const idx = users.findIndex((u) => u.email.toLowerCase() === key || u.userId.toLowerCase() === key);
  if (idx === -1) return { ok: false, error: "계정을 찾을 수 없습니다." };
  const passHash = await hashPassword(newPassword);
  users[idx].passHash = passHash;
  saveUsers(users);
  return { ok: true };
}

// Update stored nickname for a user by email or userId (best-effort, local demo only)
export function updateNickname(identifier: string, nickname: string): { ok: boolean } {
  const users = loadUsers();
  const key = identifier.trim().toLowerCase();
  const idx = users.findIndex((u) => u.email.toLowerCase() === key || u.userId.toLowerCase() === key);
  if (idx === -1) return { ok: true }; // no-op for non-registered sessions
  users[idx].nickname = nickname.trim() || users[idx].nickname;
  saveUsers(users);
  return { ok: true };
}

// Delete user by email or userId. Demo only (localStorage persistence)
export function deleteUser(identifier: string): { ok: boolean } {
  const users = loadUsers();
  const key = identifier.trim().toLowerCase();
  const next = users.filter((u) => u.email.toLowerCase() !== key && u.userId.toLowerCase() !== key);
  saveUsers(next);
  return { ok: true };
}
