# Embed-OS Desktop UI - Comprehensive Implementation Plan

**Project**: Transform Embed-OS into Full Desktop Environment
**Date**: 2025-11-08
**Stack**: Bun + React + Tailwind CSS + shadcn/ui + xterm.js

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Technical Architecture](#technical-architecture)
3. [Phase 1: Foundation Setup](#phase-1-foundation-setup)
4. [Phase 2: Core Components](#phase-2-core-components)
5. [Phase 3: Window Management](#phase-3-window-management)
6. [Phase 4: Desktop Environment](#phase-4-desktop-environment)
7. [Phase 5: Applications](#phase-5-applications)
8. [Phase 6: Advanced Features](#phase-6-advanced-features)
9. [Testing Strategy](#testing-strategy)
10. [Performance Considerations](#performance-considerations)
11. [Future Enhancements](#future-enhancements)

---

## Overview

### Architecture Philosophy

**🚨 IMPORTANT: Client-Side Only Architecture**

This project is designed to run **entirely in the browser** with **no backend server in production**. All OS functionality, file storage, and application logic execute client-side using:

- Browser APIs (localStorage, IndexedDB, WebAssembly)
- Client-side JavaScript/TypeScript
- Static file hosting (GitHub Pages, Netlify, etc.)

The Bun dev server (`src/server.ts`) is **only for development** with hot module reloading. In production, the build outputs static files that can be served from any CDN or static host.

### Current State

- Basic terminal with command execution
- Core OS abstractions (filesystem, process manager, terminal)
- Vanilla HTML/JS with inline styles
- No desktop environment or window management

### Target State

- Full desktop OS UI similar to PostHog's interface
- React-based component architecture
- Draggable, resizable windows
- Desktop with icons and file system
- Professional terminal (xterm.js)
- Camera & video recording app
- Taskbar with app management
- Modern styling with Tailwind CSS + shadcn/ui
- **100% client-side** - works offline after initial load

### Success Criteria

- Multiple windows can be opened, dragged, resized, minimized
- Desktop icons represent files and applications
- Terminal integrates seamlessly with existing command system
- Camera app works with browser media APIs
- Responsive, smooth animations, accessible
- Clean, maintainable component architecture
- **No server required** for production deployment

---

## Technical Architecture

### Technology Stack

#### Core Framework

- **Bun 1.3.1+**: Runtime, bundler, dev server
- **React 18+**: UI framework
- **TypeScript 5+**: Type safety

#### Styling

- **Tailwind CSS 3.4+**: Utility-first CSS
- **shadcn/ui**: Component library (Radix UI + Tailwind)
- **PostCSS**: CSS processing
- **Autoprefixer**: Browser compatibility

#### UI Components & Libraries

- **react-rnd**: Draggable and resizable windows
- **xterm.js**: Terminal emulator
- **xterm-addon-fit**: Terminal auto-sizing
- **xterm-addon-web-links**: Clickable links in terminal
- **lucide-react**: Icon library
- **zustand**: Lightweight state management

#### Storage & Persistence

- **localStorage**: Current file system (Phase 1)
- **localForage** or **Dexie.js**: IndexedDB wrapper (Phase 2+)

#### WASM (Future)

- **Wasmer.js**: WebAssembly runtime
- **@wasmer/sdk**: WASM integration

### Architecture Patterns

#### Component Architecture

```
src/
├── components/
│   ├── Desktop/
│   │   ├── Desktop.tsx          # Main desktop container
│   │   ├── DesktopIcon.tsx      # File/app icons
│   │   └── DesktopBackground.tsx # Background with right-click menu
│   ├── Window/
│   │   ├── Window.tsx           # Window wrapper with controls
│   │   ├── WindowHeader.tsx     # Title bar with buttons
│   │   └── WindowContent.tsx    # Content area
│   ├── Taskbar/
│   │   ├── Taskbar.tsx          # Bottom taskbar
│   │   ├── AppLauncher.tsx      # App icons in taskbar
│   │   └── SystemTray.tsx       # Clock, status indicators
│   ├── Apps/
│   │   ├── Terminal/
│   │   │   ├── Terminal.tsx     # xterm.js integration
│   │   │   └── TerminalCommands.tsx
│   │   ├── FileExplorer/
│   │   │   ├── FileExplorer.tsx
│   │   │   ├── FileList.tsx
│   │   │   └── FileTree.tsx
│   │   └── TextEditor/
│   │       └── TextEditor.tsx
│   └── ui/                      # shadcn/ui components
│       ├── button.tsx
│       ├── dialog.tsx
│       ├── dropdown-menu.tsx
│       └── ...
├── store/
│   ├── windowStore.ts           # Window state management
│   ├── fileSystemStore.ts       # File system state
│   └── processStore.ts          # Process state
├── lib/
│   ├── embedos.ts               # Core OS implementation
│   └── utils.ts                 # Utility functions
├── types/
│   ├── window.ts
│   ├── file.ts
│   └── process.ts
└── App.tsx                      # Root component
```

#### State Management (Zustand)

```typescript
// Window Store
interface WindowState {
  windows: Map<string, Window>;
  activeWindowId: string | null;
  openWindow: (window: Window) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

// File System Store
interface FileSystemState {
  currentPath: string;
  files: FileNode[];
  selectedFiles: string[];
  navigate: (path: string) => void;
  createFile: (name: string, content: string) => void;
  deleteFile: (path: string) => void;
  renameFile: (oldPath: string, newPath: string) => void;
}

// Process Store
interface ProcessState {
  processes: Process[];
  spawnProcess: (name: string, code: string) => void;
  killProcess: (pid: string) => void;
}
```

#### Window Data Structure

```typescript
interface Window {
  id: string;
  type: "terminal" | "file-explorer" | "text-editor" | "custom";
  title: string;
  icon: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  state: "normal" | "minimized" | "maximized";
  zIndex: number;
  content: React.ReactNode;
  minimumSize: { width: number; height: number };
  maximumSize?: { width: number; height: number };
  resizable: boolean;
  draggable: boolean;
}
```

---

## Phase 1: Foundation Setup

### 1.1 Install Dependencies

```bash
# Core dependencies
bun add react react-dom
bun add -d @types/react @types/react-dom

# Styling (with Bun plugin)
bun add -d tailwindcss postcss autoprefixer
bun add -d bun-plugin-tailwindcss
bun add class-variance-authority clsx tailwind-merge

# UI Components
bun add react-rnd
bun add xterm xterm-addon-fit xterm-addon-web-links
bun add lucide-react
bun add zustand
bun add nanoid

# Monaco Editor (VS Code editor) - P1 Priority
bun add @monaco-editor/react
bun add monaco-editor

# shadcn/ui dependencies (auto-installed with shadcn init)
bun add @radix-ui/react-dialog
bun add @radix-ui/react-dropdown-menu
bun add @radix-ui/react-toast
bun add @radix-ui/react-slot
```

### 1.2 Initialize Tailwind CSS with TypeScript

**Create `tailwind.config.ts` (typed configuration):**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "./public/**/*.html"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        mono: [
          "SF Mono",
          "Monaco",
          "Cascadia Code",
          "Roboto Mono",
          "monospace",
        ],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "window-appear": "windowAppear 0.2s ease-out",
        "window-minimize": "windowMinimize 0.3s ease-in-out",
      },
      keyframes: {
        windowAppear: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        windowMinimize: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.8)" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

**Create `src/styles/globals.css`:**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... shadcn/ui CSS variables */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}

/* Desktop-specific styles */
.desktop {
  @apply w-screen h-screen overflow-hidden relative;
}

.window {
  @apply bg-background border border-border rounded-lg shadow-2xl;
  @apply flex flex-col;
}

.window-header {
  @apply flex items-center justify-between px-3 py-2;
  @apply border-b border-border bg-muted/50;
  @apply cursor-move select-none;
}

.window-content {
  @apply flex-1 overflow-auto;
}

/* xterm.js styling */
.xterm {
  @apply p-4;
}

.xterm-viewport {
  @apply scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent;
}
```

### 1.3 Initialize shadcn/ui

**Create `components.json` (typed configuration):**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Install initial components:**

```bash
bunx shadcn@latest init
bunx shadcn@latest add button
bunx shadcn@latest add dialog
bunx shadcn@latest add dropdown-menu
bunx shadcn@latest add toast
bunx shadcn@latest add context-menu
```

### 1.4 Configure Bun Fullstack Dev Server

**Resources:**

- [Bun Fullstack Server](https://bun.com/docs/bundler/fullstack)
- [Development vs Production](https://bun.com/docs/bundler/fullstack#development-vs-production)

**Create `src/server.ts`:**

```typescript
import { file } from "bun";

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);

    // Serve index.html for root
    if (url.pathname === "/") {
      return new Response(file("public/index.html"));
    }

    // Serve static assets
    if (url.pathname.startsWith("/assets/")) {
      return new Response(file("public" + url.pathname));
    }

    // Default to index.html (SPA routing)
    return new Response(file("public/index.html"));
  },

  // Wasmer.js headers for SharedArrayBuffer support
  headers: {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  },

  // Development mode configuration
  development: isDev,
});

console.log(`🚀 Embed-OS running on http://localhost:${server.port}`);
console.log(`   Mode: ${isDev ? "development" : "production"}`);
```

**Development vs Production:**

In development mode (`NODE_ENV !== "production"`):

- Hot Module Reloading (HMR) enabled
- Source maps included
- Unminified bundles
- Fast rebuild times

In production mode:

- No HMR overhead
- Minified bundles
- Tree shaking enabled
- Optimized performance

**Build configuration with `bun.config.ts`:**

```typescript
// bun.config.ts (optional)
import type { BunPlugin } from "bun";
import tailwindcss from "bun-plugin-tailwindcss";

export default {
  plugins: [
    tailwindcss({
      // Tailwind CSS plugin options
      config: "./tailwind.config.js",
    }),
  ],
};
```

**Update `public/index.html`:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Embed-OS - Desktop Environment</title>

    <!-- Import Bun-compiled React app -->
    <link rel="stylesheet" href="./styles/globals.css" />
  </head>
  <body>
    <div id="root"></div>

    <!-- Bun's HTML imports automatically bundle this -->
    <script type="module" src="../src/main.tsx"></script>
  </body>
</html>
```

**Create `src/main.tsx`:**

```typescript
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Update `package.json` scripts:**

```json
{
  "scripts": {
    "dev": "NODE_ENV=development bun --hot src/server.ts",
    "build": "bun build src/main.tsx --outdir ./dist --target browser --minify",
    "start": "NODE_ENV=production bun src/server.ts",
    "serve": "bun src/server.ts",
    "format": "biome format --write .",
    "lint": "biome lint .",
    "check": "biome check --write .",
    "type-check": "tsc --noEmit"
  }
}
```

**Running the application:**

```bash
# Development with HMR
bun run dev

# Production build
bun run build

# Production server
bun run start
```

---

## Phase 2: Core Components

### 2.1 Create Root App Component

**`src/App.tsx`:**

```typescript
import React from "react";
import Desktop from "./components/Desktop/Desktop";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <div className="app">
      <Desktop />
      <Toaster />
    </div>
  );
}
```

### 2.2 Desktop Component

**`src/components/Desktop/Desktop.tsx`:**

```typescript
import React from "react";
import DesktopBackground from "./DesktopBackground";
import DesktopIcon from "./DesktopIcon";
import Window from "../Window/Window";
import Taskbar from "../Taskbar/Taskbar";
import { useWindowStore } from "@/store/windowStore";
import { useFileSystemStore } from "@/store/fileSystemStore";

export default function Desktop() {
  const { windows } = useWindowStore();
  const { desktopFiles } = useFileSystemStore();

  return (
    <div className="desktop">
      <DesktopBackground />

      {/* Desktop Icons */}
      <div className="desktop-icons absolute inset-0 p-4">
        <div className="grid grid-cols-[repeat(auto-fill,80px)] gap-4">
          {desktopFiles.map((file) => (
            <DesktopIcon key={file.path} file={file} />
          ))}
        </div>
      </div>

      {/* Windows */}
      <div className="windows-layer absolute inset-0 pointer-events-none">
        {Array.from(windows.values()).map((window) => (
          window.state !== "minimized" && (
            <Window key={window.id} window={window} />
          )
        ))}
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
```

**`src/components/Desktop/DesktopBackground.tsx`:**

```typescript
import React from "react";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { useWindowStore } from "@/store/windowStore";

export default function DesktopBackground() {
  const { openWindow } = useWindowStore();

  const handleNewTerminal = () => {
    openWindow({
      type: "terminal",
      title: "Terminal",
      icon: "terminal",
    });
  };

  const handleNewFolder = () => {
    // Create new folder
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900">
        {/* Background */}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={handleNewTerminal}>
          Open Terminal
        </ContextMenuItem>
        <ContextMenuItem onClick={handleNewFolder}>
          New Folder
        </ContextMenuItem>
        <ContextMenuItem>Refresh</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
```

**`src/components/Desktop/DesktopIcon.tsx`:**

```typescript
import React from "react";
import { File, Folder, FileText, Image, Video } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import type { FileNode } from "@/types/file";

interface DesktopIconProps {
  file: FileNode;
}

export default function DesktopIcon({ file }: DesktopIconProps) {
  const { openWindow } = useWindowStore();

  const getIcon = () => {
    if (file.type === "directory") return <Folder className="w-8 h-8" />;
    if (file.name.endsWith(".txt")) return <FileText className="w-8 h-8" />;
    if (file.name.endsWith(".png") || file.name.endsWith(".jpg")) return <Image className="w-8 h-8" />;
    if (file.name.endsWith(".mp4")) return <Video className="w-8 h-8" />;
    return <File className="w-8 h-8" />;
  };

  const handleDoubleClick = () => {
    if (file.type === "directory") {
      openWindow({
        type: "file-explorer",
        title: file.name,
        icon: "folder",
        data: { path: file.path },
      });
    } else {
      openWindow({
        type: "text-editor",
        title: file.name,
        icon: "file",
        data: { path: file.path },
      });
    }
  };

  return (
    <button
      className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 transition-colors"
      onDoubleClick={handleDoubleClick}
    >
      <div className="text-white">{getIcon()}</div>
      <span className="text-xs text-white text-center line-clamp-2">
        {file.name}
      </span>
    </button>
  );
}
```

---

## Phase 3: Window Management

### 3.1 Zustand Window Store

**`src/store/windowStore.ts`:**

```typescript
import { create } from "zustand";
import { nanoid } from "nanoid";
import type { Window } from "@/types/window";

interface WindowState {
  windows: Map<string, Window>;
  activeWindowId: string | null;
  nextZIndex: number;

  openWindow: (config: Partial<Window>) => string;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  updateWindowPosition: (id: string, x: number, y: number) => void;
  updateWindowSize: (id: string, width: number, height: number) => void;
}

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: new Map(),
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (config) => {
    const id = nanoid();
    const window: Window = {
      id,
      type: config.type || "custom",
      title: config.title || "Window",
      icon: config.icon || "window",
      position: config.position || { x: 100, y: 100 },
      size: config.size || { width: 800, height: 600 },
      state: "normal",
      zIndex: get().nextZIndex,
      content: config.content,
      minimumSize: config.minimumSize || { width: 300, height: 200 },
      resizable: config.resizable ?? true,
      draggable: config.draggable ?? true,
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
    const { nextZIndex } = get();
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const updatedWindow = { ...window, zIndex: nextZIndex };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);

      return {
        windows: newWindows,
        activeWindowId: id,
        nextZIndex: nextZIndex + 1,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const updatedWindow = { ...window, state: "minimized" as const };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);

      return { windows: newWindows };
    });
  },

  maximizeWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const updatedWindow = { ...window, state: "maximized" as const };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);

      return { windows: newWindows };
    });
  },

  restoreWindow: (id) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const updatedWindow = { ...window, state: "normal" as const };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);

      return { windows: newWindows };
    });
  },

  updateWindowPosition: (id, x, y) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const updatedWindow = { ...window, position: { x, y } };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);

      return { windows: newWindows };
    });
  },

  updateWindowSize: (id, width, height) => {
    set((state) => {
      const window = state.windows.get(id);
      if (!window) return state;

      const updatedWindow = { ...window, size: { width, height } };
      const newWindows = new Map(state.windows);
      newWindows.set(id, updatedWindow);

      return { windows: newWindows };
    });
  },
}));
```

### 3.2 Window Component with react-rnd

**`src/components/Window/Window.tsx`:**

```typescript
import React, { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import WindowHeader from "./WindowHeader";
import WindowContent from "./WindowContent";
import { useWindowStore } from "@/store/windowStore";
import type { Window as WindowType } from "@/types/window";
import { cn } from "@/lib/utils";

interface WindowProps {
  window: WindowType;
}

export default function Window({ window }: WindowProps) {
  const { focusWindow, updateWindowPosition, updateWindowSize } = useWindowStore();
  const rndRef = useRef<Rnd>(null);

  const isMaximized = window.state === "maximized";

  const position = isMaximized ? { x: 0, y: 0 } : window.position;
  const size = isMaximized
    ? { width: "100vw", height: "calc(100vh - 48px)" }
    : window.size;

  const handleDragStop = (e: any, d: any) => {
    updateWindowPosition(window.id, d.x, d.y);
  };

  const handleResizeStop = (e: any, direction: any, ref: any, delta: any, position: any) => {
    updateWindowSize(window.id, ref.offsetWidth, ref.offsetHeight);
    updateWindowPosition(window.id, position.x, position.y);
  };

  return (
    <Rnd
      ref={rndRef}
      position={position}
      size={size}
      minWidth={window.minimumSize.width}
      minHeight={window.minimumSize.height}
      maxWidth={window.maximumSize?.width}
      maxHeight={window.maximumSize?.height}
      bounds="parent"
      disableDragging={!window.draggable || isMaximized}
      enableResizing={window.resizable && !isMaximized}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={() => focusWindow(window.id)}
      style={{ zIndex: window.zIndex }}
      className={cn(
        "window pointer-events-auto animate-window-appear",
        isMaximized && "!rounded-none"
      )}
      dragHandleClassName="window-drag-handle"
    >
      <div className="flex flex-col h-full">
        <WindowHeader window={window} />
        <WindowContent window={window} />
      </div>
    </Rnd>
  );
}
```

**`src/components/Window/WindowHeader.tsx`:**

```typescript
import React from "react";
import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowStore } from "@/store/windowStore";
import type { Window } from "@/types/window";

