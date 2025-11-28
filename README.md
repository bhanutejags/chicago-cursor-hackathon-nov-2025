# 🚀 Embed-OS

> A browser-based operating system running entirely on client-side using WASM and JavaScript

[![CI](https://github.com/bhanutejags/chicago-cursor-hackathon-nov-2025/actions/workflows/ci.yaml/badge.svg)](https://github.com/bhanutejags/chicago-cursor-hackathon-nov-2025/actions/workflows/ci.yaml)
[![Deploy](https://github.com/bhanutejags/chicago-cursor-hackathon-nov-2025/actions/workflows/deploy.yaml/badge.svg)](https://github.com/bhanutejags/chicago-cursor-hackathon-nov-2025/actions/workflows/deploy.yaml)

Created for the **Chicago Cursor Hackathon - November 2025**

🔗 **[Live Demo](https://bhanutejags.github.io/chicago-cursor-hackathon-nov-2025/)**

## 🎯 Overview

Embed-OS is an experimental operating system that runs entirely in your browser. It provides:

- 💾 **File System**: Persistent storage using localStorage
- ⚙️ **Process Manager**: Spawn and manage browser-based processes
- 💻 **Terminal**: Interactive command-line interface
- 🔧 **WASM Ready**: Architecture designed for WebAssembly integration

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.1 or later
- [mise](https://mise.jdx.dev/) (optional, for version management)

### Installation

```bash
# Clone the repository
git clone https://github.com/bhanutejags/chicago-cursor-hackathon-nov-2025.git
cd chicago-cursor-hackathon-nov-2025

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun run dev

# Build for production
bun run build

# Format code
bun run format

# Lint code
bun run lint

# Type check
bun run type-check
```

## 🏗️ Architecture

```
src/
├── index.html           # Entry point HTML
├── main.tsx             # React entry point
├── App.tsx              # Root component
├── components/
│   └── Terminal/
│       └── Terminal.tsx # Terminal UI component
├── lib/
│   ├── embedos.ts       # Core OS implementation
│   └── utils.ts         # Utility functions
└── styles/
    └── globals.css      # Tailwind CSS styles

docs/
├── INITIAL_IMPLEMENTATION_PLAN.md
└── DESKTOP_UI_IMPLEMENTATION_PLAN.md
```

## 🌟 Features

### Current

- ✅ **React-based UI** with modern component architecture
- ✅ **Terminal** with built-in commands (`help`, `ls`, `ps`, `echo`, `clear`)
- ✅ **File System** operations (read, write, list, delete) using localStorage
- ✅ **Process Management** (spawn, kill, list)
- ✅ **Beautiful UI** with Tailwind CSS gradient backgrounds
- ✅ **TypeScript** support throughout
- ✅ **Hot Module Reloading** in development

### Next Steps

- 🔲 Desktop environment with draggable windows (react-rnd)
- 🔲 File explorer application
- 🔲 Text editor with syntax highlighting
- 🔲 Professional terminal (xterm.js)
- 🔲 Taskbar and system tray

See [docs/DESKTOP_UI_IMPLEMENTATION_PLAN.md](docs/DESKTOP_UI_IMPLEMENTATION_PLAN.md) for the full desktop UI roadmap.

## 🛠️ Tech Stack

- **Runtime**: Bun 1.3.1+ (native bundler, no webpack/vite needed!)
- **Framework**: React 19 + TypeScript 5
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **UI Components**: shadcn/ui utilities, lucide-react icons
- **State Management**: React hooks (Zustand planned for desktop)
- **Linting/Formatting**: Biome
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages (static files)

## 📝 License

Apache-2.0

---

Built with Bun, TypeScript & ❤️ for the Chicago Cursor Hackathon
