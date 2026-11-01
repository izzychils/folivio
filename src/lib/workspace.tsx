"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ActivityKind, Workspace } from "./types";
import { readWorkspace, writeWorkspace } from "./storage";
import { blankWorkspace, defaultSettings, sampleWorkspace } from "./seed";
import { useSession } from "./session";
import { uid } from "./utils";

type WorkspaceContextValue = {
  workspace: Workspace | null;
  ready: boolean;
  update: (recipe: (current: Workspace) => Workspace) => void;
  replace: (next: Workspace) => void;
  resetToSample: () => void;
  clearSampleContent: () => void;
  record: (kind: ActivityKind, text: string) => void;
};

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

function withActivity(workspace: Workspace, kind: ActivityKind, text: string): Workspace {
  return {
    ...workspace,
    activity: [
      { id: uid("act"), kind, text, at: new Date().toISOString() },
      ...workspace.activity,
    ].slice(0, 30),
  };
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [ready, setReady] = useState(false);
  const lastSerialized = useRef<string>("");

  useEffect(() => {
    if (!user) {
      setWorkspace(null);
      lastSerialized.current = "";
      setReady(true);
      return;
    }
    setReady(false);
    const stored = readWorkspace(user.id);
    if (stored) {
      setWorkspace(stored);
      lastSerialized.current = JSON.stringify(stored);
    } else {
      const seeded = sampleWorkspace({ name: user.name, email: user.email });
      writeWorkspace(user.id, seeded);
      lastSerialized.current = JSON.stringify(seeded);
      setWorkspace(seeded);
    }
    setReady(true);
  }, [user]);

  useEffect(() => {
    if (!user || !workspace) return;
    const serialized = JSON.stringify(workspace);
    if (serialized === lastSerialized.current) return;
    writeWorkspace(user.id, workspace);
    lastSerialized.current = serialized;
  }, [workspace, user]);

  const update = useCallback((recipe: (current: Workspace) => Workspace) => {
    setWorkspace((current) => (current ? recipe(current) : current));
  }, []);

  const replace = useCallback((next: Workspace) => {
    setWorkspace({ ...next, version: 1 });
  }, []);

  const record = useCallback((kind: ActivityKind, text: string) => {
    setWorkspace((current) => (current ? withActivity(current, kind, text) : current));
  }, []);

  const resetToSample = useCallback(() => {
    if (!user) return;
    const seeded = sampleWorkspace({ name: user.name, email: user.email });
    setWorkspace(seeded);
    record("profile.updated", "Restored the sample career workspace");
  }, [user, record]);

  const clearSampleContent = useCallback(() => {
    if (!user) return;
    const blank = blankWorkspace({ name: user.name, email: user.email });
    setWorkspace(blank);
  }, [user]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({ workspace, ready, update, replace, resetToSample, clearSampleContent, record }),
    [workspace, ready, update, replace, resetToSample, clearSampleContent, record],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return context;
}

/** Appends a small activity entry to a workspace being written by a recipe. */
export function appendActivity(workspace: Workspace, kind: ActivityKind, text: string): Workspace {
  return withActivity(workspace, kind, text);
}

export function ensureSettings(workspace: Workspace): Workspace {
  return workspace.settings ? workspace : { ...workspace, settings: defaultSettings() };
}
