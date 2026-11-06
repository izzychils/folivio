"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Account } from "./types";
import {
  readAccounts,
  readSession,
  removeWorkspace,
  writeAccounts,
  writeSession,
} from "./storage";
import { nowISO, uid } from "./utils";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type AuthResult = { ok: true } | { ok: false; error: string };

type SessionContextValue = {
  user: SessionUser | null;
  ready: boolean;
  signUp: (input: { name: string; email: string; password: string }) => Promise<AuthResult>;
  signIn: (input: { email: string; password: string }) => Promise<AuthResult>;
  signInWithSample: () => Promise<AuthResult>;
  signOut: () => void;
  updateName: (name: string) => AuthResult;
  changePassword: (current: string, next: string) => Promise<AuthResult>;
  deleteAccount: () => void;
};

const SessionContext = createContext<SessionContextValue | null>(null);

const DEMO_ACCOUNT = {
  name: "Amara Okonkwo",
  email: "sample@folivio.online",
  password: "sample-career",
};

async function digest(value: string): Promise<string> {
  const subtle = typeof crypto !== "undefined" ? crypto.subtle : undefined;
  if (!subtle) {
    return `fallback:${btoa(unescape(encodeURIComponent(value)))}`;
  }
  const bytes = new TextEncoder().encode(value);
  const hash = await subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function makeSalt(): string {
  const bytes = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }
  return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function passwordHash(password: string, salt: string): Promise<string> {
  return digest(`${salt}::${password}`);
}

function toUser(account: Account): SessionUser {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    createdAt: account.createdAt,
  };
}

function startSession(account: Account) {
  writeSession({ userId: account.id, startedAt: nowISO() });
  return toUser(account);
}

function findAccountByEmail(email: string): Account | undefined {
  const clean = email.trim().toLowerCase();
  return readAccounts().find((account) => account.email.toLowerCase() === clean);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = readSession();
    if (session) {
      const account = readAccounts().find((item) => item.id === session.userId);
      if (account) setUser(toUser(account));
      else writeSession(null);
    }
    setReady(true);
  }, []);

  const signUp = useCallback(
    async ({ name, email, password }: { name: string; email: string; password: string }): Promise<AuthResult> => {
      const cleanName = name.trim();
      const cleanEmail = email.trim().toLowerCase();
      if (cleanName.length < 2) return { ok: false, error: "Enter your full name." };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        return { ok: false, error: "That email address does not look right." };
      }
      if (password.length < 8) {
        return { ok: false, error: "Use at least 8 characters for your password." };
      }
      if (findAccountByEmail(cleanEmail)) {
        return { ok: false, error: "An account with that email already exists. Sign in instead." };
      }

      const salt = makeSalt();
      const account: Account = {
        id: uid("usr"),
        name: cleanName,
        email: cleanEmail,
        salt,
        passwordHash: await passwordHash(password, salt),
        createdAt: nowISO(),
      };
      const accounts = readAccounts();
      writeAccounts([...accounts, account]);
      setUser(startSession(account));
      return { ok: true };
    },
    [],
  );

  const signIn = useCallback(async ({ email, password }: { email: string; password: string }): Promise<AuthResult> => {
    const account = findAccountByEmail(email);
    if (!account) {
      return { ok: false, error: "No account found for that email on this device." };
    }
    const hash = await passwordHash(password, account.salt);
    if (hash !== account.passwordHash) {
      return { ok: false, error: "That password does not match. Try again." };
    }
    setUser(startSession(account));
    return { ok: true };
  }, []);

  const signInWithSample = useCallback(async (): Promise<AuthResult> => {
    const existing = findAccountByEmail(DEMO_ACCOUNT.email);
    if (existing) {
      setUser(startSession(existing));
      return { ok: true };
    }
    const salt = makeSalt();
    const account: Account = {
      id: uid("usr"),
      name: DEMO_ACCOUNT.name,
      email: DEMO_ACCOUNT.email,
      salt,
      passwordHash: await passwordHash(DEMO_ACCOUNT.password, salt),
      createdAt: nowISO(),
    };
    writeAccounts([...readAccounts(), account]);
    setUser(startSession(account));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    writeSession(null);
    setUser(null);
  }, []);

  const updateName = useCallback(
    (name: string): AuthResult => {
      const clean = name.trim();
      if (clean.length < 2) return { ok: false, error: "Enter your full name." };
      if (!user) return { ok: false, error: "You are signed out." };
      const accounts = readAccounts();
      writeAccounts(
        accounts.map((account) => (account.id === user.id ? { ...account, name: clean } : account)),
      );
      setUser({ ...user, name: clean });
      return { ok: true };
    },
    [user],
  );

  const changePassword = useCallback(
    async (current: string, next: string): Promise<AuthResult> => {
      if (!user) return { ok: false, error: "You are signed out." };
      if (next.length < 8) return { ok: false, error: "The new password needs 8 characters or more." };
      const accounts = readAccounts();
      const account = accounts.find((item) => item.id === user.id);
      if (!account) return { ok: false, error: "Account not found on this device." };
      const currentHash = await passwordHash(current, account.salt);
      if (currentHash !== account.passwordHash) {
        return { ok: false, error: "The current password is not correct." };
      }
      const salt = makeSalt();
      const nextHash = await passwordHash(next, salt);
      writeAccounts(
        accounts.map((item) =>
          item.id === user.id ? { ...item, salt, passwordHash: nextHash } : item,
        ),
      );
      return { ok: true };
    },
    [user],
  );

  const deleteAccount = useCallback(() => {
    if (!user) return;
    writeAccounts(readAccounts().filter((account) => account.id !== user.id));
    removeWorkspace(user.id);
    writeSession(null);
    setUser(null);
  }, [user]);

  const value = useMemo<SessionContextValue>(
    () => ({
      user,
      ready,
      signUp,
      signIn,
      signInWithSample,
      signOut,
      updateName,
      changePassword,
      deleteAccount,
    }),
    [user, ready, signUp, signIn, signInWithSample, signOut, updateName, changePassword, deleteAccount],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);
  if (!context) throw new Error("useSession must be used inside SessionProvider");
  return context;
}
