# 🚀 Embed-OS

> A browser-based operating system running entirely on client-side using WASM and JavaScript

[![CI](https://github.com/USERNAME/chicago-cursor-hackathon-nov-2025/actions/workflows/ci.yaml/badge.svg)](https://github.com/USERNAME/chicago-cursor-hackathon-nov-2025/actions/workflows/ci.yaml)
[![Deploy](https://github.com/USERNAME/chicago-cursor-hackathon-nov-2025/actions/workflows/deploy.yaml/badge.svg)](https://github.com/USERNAME/chicago-cursor-hackathon-nov-2025/actions/workflows/deploy.yaml)

Created for the **Chicago Cursor Hackathon - November 2025**

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
git clone https://github.com/USERNAME/chicago-cursor-hackathon-nov-2025.git
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
  index.ts          # Main OS implementation
public/
  index.html        # Browser UI
docs/
  INITIAL_IMPLEMENTATION_PLAN.md  # Implementation roadmap
```

## 🌟 Features

### Current

- Basic terminal with built-in commands (`help`, `ls`, `ps`, `echo`, `clear`)
- File system operations (read, write, list, delete)
- Process management (spawn, kill, list)
- Browser-based UI with gradient terminal

### Planned

See [docs/INITIAL_IMPLEMENTATION_PLAN.md](docs/INITIAL_IMPLEMENTATION_PLAN.md) for the full roadmap.

## 🛠️ Tech Stack

- **Runtime**: Bun
- **Language**: TypeScript
- **Linting/Formatting**: Biome
- **CI/CD**: GitHub Actions
- **Deployment**: GitHub Pages

## 📝 License

MIT

## 🤝 Contributing

This is a hackathon project, but contributions are welcome! Feel free to open issues or submit PRs.

---

Built with Bun, TypeScript & ❤️ for the Chicago Cursor Hackathon
