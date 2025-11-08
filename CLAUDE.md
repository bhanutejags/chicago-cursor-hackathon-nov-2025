# Embed-OS Development Guidelines

## Project Overview

**Embed-OS** is a browser-based operating system running entirely client-side. This is a hackathon project for the Chicago Cursor Hackathon (November 2025).

**🚨 IMPORTANT: Client-Side Only Architecture**

- This project runs **100% in the browser** with **no backend server in production**
- All data storage uses browser APIs (localStorage, IndexedDB)
- The Bun dev server is **only for development** (HMR)
- Production deployment is static files (GitHub Pages, Netlify, etc.)

## Technology Stack

- **Runtime**: Bun 1.3.1+
- **Framework**: React 18+ with TypeScript 5+
- **Styling**: Tailwind CSS (with typed config) + shadcn/ui
- **UI Components**: react-rnd, xterm.js, lucide-react
- **State**: Zustand
- **Storage**: localStorage → IndexedDB (via localForage/Dexie.js)
- **Build**: Bun native bundler (no Vite/Webpack)

## Bun Best Practices

Default to using Bun instead of Node.js:

- Use `bun <file>` instead of `node <file>` or `ts-node <file>`
- Use `bun test` instead of `jest` or `vitest`
- Use `bun build` instead of `webpack` or `esbuild`
- Use `bun install` instead of `npm install` or `yarn install` or `pnpm install`
- Use `bun run <script>` instead of `npm run <script>`
- Bun automatically loads .env, so don't use dotenv

### Bun APIs (Preferred)

- `Bun.serve()` supports WebSockets, HTTPS, and routes. Don't use `express`.
- `bun:sqlite` for SQLite. Don't use `better-sqlite3`.
- `Bun.redis` for Redis. Don't use `ioredis`.
- `Bun.sql` for Postgres. Don't use `pg` or `postgres.js`.
- `WebSocket` is built-in. Don't use `ws`.
- Prefer `Bun.file` over `node:fs`'s readFile/writeFile
- `Bun.$\`ls\`` instead of execa

## Development Server

Use Bun's fullstack dev server with HTML imports:

```ts
import { file } from "bun";

const isDev = process.env.NODE_ENV !== "production";

Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") {
      return new Response(file("public/index.html"));
    }
    return new Response(file("public/index.html"));
  },
  // Wasmer.js headers for SharedArrayBuffer support
  headers: {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
  },
  development: isDev, // HMR enabled in dev
});
```

**Resources:**

- [Bun Fullstack Server](https://bun.com/docs/bundler/fullstack)
- [Development vs Production](https://bun.com/docs/bundler/fullstack#development-vs-production)

## Configuration Files

### Use TypeScript for configs where possible:

**tailwind.config.ts:**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  // ...config
} satisfies Config;

export default config;
```

**bun.config.ts:**

```typescript
import tailwindcss from "bun-plugin-tailwindcss";

export default {
  plugins: [
    tailwindcss({
      config: "./tailwind.config.ts",
    }),
  ],
};
```

**components.json (shadcn/ui):**

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
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "hooks": "@/hooks"
  }
}
```

## HTML Imports (Bun Feature)

HTML files can import .tsx, .jsx or .js files directly. Bun's bundler transpiles & bundles automatically.

**public/index.html:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Embed-OS</title>
    <link rel="stylesheet" href="./styles/globals.css" />
  </head>
  <body>
    <div id="root"></div>
    <!-- Bun's HTML imports automatically bundle this -->
    <script type="module" src="../src/main.tsx"></script>
  </body>
</html>
```

**src/main.tsx:**

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

## Running Commands

```bash
# Development with HMR
bun run dev

# Type checking
bun run type-check

# Linting and formatting
bun run check

# Production build
bun run build

# Production server (static files)
bun run start
```

## Testing

Use `bun test` for unit tests:

```typescript
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

For E2E tests, use Playwright:

```bash
bun add -d playwright
bunx playwright install
```

## Project Structure

```
src/
├── components/
│   ├── Desktop/          # Desktop environment
│   ├── Window/           # Window management
│   ├── Taskbar/          # Bottom taskbar
│   ├── Apps/             # Applications (Terminal, FileExplorer, Camera, etc.)
│   └── ui/               # shadcn/ui components
├── store/                # Zustand state stores
├── lib/                  # Core OS implementation
├── hooks/                # React hooks
├── types/                # TypeScript types
├── styles/               # Global styles
├── main.tsx              # App entry point
└── server.ts             # Dev server (not used in production)
```

## Key Features to Implement

### MVP (P0) - Core Desktop OS

1. **Window Management** - Draggable, resizable windows with react-rnd
2. **Desktop Icons** - Grid layout with drag-and-drop
3. **Terminal** - xterm.js integration with existing command system
4. **File Explorer** - Browse virtual file system
5. **Basic Text Editor** - Simple textarea-based editor with save
6. **Taskbar** - App launcher and window list

### P1 (Post-MVP) - Advanced Features

7. **Monaco Editor (VS Code)** - Full-featured code editor with syntax highlighting, IntelliSense
8. **Camera App** - Photo capture and video recording (MediaRecorder API)

These P1 features should be implemented after the MVP is stable and working.

## Important Implementation Notes

- **No server in production** - Build outputs static files only
- **Client-side storage** - Use localStorage (10MB) or IndexedDB (50MB+)
- **Browser APIs only** - navigator.mediaDevices, MediaRecorder, Canvas, etc.
- **Typed configs** - Use TypeScript for all configuration files
- **Wasmer.js headers** - Required for WASM/SharedArrayBuffer support
- **Progressive Web App** - Consider PWA for offline support (future)

## Resources

### Bun Documentation

- [Bun Fullstack Server](https://bun.com/docs/bundler/fullstack)
- [Development vs Production](https://bun.com/docs/bundler/fullstack#development-vs-production)

### Terminal & WASM

- [xterm.js](https://xtermjs.org/)
- [Wasmer.js Filesystem](https://docs.wasmer.io/sdk/wasmer-js/how-to/use-filesystem)
- [Wasmer.js + xterm.js Tutorial](https://docs.wasmer.io/sdk/wasmer-js/tutorials/xterm-js)

### UI & Styling

- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [react-rnd](https://github.com/bokuweb/react-rnd)

### Storage

- [localForage](https://github.com/localForage/localForage)
- [Dexie.js](https://dexie.org/)

### Inspiration

- [PostHog Website](https://posthog.com/) - Desktop UI reference

## Development Workflow

1. Start dev server: `bun run dev`
2. Make changes in `src/`
3. Bun automatically reloads with HMR
4. Type check: `bun run type-check`
5. Lint/format: `bun run check`
6. Build for production: `bun run build`
7. Deploy `dist/` to GitHub Pages or any static host

For more information, read:

- Implementation plan: `/docs/DESKTOP_UI_IMPLEMENTATION_PLAN.md`
- Initial plan: `/docs/INITIAL_IMPLEMENTATION_PLAN.md`
- Bun API docs: `node_modules/bun-types/docs/**.md`
