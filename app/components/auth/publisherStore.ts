import { hashPassword } from "./authStore";

export type PublisherAccount = {
  id: string;
  companyName: string;
  email: string;
  passHash: string;
  businessRegNumber: string;
  contactName?: string;
  phone?: string;
  createdAt: string;
};

export type PublisherSession = {
  id: string;
  companyName: string;
  email: string;
};

const ACCOUNTS_KEY = "publisher:accounts";
const SESSION_KEY = "publisher:session";
const REMEMBER_KEY = "publisher:remember";

type StorageKind = "local" | "session";

function getStorage(kind: StorageKind): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function loadAccounts(): PublisherAccount[] {
  const storage = getStorage("local");
  if (!storage) return [];
  try {
    const raw = storage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts: PublisherAccount[]) {
  const storage = getStorage("local");
  if (!storage) return;
  try {
    storage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch {}
}

export async function registerPublisher(input: {
  companyName: string;
  email: string;
  password: string;
  businessRegNumber: string;
  contactName?: string;
  phone?: string;
}): Promise<{ ok: true; account: PublisherAccount } | { ok: false; error: string }> {
  const companyName = input.companyName.trim();
  const email = input.email.trim().toLowerCase();
  const businessRegNumber = input.businessRegNumber.replace(/\s+/g, "");
  const contactName = input.contactName?.trim();
  const phone = input.phone?.trim();

  if (!companyName) return { ok: false, error: "회사명을 입력하세요." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, error: "올바른 이메일 형식이 아닙니다." };
  if (!/^\d{3}-?\d{2}-?\d{5}$/.test(businessRegNumber)) {
    return { ok: false, error: "사업자등록번호 형식이 올바르지 않습니다." };
  }
  if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(input.password)) {
    return { ok: false, error: "비밀번호는 영문/숫자 포함 8자 이상이어야 합니다." };
  }

  const accounts = loadAccounts();
  if (accounts.some((acc) => acc.email === email)) {
    return { ok: false, error: "이미 등록된 이메일입니다." };
  }

  const passHash = await hashPassword(input.password);
  const account: PublisherAccount = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    companyName,
    email,
    passHash,
    businessRegNumber: businessRegNumber.replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3"),
    contactName,
    phone,
    createdAt: new Date().toISOString(),
  };

  accounts.push(account);
  saveAccounts(accounts);
  return { ok: true, account };
}

export async function loginPublisher(email: string, password: string): Promise<{ ok: true; account: PublisherAccount } | { ok: false; error: string }> {
  const accounts = loadAccounts();
  const emailNorm = email.trim().toLowerCase();
  const account = accounts.find((acc) => acc.email === emailNorm);
  if (!account) return { ok: false, error: "등록된 계정을 찾을 수 없습니다." };

  const passHash = await hashPassword(password);
  if (passHash !== account.passHash) {
    const looksHashed = /^[0-9a-f]{64}$/i.test(account.passHash);
    const legacyMatch = !looksHashed && account.passHash === password;
    if (!legacyMatch) {
      return { ok: false, error: "비밀번호가 일치하지 않습니다." };
    }

    account.passHash = passHash;
    saveAccounts(accounts);
  }

  return { ok: true, account };
}

export function persistPublisherSession(account: PublisherAccount, remember: boolean) {
  const sessionData: PublisherSession = {
    id: account.id,
    companyName: account.companyName,
    email: account.email,
  };

  const sessionStorage = getStorage("session");
  try {
    sessionStorage?.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch {}

  const localStorage = getStorage("local");
  if (remember) {
    try {
      localStorage?.setItem(SESSION_KEY, JSON.stringify(sessionData));
      localStorage?.setItem(REMEMBER_KEY, "true");
    } catch {}
  } else {
    try {
      localStorage?.removeItem(SESSION_KEY);
      localStorage?.removeItem(REMEMBER_KEY);
    } catch {}
  }
}

export function clearPublisherSession() {
  const sessionStorage = getStorage("session");
  const localStorage = getStorage("local");
  try {
    sessionStorage?.removeItem(SESSION_KEY);
  } catch {}
  try {
    localStorage?.removeItem(SESSION_KEY);
    localStorage?.removeItem(REMEMBER_KEY);
  } catch {}
}

export function getPublisherSession(): { session: PublisherSession | null; remember: boolean } {
  const sessionStorage = getStorage("session");
  const localStorage = getStorage("local");
  let remember = false;

  if (!sessionStorage && !localStorage) return { session: null, remember };

  try {
    remember = localStorage?.getItem(REMEMBER_KEY) === "true";
  } catch {
    remember = false;
  }

  if (remember && localStorage) {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PublisherSession;
        sessionStorage?.setItem(SESSION_KEY, raw);
        return { session: parsed, remember: true };
      }
    } catch {}
  }

  if (sessionStorage) {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PublisherSession;
        return { session: parsed, remember };
      }
    } catch {}
  }

  if (remember && localStorage) {
    try {
      localStorage.removeItem(REMEMBER_KEY);
      localStorage.removeItem(SESSION_KEY);
    } catch {}
  }

  return { session: null, remember: false };
}