interface WindowHeaderProps {
  window: Window;
}

export default function WindowHeader({ window }: WindowHeaderProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } = useWindowStore();

  const isMaximized = window.state === "maximized";

  return (
    <div className="window-header window-drag-handle">
      <div className="flex items-center gap-2">
        <span className="font-medium">{window.title}</span>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => minimizeWindow(window.id)}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => isMaximized ? restoreWindow(window.id) : maximizeWindow(window.id)}
        >
          {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 hover:bg-red-500 hover:text-white"
          onClick={() => closeWindow(window.id)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

**`src/components/Window/WindowContent.tsx`:**

```typescript
import React from "react";
import Terminal from "../Apps/Terminal/Terminal";
import FileExplorer from "../Apps/FileExplorer/FileExplorer";
import TextEditor from "../Apps/TextEditor/TextEditor";
import type { Window } from "@/types/window";

interface WindowContentProps {
  window: Window;
}

export default function WindowContent({ window }: WindowContentProps) {
  const renderContent = () => {
    switch (window.type) {
      case "terminal":
        return <Terminal windowId={window.id} />;
      case "file-explorer":
        return <FileExplorer path={window.data?.path} />;
      case "text-editor":
        return <TextEditor filePath={window.data?.path} />;
      default:
        return window.content || <div>Empty window</div>;
    }
  };

  return (
    <div className="window-content">
      {renderContent()}
    </div>
  );
}
```

---

## Phase 4: Desktop Environment

### 4.1 Taskbar Component

**`src/components/Taskbar/Taskbar.tsx`:**

```typescript
import React from "react";
import AppLauncher from "./AppLauncher";
import WindowList from "./WindowList";
import SystemTray from "./SystemTray";

export default function Taskbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-background/95 backdrop-blur border-t border-border z-[9999]">
      <div className="flex items-center justify-between h-full px-2">
        <AppLauncher />
        <WindowList />
        <SystemTray />
      </div>
    </div>
  );
}
```

**`src/components/Taskbar/AppLauncher.tsx`:**

```typescript
import React from "react";
import { Terminal, Folder, FileText, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowStore } from "@/store/windowStore";

export default function AppLauncher() {
  const { openWindow } = useWindowStore();

  const apps = [
    { icon: Terminal, label: "Terminal", type: "terminal" as const },
    { icon: Folder, label: "Files", type: "file-explorer" as const },
    { icon: FileText, label: "Editor", type: "text-editor" as const },
    { icon: Settings, label: "Settings", type: "settings" as const },
  ];

  return (
    <div className="flex items-center gap-1">
      {apps.map((app) => (
        <Button
          key={app.type}
          variant="ghost"
          size="icon"
          className="h-10 w-10"
          onClick={() => openWindow({ type: app.type, title: app.label })}
          title={app.label}
        >
          <app.icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}
```

**`src/components/Taskbar/WindowList.tsx`:**

```typescript
import React from "react";
import { Button } from "@/components/ui/button";
import { useWindowStore } from "@/store/windowStore";
import { cn } from "@/lib/utils";

export default function WindowList() {
  const { windows, activeWindowId, focusWindow, restoreWindow } = useWindowStore();

  return (
    <div className="flex-1 flex items-center gap-1 px-2 overflow-x-auto">
      {Array.from(windows.values()).map((window) => (
        <Button
          key={window.id}
          variant="ghost"
          size="sm"
          className={cn(
            "max-w-[200px] truncate",
            activeWindowId === window.id && "bg-accent"
          )}
          onClick={() => {
            if (window.state === "minimized") {
              restoreWindow(window.id);
            }
            focusWindow(window.id);
          }}
        >
          {window.title}
        </Button>
      ))}
    </div>
  );
}
```

**`src/components/Taskbar/SystemTray.tsx`:**

```typescript
import React, { useState, useEffect } from "react";

export default function SystemTray() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-4 px-2">
      <div className="text-sm font-mono">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}
```

### 4.2 File System Store

**`src/store/fileSystemStore.ts`:**

```typescript
import { create } from "zustand";
import { embedOS } from "@/lib/embedos";
import type { FileNode } from "@/types/file";

interface FileSystemState {
  currentPath: string;
  files: FileNode[];
  desktopFiles: FileNode[];
  selectedFiles: string[];

  navigate: (path: string) => Promise<void>;
  createFile: (name: string, content: string) => Promise<void>;
  createDirectory: (name: string) => Promise<void>;
  deleteFile: (path: string) => Promise<void>;
  renameFile: (oldPath: string, newPath: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
}

export const useFileSystemStore = create<FileSystemState>((set, get) => ({
  currentPath: "/",
  files: [],
  desktopFiles: [],
  selectedFiles: [],

  navigate: async (path) => {
    const files = await embedOS.fileSystem.list(path);
    set({ currentPath: path, files: files as FileNode[] });
  },

  createFile: async (name, content) => {
    const { currentPath } = get();
    const path = `${currentPath}/${name}`.replace(/\/+/g, "/");
    await embedOS.fileSystem.write(path, content);
    await get().refreshFiles();
  },

  createDirectory: async (name) => {
    // Implement directory creation
    await get().refreshFiles();
  },

  deleteFile: async (path) => {
    await embedOS.fileSystem.delete(path);
    await get().refreshFiles();
  },

  renameFile: async (oldPath, newPath) => {
    const content = await embedOS.fileSystem.read(oldPath);
    await embedOS.fileSystem.write(newPath, content);
    await embedOS.fileSystem.delete(oldPath);
    await get().refreshFiles();
  },

  readFile: async (path) => {
    return await embedOS.fileSystem.read(path);
  },

  writeFile: async (path, content) => {
    await embedOS.fileSystem.write(path, content);
    await get().refreshFiles();
  },

  refreshFiles: async () => {
    const { currentPath } = get();
    const files = await embedOS.fileSystem.list(currentPath);
    const desktopFiles = await embedOS.fileSystem.list("/desktop");
    set({
      files: files as FileNode[],
      desktopFiles: desktopFiles as FileNode[],
    });
  },
}));
```

---

## Phase 5: Applications

### 5.1 Terminal Application with xterm.js

**`src/components/Apps/Terminal/Terminal.tsx`:**

```typescript
import React, { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";
import { embedOS } from "@/lib/embedos";

interface TerminalProps {
  windowId: string;
}

export default function Terminal({ windowId }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize xterm.js
    const xterm = new XTerm({
      theme: {
        background: "#1e1e1e",
        foreground: "#ffffff",
        cursor: "#4af626",
      },
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
      fontSize: 14,
      cursorBlink: true,
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    xterm.loadAddon(fitAddon);
    xterm.loadAddon(webLinksAddon);

    xterm.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = xterm;
    fitAddonRef.current = fitAddon;

    // Command handling
    let currentLine = "";

    xterm.writeln("Embed-OS Terminal");
    xterm.writeln("Type 'help' for available commands\n");
    xterm.write("$ ");

    xterm.onData((data) => {
      if (data === "\r") {
        // Enter key
        xterm.writeln("");
        if (currentLine.trim()) {
          handleCommand(currentLine.trim());
        }
        currentLine = "";
        xterm.write("$ ");
      } else if (data === "\x7F") {
        // Backspace
        if (currentLine.length > 0) {
          currentLine = currentLine.slice(0, -1);
          xterm.write("\b \b");
        }
      } else if (data === "\x03") {
        // Ctrl+C
        xterm.writeln("^C");
        currentLine = "";
        xterm.write("$ ");
      } else {
        currentLine += data;
        xterm.write(data);
      }
    });

    const handleCommand = async (command: string) => {
      try {
        const result = await embedOS.terminal.execute(command);
        if (result) {
          xterm.writeln(result);
        }
      } catch (error) {
        xterm.writeln(`Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };

    // Fit on resize
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    return () => {
      resizeObserver.disconnect();
      xterm.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="w-full h-full" />;
}
```

### 5.2 File Explorer Application

**`src/components/Apps/FileExplorer/FileExplorer.tsx`:**

```typescript
import React, { useEffect } from "react";
import { useFileSystemStore } from "@/store/fileSystemStore";
import FileList from "./FileList";
import FileTree from "./FileTree";

interface FileExplorerProps {
  path?: string;
}

export default function FileExplorer({ path = "/" }: FileExplorerProps) {
  const { navigate, currentPath, files } = useFileSystemStore();

  useEffect(() => {
    navigate(path);
  }, [path]);

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-border">
        <FileTree />
      </div>
      <div className="flex-1">
        <FileList files={files} currentPath={currentPath} />
      </div>
    </div>
  );
}
```

**`src/components/Apps/FileExplorer/FileList.tsx`:**

```typescript
import React from "react";
import { File, Folder } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import { useFileSystemStore } from "@/store/fileSystemStore";
import type { FileNode } from "@/types/file";

