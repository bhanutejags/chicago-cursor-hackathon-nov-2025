import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Window, WindowConfig } from "@/types/window";

interface WindowStore {
  windows: Map<string, Window>;
  activeWindowId: string | null;
  nextZIndex: number;
  openWindow: (config: WindowConfig) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

const DEFAULT_WINDOW_SIZE = { width: 800, height: 600 };
const DEFAULT_MIN_SIZE = { width: 400, height: 300 };

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: new Map(),
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (config) => {
    const id = nanoid();
    const { nextZIndex, windows } = get();

    // Calculate position to cascade windows
    const offset = (windows.size % 10) * 30;

    const window: Window = {
      id,
      type: config.type,
      title: config.title || config.type,
      icon: config.icon || config.type,
      position: config.position || { x: 100 + offset, y: 100 + offset },
      size: config.size || DEFAULT_WINDOW_SIZE,
      state: "normal",
      zIndex: nextZIndex,
      minimumSize: DEFAULT_MIN_SIZE,
      resizable: true,
      draggable: true,
      data: config.data,
    };

    set((state) => ({
      windows: new Map(state.windows).set(id, window),
      activeWindowId: id,
      nextZIndex: state.nextZIndex + 1,
    }));

    return id;
  },

  closeWindow: (id) => {
    set((state) => {
      const newWindows = new Map(state.windows);
      newWindows.delete(id);
      return {
        windows: newWindows,
        activeWindowId:
          state.activeWindowId === id ? null : state.activeWindowId,
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, zIndex: state.nextZIndex });

      return {
        windows: newWindows,
        activeWindowId: id,
        nextZIndex: state.nextZIndex + 1,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, state: "minimized" });

      return { windows: newWindows };
    });
  },

  maximizeWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, state: "maximized" });

      return { windows: newWindows };
    });
  },

  restoreWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, state: "normal" });

      return { windows: newWindows };
    });
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, position: { x, y } });

      return { windows: newWindows };
    });
  },

  updateWindowSize: (id, width, height) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const newWindows = new Map(state.windows);
      newWindows.set(id, { ...window, size: { width, height } });

      return { windows: newWindows };
    });
  },
}));
