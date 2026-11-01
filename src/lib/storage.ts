import type { Account, Portfolio, Session, Workspace } from "./types";

const ROOT = "folivio.v1";

export const storageKeys = {
  accounts: `${ROOT}.accounts`,
  session: `${ROOT}.session`,
  workspace: (userId: string) => `${ROOT}.workspace.${userId}`,
  published: `${ROOT}.published`,
};

function hasWindow(): boolean {
  return typeof window !== "undefined";
}

export function readJSON<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON(key: string, value: unknown): boolean {
  if (!hasWindow()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeKey(key: string) {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage can be unavailable in private modes */
  }
}

export const readAccounts = () => readJSON<Account[]>(storageKeys.accounts, []);
export const writeAccounts = (accounts: Account[]) =>
  writeJSON(storageKeys.accounts, accounts);

export const readSession = () => readJSON<Session | null>(storageKeys.session, null);
export const writeSession = (session: Session | null) =>
  session ? writeJSON(storageKeys.session, session) : removeKey(storageKeys.session);

export function readWorkspace(userId: string): Workspace | null {
  const workspace = readJSON<Workspace | null>(storageKeys.workspace(userId), null);
  if (!workspace || workspace.version !== 1) return null;
  return workspace;
}

export function writeWorkspace(userId: string, workspace: Workspace) {
  return writeJSON(storageKeys.workspace(userId), workspace);
}

export function removeWorkspace(userId: string) {
  removeKey(storageKeys.workspace(userId));
}

/**
 * Published portfolios live under their own key so the public page can render
 * without knowing which account owns the workspace. A real backend replaces
 * this with a table; the shape stays the same.
 */
export type PublishedSnapshot = Portfolio & {
  ownerName: string;
  publishedAt: string;
};

export type PublishedIndex = Record<string, PublishedSnapshot>;

export const readPublished = () => readJSON<PublishedIndex>(storageKeys.published, {});
export const writePublished = (index: PublishedIndex) =>
  writeJSON(storageKeys.published, index);

export function publishPortfolio(slug: string, snapshot: PublishedSnapshot) {
  const index = readPublished();
  index[slug] = snapshot;
  writePublished(index);
}

export function unpublishPortfolio(slug: string) {
  const index = readPublished();
  delete index[slug];
  writePublished(index);
}

export function readPublishedOne(slug: string): PublishedSnapshot | null {
  return readPublished()[slug] ?? null;
}