interface FileListProps {
  files: FileNode[];
  currentPath: string;
}

export default function FileList({ files, currentPath }: FileListProps) {
  const { openWindow } = useWindowStore();
  const { navigate } = useFileSystemStore();

  const handleDoubleClick = (file: FileNode) => {
    if (file.type === "directory") {
      navigate(file.path);
    } else {
      openWindow({
        type: "text-editor",
        title: file.name,
        data: { path: file.path },
      });
    }
  };

  return (
    <div className="p-4">
      <div className="text-sm text-muted-foreground mb-4">{currentPath}</div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
        {files.map((file) => (
          <button
            key={file.path}
            className="flex flex-col items-center gap-2 p-3 rounded hover:bg-accent transition-colors"
            onDoubleClick={() => handleDoubleClick(file)}
          >
            {file.type === "directory" ? (
              <Folder className="w-8 h-8" />
            ) : (
              <File className="w-8 h-8" />
            )}
            <span className="text-xs text-center line-clamp-2">{file.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

### 5.3 Text Editor Application

**`src/components/Apps/TextEditor/TextEditor.tsx`:**

```typescript
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useFileSystemStore } from "@/store/fileSystemStore";
import { useToast } from "@/components/ui/use-toast";

interface TextEditorProps {
  filePath?: string;
}

export default function TextEditor({ filePath }: TextEditorProps) {
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const { readFile, writeFile } = useFileSystemStore();
  const { toast } = useToast();

  useEffect(() => {
    if (filePath) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    if (!filePath) return;
    try {
      const data = await readFile(filePath);
      setContent(data);
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Error loading file",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!filePath) return;
    try {
      await writeFile(filePath, content);
      setIsDirty(false);
      toast({
        title: "File saved",
        description: `${filePath} saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Error saving file",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        {isDirty && <span className="text-sm text-muted-foreground">•</span>}
      </div>
      <textarea
        className="flex-1 p-4 bg-transparent font-mono text-sm resize-none outline-none"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsDirty(true);
        }}
        placeholder="Start typing..."
      />
    </div>
  );
}
```

### 5.4 Text Editor Application (Basic - MVP)

**`src/components/Apps/TextEditor/TextEditor.tsx`:**

```typescript
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useFileSystemStore } from "@/store/fileSystemStore";
import { useToast } from "@/components/ui/use-toast";

interface TextEditorProps {
  filePath?: string;
}

export default function TextEditor({ filePath }: TextEditorProps) {
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const { readFile, writeFile } = useFileSystemStore();
  const { toast } = useToast();

  useEffect(() => {
    if (filePath) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    if (!filePath) return;
    try {
      const data = await readFile(filePath);
      setContent(data);
      setIsDirty(false);
    } catch (error) {
      toast({
        title: "Error loading file",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!filePath) return;
    try {
      await writeFile(filePath, content);
      setIsDirty(false);
      toast({
        title: "File saved",
        description: `${filePath} saved successfully`,
      });
    } catch (error) {
      toast({
        title: "Error saving file",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b border-border">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        {isDirty && <span className="text-sm text-muted-foreground">•</span>}
      </div>
      <textarea
        className="flex-1 p-4 bg-transparent font-mono text-sm resize-none outline-none"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsDirty(true);
        }}
        placeholder="Start typing..."
      />
    </div>
  );
}
```

### 5.5 Camera & Video Recording Application (Post-MVP)

**Note:** This can be implemented after the MVP is complete.

**`src/components/Apps/CodeEditor/CodeEditor.tsx`:**

```typescript
import React, { useState, useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Save, Download, Upload, Settings } from "lucide-react";
import { useFileSystemStore } from "@/store/fileSystemStore";
import { useToast } from "@/components/ui/use-toast";
import type { editor } from "monaco-editor";

interface CodeEditorProps {
  filePath?: string;
  windowId: string;
}

export default function CodeEditor({ filePath, windowId }: CodeEditorProps) {
  const [content, setContent] = useState("");
  const [language, setLanguage] = useState("typescript");
  const [isDirty, setIsDirty] = useState(false);
  const [theme, setTheme] = useState<"vs-dark" | "light">("vs-dark");

  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const { readFile, writeFile } = useFileSystemStore();
  const { toast } = useToast();

  useEffect(() => {
    if (filePath) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    if (!filePath) return;

    try {
      const data = await readFile(filePath);
      setContent(data);
      setIsDirty(false);

      // Detect language from file extension
      const ext = filePath.split(".").pop()?.toLowerCase();
      const languageMap: Record<string, string> = {
        ts: "typescript",
        tsx: "typescript",
        js: "javascript",
        jsx: "javascript",
        json: "json",
        html: "html",
        css: "css",
        md: "markdown",
        py: "python",
        rs: "rust",
        go: "go",
        java: "java",
        c: "c",
        cpp: "cpp",
        sh: "shell",
      };

      if (ext && languageMap[ext]) {
        setLanguage(languageMap[ext]);
      }
    } catch (error) {
      toast({
        title: "Error loading file",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    }
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });

    // Configure editor
    editor.updateOptions({
      minimap: { enabled: true },
      fontSize: 14,
      lineNumbers: "on",
      rulers: [80, 120],
      formatOnPaste: true,
      formatOnType: true,
      automaticLayout: true,
    });
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
      setIsDirty(true);
    }
  };

  const handleSave = async () => {
    if (!filePath) {
      // Show save dialog
      const filename = prompt("Enter filename:");
      if (!filename) return;

      try {
        await writeFile(`/${filename}`, content);
        toast({
          title: "File saved",
          description: `Saved as /${filename}`,
        });
        setIsDirty(false);
      } catch (error) {
        toast({
          title: "Error saving file",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      }
    } else {
      try {
        await writeFile(filePath, content);
        setIsDirty(false);
        toast({
          title: "File saved",
          description: `${filePath} saved successfully`,
        });
      } catch (error) {
        toast({
          title: "Error saving file",
          description: error instanceof Error ? error.message : String(error),
          variant: "destructive",
        });
      }
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath?.split("/").pop() || "file.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const text = await file.text();
      setContent(text);
      setIsDirty(true);
    };
    input.click();
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 p-2 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save className="w-4 h-4 mr-2" />
            Save {isDirty && "*"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
          >
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handleUpload}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-2 py-1 text-sm border rounded"
          >
            <option value="typescript">TypeScript</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="go">Go</option>
            <option value="java">Java</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
            <option value="json">JSON</option>
            <option value="markdown">Markdown</option>
          </select>

          <Button
            size="sm"
            variant="ghost"
            onClick={toggleTheme}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={content}
          theme={theme}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
    </div>
  );
}
```

**Features:**

- Full VS Code editor experience (Monaco Editor)
- Syntax highlighting for 10+ languages
- IntelliSense and autocomplete
- Multi-cursor editing
- Find and replace
- Command palette (Ctrl+Shift+P)
- Keyboard shortcuts (Ctrl+S to save)
- Light/dark themes
- Minimap
- File upload/download
- Integration with virtual file system

**Monaco Editor Benefits:**

- Same editor as VS Code
- 100% client-side (no server needed)
- Supports TypeScript, JavaScript, Python, Rust, Go, etc.
- Built-in IntelliSense and type checking
- Emmet support for HTML/CSS
- Vim/Emacs keybindings available
- Accessibility support

**Configuration Options:**

```typescript
// Advanced Monaco configuration
editor.updateOptions({
  minimap: { enabled: true },
  fontSize: 14,
  fontFamily: "SF Mono, Monaco, Cascadia Code, monospace",
  lineNumbers: "on",
  rulers: [80, 120],
  formatOnPaste: true,
  formatOnType: true,
  autoIndent: "full",
  tabSize: 2,
  insertSpaces: true,
  wordWrap: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  bracketPairColorization: { enabled: true },
  guides: {
    bracketPairs: true,
    indentation: true,
  },
});
```

### 5.5 Camera & Video Recording Application

**Dependencies:**

```bash
# MediaRecorder API is built into browsers - no additional dependencies needed
# For advanced features, consider:
bun add recordrtc  # Optional: Advanced recording features
```

**`src/components/Apps/Camera/Camera.tsx`:**

```typescript
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Video, Square, Download, SwitchCamera } from "lucide-react";
import { useFileSystemStore } from "@/store/fileSystemStore";
import { useToast } from "@/components/ui/use-toast";

interface CameraProps {
  windowId: string;
}

export default function Camera({ windowId }: CameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [mediaType, setMediaType] = useState<"photo" | "video">("photo");

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { writeFile } = useFileSystemStore();
  const { toast } = useToast();

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: mediaType === "video",
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      if (!blob) return;

      const filename = `/photos/photo_${Date.now()}.png`;
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await writeFile(filename, base64);

        toast({
          title: "Photo captured",
          description: `Saved to ${filename}`,
        });
      };

      reader.readAsDataURL(blob);
    }, "image/png");
  };

  const startRecording = () => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm;codecs=vp9",
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const filename = `/videos/video_${Date.now()}.webm`;

      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        await writeFile(filename, base64);

        toast({
          title: "Video saved",
          description: `Saved to ${filename}`,
        });
      };

      reader.readAsDataURL(blob);
      setRecordedChunks([]);
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Video Preview */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium">Recording</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 p-4 bg-black/50 backdrop-blur">
        {/* Switch Camera */}
        <Button
          variant="ghost"
          size="icon"
          onClick={switchCamera}
          className="text-white hover:bg-white/20"
        >
          <SwitchCamera className="w-5 h-5" />
        </Button>

        {/* Mode Toggle */}
        <div className="flex gap-2 bg-white/10 rounded-lg p-1">
          <Button
            variant={mediaType === "photo" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMediaType("photo")}
            className={mediaType === "photo" ? "" : "text-white hover:bg-white/20"}
          >
            <CameraIcon className="w-4 h-4 mr-2" />
            Photo
          </Button>
          <Button
            variant={mediaType === "video" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMediaType("video")}
            className={mediaType === "video" ? "" : "text-white hover:bg-white/20"}
          >
            <Video className="w-4 h-4 mr-2" />
            Video
          </Button>
        </div>

        {/* Capture/Record Button */}
        {mediaType === "photo" ? (
          <Button
            size="lg"
            onClick={capturePhoto}
            className="rounded-full w-16 h-16 bg-white hover:bg-gray-200"
          >
            <CameraIcon className="w-6 h-6 text-black" />
          </Button>
        ) : isRecording ? (
          <Button
            size="lg"
            onClick={stopRecording}
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
          >
            <Square className="w-6 h-6" />
          </Button>
        ) : (
          <Button
            size="lg"
            onClick={startRecording}
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600"
          >
            <Video className="w-6 h-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
```

**Features:**

- Photo capture with webcam
- Video recording with audio
- Front/back camera switching (mobile)
- Save photos/videos to file system
- Recording indicator
- Mode switching (photo/video)

**Browser APIs Used:**

- `navigator.mediaDevices.getUserMedia()` - Camera access
- `MediaRecorder` - Video recording
- `Canvas` API - Photo capture
- `FileReader` - File conversion

---

## Phase 6: Advanced Features (Post-MVP / P1)

### 6.1 Code Editor with Monaco (VS Code) - **P1 PRIORITY**

Monaco Editor is the same editor that powers VS Code, and it runs entirely client-side.

**Dependencies (already added in Phase 1):**

- `@monaco-editor/react`
- `monaco-editor`

**`src/components/Apps/CodeEditor/CodeEditor.tsx`:**

The full implementation code from section 5.4 above should be moved here for the P1 phase.

**Why Monaco Editor for P1:**

- Full VS Code editing experience in the browser
- Syntax highlighting for 50+ languages
- IntelliSense and autocomplete
- Multi-cursor editing, find/replace
- Command palette (Ctrl+Shift+P)
- Keyboard shortcuts (Ctrl+S to save)
- Light/dark themes, minimap
- 100% client-side (no server needed)
- Essential for developer productivity in a browser OS

**Implementation Priority:** Implement this after MVP (Phase 5) is complete and stable.

### 6.2 Enhanced File System (IndexedDB)

**Migrate from localStorage to localForage:**

```bash
bun add localforage
```

**Update `src/lib/embedos.ts`:**

```typescript
import localforage from "localforage";

// Configure localForage
const fileStore = localforage.createInstance({
  name: "embedos",
  storeName: "filesystem",
});

// Update FileSystem implementation to use localforage
const fileSystem: FileSystem = {
  read: async (path: string): Promise<string> => {
    const content = await fileStore.getItem<string>(path);
    if (content === null) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
  },

  write: async (path: string, content: string): Promise<void> => {
    await fileStore.setItem(path, content);
  },

  list: async (path: string): Promise<string[]> => {
    const keys = await fileStore.keys();
    return keys.filter((key) => key.startsWith(path));
  },

  delete: async (path: string): Promise<void> => {
    await fileStore.removeItem(path);
  },
};
```

### 6.2 Keyboard Shortcuts

**Create `src/hooks/useKeyboardShortcuts.ts`:**

```typescript
import { useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";

export function useKeyboardShortcuts() {
  const { openWindow, closeWindow, activeWindowId } = useWindowStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + T - Open terminal
      if ((e.ctrlKey || e.metaKey) && e.key === "t") {
        e.preventDefault();
        openWindow({ type: "terminal", title: "Terminal" });
      }

      // Ctrl/Cmd + E - Open file explorer
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        openWindow({ type: "file-explorer", title: "Files" });
      }

      // Ctrl/Cmd + W - Close active window
      if ((e.ctrlKey || e.metaKey) && e.key === "w" && activeWindowId) {
        e.preventDefault();
        closeWindow(activeWindowId);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeWindowId]);
}
```

### 6.3 Drag and Drop for Files

**Update `DesktopIcon.tsx` for drag support:**

```typescript
const [isDragging, setIsDragging] = useState(false);

const handleDragStart = (e: React.DragEvent) => {
  e.dataTransfer.setData("text/plain", JSON.stringify(file));
  setIsDragging(true);
};

const handleDragEnd = () => {
  setIsDragging(false);
};

return (
  <button
    draggable
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
    className={cn(
      "flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 transition-colors",
      isDragging && "opacity-50"
    )}
    onDoubleClick={handleDoubleClick}
  >
    {/* ... */}
  </button>
);
```

### 6.4 Future: Local LLM Integration (WebLLM)

**Install WebLLM:**

```bash
bun add @mlc-ai/web-llm
```

**Create Chat App:**

```typescript
// src/components/Apps/Chat/Chat.tsx
import { CreateMLCEngine } from "@mlc-ai/web-llm";

// Initialize WebLLM
const engine = await CreateMLCEngine("Llama-3-8B-Instruct-q4f32_1");

// Chat interface component...
```

### 6.5 Future: AI Background Generator

**Create background generation service:**

```typescript
// src/services/backgroundGenerator.ts
import { CreateMLCEngine } from "@mlc-ai/web-llm";

export async function generateBackground(prompt: string) {
  // Use Stable Diffusion WASM or image generation API
  // Generate pixel art background based on prompt
}
```

---

## Testing Strategy

### Unit Tests

**Terminal Command Tests:**

```typescript
// src/__tests__/terminal.test.ts
import { test, expect } from "bun:test";
import { embedOS } from "@/lib/embedos";

test("help command returns available commands", async () => {
  const result = await embedOS.terminal.execute("help");
  expect(result).toContain("Available commands");
});

test("echo command returns arguments", async () => {
  const result = await embedOS.terminal.execute("echo hello world");
  expect(result).toBe("hello world");
});
```

**Window Store Tests:**

```typescript
// src/__tests__/windowStore.test.ts
import { test, expect } from "bun:test";
import { useWindowStore } from "@/store/windowStore";

test("openWindow creates new window", () => {
  const { openWindow, windows } = useWindowStore.getState();
  const id = openWindow({ type: "terminal", title: "Test" });
  expect(windows.has(id)).toBe(true);
});

test("closeWindow removes window", () => {
  const { openWindow, closeWindow, windows } = useWindowStore.getState();
  const id = openWindow({ type: "terminal", title: "Test" });
  closeWindow(id);
  expect(windows.has(id)).toBe(false);
});
```

### Integration Tests

**Use Playwright for E2E tests:**

```bash
bun add -d playwright
bunx playwright install
```

```typescript
// e2e/desktop.spec.ts
import { test, expect } from "@playwright/test";

test("can open and close terminal window", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Click terminal icon
  await page.click('[title="Terminal"]');

  // Check window appeared
  await expect(page.locator(".window")).toBeVisible();

  // Close window
  await page.click('.window button[title="Close"]');

  // Check window disappeared
  await expect(page.locator(".window")).not.toBeVisible();
});

test("can drag window", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click('[title="Terminal"]');

  const window = page.locator(".window");
  const box = await window.boundingBox();

  // Drag window
  await page.mouse.move(box!.x + 50, box!.y + 10);
  await page.mouse.down();
  await page.mouse.move(box!.x + 200, box!.y + 100);
  await page.mouse.up();

  const newBox = await window.boundingBox();
  expect(newBox!.x).toBeGreaterThan(box!.x);
});
```

---

## Performance Considerations

### Optimization Strategies

1. **Virtual Scrolling for File Lists**
   - Use `react-window` for large file lists
   - Only render visible items

2. **Lazy Load Applications**
   - Use React.lazy() for app components
   - Load on demand when window opens

3. **Memoization**
   - Use React.memo() for expensive components
   - useMemo() for computed values
   - useCallback() for event handlers

4. **Window Rendering**
   - Only render visible windows (not minimized)
   - Use CSS transforms for smooth dragging
   - Debounce resize operations

5. **Storage Optimization**
   - Use IndexedDB for large files
   - Implement file chunking
   - Cache frequently accessed files

6. **Bundle Size**
   - Code splitting by route/app
   - Tree shaking unused exports
   - Analyze bundle with `bun build --analyze`

### Performance Metrics

**Target Metrics:**

- Initial load: < 2s
- Window open: < 100ms
- File operations: < 50ms
- Terminal command: < 100ms
- Drag smoothness: 60 FPS
- Memory usage: < 100MB baseline

**Monitoring:**

```typescript
// src/lib/performance.ts
export function measurePerformance(name: string, fn: () => void) {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name}: ${end - start}ms`);
}
```

---

## Future Enhancements

### Short Term (1-2 weeks)

- [ ] Multiple desktop workspaces
- [ ] Window snapping (snap to edges)
- [ ] Custom themes and wallpapers
- [ ] Context menus for files
- [ ] File search functionality
- [ ] Command history in terminal
- [ ] Tab completion for paths

### Medium Term (1 month)

- [ ] WebLLM integration for local AI
- [ ] AI-powered background generator
- [ ] Code editor with syntax highlighting (Monaco/CodeMirror)
- [ ] Image viewer application
- [ ] PDF viewer application
- [ ] Settings application
- [ ] User preferences persistence

### Long Term (2+ months)

- [ ] Wasmer.js integration for WASM apps
- [ ] Multi-user support with auth
- [ ] Cloud sync for files
- [ ] PWA with offline support
- [ ] WebRTC for peer-to-peer file sharing
- [ ] Virtual machine support
- [ ] Developer tools (debugger, profiler)
- [ ] Plugin system for extensions

---

## Implementation Checklist

### Phase 1: Foundation ✅

- [ ] Install React and core dependencies
- [ ] Setup Tailwind CSS
- [ ] Initialize shadcn/ui
- [ ] Configure Bun fullstack server
- [ ] Setup HTML imports
- [ ] Add Wasmer.js headers

### Phase 2: Core Components

- [ ] Create Desktop component
- [ ] Create DesktopBackground with context menu
- [ ] Create DesktopIcon component
- [ ] Create Window component
- [ ] Create WindowHeader with controls
- [ ] Create WindowContent router

### Phase 3: Window Management

- [ ] Implement windowStore with Zustand
- [ ] Integrate react-rnd for dragging/resizing
- [ ] Implement focus management
- [ ] Implement minimize/maximize/close
- [ ] Add window bounds constraints
- [ ] Add window animations

### Phase 4: Desktop Environment

- [ ] Create Taskbar component
- [ ] Create AppLauncher
- [ ] Create WindowList in taskbar
- [ ] Create SystemTray with clock
- [ ] Implement fileSystemStore
- [ ] Add desktop icon grid layout

### Phase 5: Applications (MVP/P0)

- [ ] Integrate xterm.js Terminal
- [ ] Connect terminal to embedOS commands
- [ ] Create FileExplorer with FileList
- [ ] Create FileTree for navigation
- [ ] Create basic TextEditor with save
- [ ] Add file operations (create/delete/rename)

### Phase 6: P1 Features (Post-MVP)

- [ ] Integrate Monaco Editor (VS Code) for advanced code editing
- [ ] Add syntax highlighting for 50+ languages
- [ ] Implement IntelliSense and autocomplete
- [ ] Add Camera app with photo capture
- [ ] Add video recording functionality
- [ ] Implement camera switching (front/back)

### Phase 7: Polish & Optimization

- [ ] Add keyboard shortcuts
- [ ] Implement drag-and-drop for files
- [ ] Add smooth animations
- [ ] Implement themes
- [ ] Migrate to IndexedDB for larger storage
- [ ] Add error handling
- [ ] Write tests
- [ ] Performance optimization

---

## Resources

### Documentation

- [Bun Fullstack Server](https://bun.com/docs/bundler/fullstack)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [react-rnd](https://github.com/bokuweb/react-rnd)
- [xterm.js](https://xtermjs.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)

### Inspiration

- [PostHog Website](https://posthog.com/) - Desktop UI reference
- [Windows 95 in React](https://react95.io/)
- [macOS UI Kit](https://github.com/PuruVJ/macos-web)

---

## Notes

### Design Decisions

1. **React over Vanilla JS**: Better component architecture, ecosystem
2. **Tailwind + shadcn/ui**: Fast development, consistent design
3. **Zustand over Redux**: Simpler, less boilerplate
4. **react-rnd**: Mature, well-maintained window library
5. **xterm.js**: Industry standard terminal emulator
6. **Bun native bundling**: Fast, no Vite needed

### Challenges

1. Window z-index management with many windows
2. Performance with many desktop icons
3. File system limitations (storage quotas)
4. WASM integration complexity
5. Cross-browser compatibility (SharedArrayBuffer)

### Success Factors

- Start simple, iterate quickly
- Test early and often
- Focus on UX and performance
- Keep components small and focused
- Document as you build

---

**Last Updated**: 2025-11-08
**Status**: Ready for Implementation
**Estimated Time**: 2-3 weeks for Phases 1-5, 1+ month for Phase 6
