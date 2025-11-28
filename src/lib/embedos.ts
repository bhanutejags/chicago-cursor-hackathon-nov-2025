// Moved from src/index.ts to be used as a library
// EmbedOS: Browser-based Operating System Core

interface Process {
  pid: string;
  name: string;
  status: "running" | "stopped";
  createdAt: Date;
}

interface FileSystem {
  read(path: string): Promise<string>;
  write(path: string, content: string): Promise<void>;
  list(path: string): Promise<string[]>;
  delete(path: string): Promise<void>;
}

interface ProcessManager {
  processes: Process[];
  nextPid: number;
  spawn(name: string, code: string): string;
  kill(pid: string): void;
  list(): Process[];
}

interface Terminal {
  execute(command: string): Promise<string>;
}

interface EmbedOS {
  fileSystem: FileSystem;
  processManager: ProcessManager;
  terminal: Terminal;
}

// FileSystem Implementation (using localStorage)
const fileSystem: FileSystem = {
  async read(path: string): Promise<string> {
    const content = localStorage.getItem(`fs:${path}`);
    if (content === null) {
      throw new Error(`File not found: ${path}`);
    }
    return content;
  },

  async write(path: string, content: string): Promise<void> {
    localStorage.setItem(`fs:${path}`, content);
  },

  async list(path: string): Promise<string[]> {
    const files: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(`fs:${path}`)) {
        files.push(key.replace("fs:", ""));
      }
    }
    return files;
  },

  async delete(path: string): Promise<void> {
    localStorage.removeItem(`fs:${path}`);
  },
};

// Process Manager Implementation
const processManager: ProcessManager = {
  processes: [] as Process[],
  nextPid: 1,

  spawn(name: string, _code: string): string {
    const pid = `${this.nextPid++}`;
    const process: Process = {
      pid,
      name,
      status: "running",
      createdAt: new Date(),
    };
    this.processes.push(process);
    return pid;
  },

  kill(pid: string): void {
    const index = this.processes.findIndex((p) => p.pid === pid);
    if (index !== -1) {
      this.processes.splice(index, 1);
    }
  },

  list(): Process[] {
    return this.processes;
  },
};

// Terminal Commands
const commands: Record<string, (args: string[]) => Promise<string>> = {
  help: async () => {
    return `Available commands:
  help          - Show this help message
  ls [path]     - List files in directory
  ps            - List running processes
  echo [text]   - Echo text back
  clear         - Clear terminal (client-side only)`;
  },

  ls: async (args) => {
    const path = args[0] || "/";
    const files = await fileSystem.list(path);
    return files.length > 0 ? files.join("\n") : "No files found";
  },

  ps: async () => {
    const processes = processManager.list();
    if (processes.length === 0) {
      return "No running processes";
    }
    return processes.map((p) => `${p.pid}\t${p.name}\t${p.status}`).join("\n");
  },

  echo: async (args) => {
    return args.join(" ");
  },

  clear: async () => {
    return ""; // Clear handled by client
  },
};

// Terminal Implementation
const terminal: Terminal = {
  async execute(input: string): Promise<string> {
    const parts = input.trim().split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    if (!command) {
      return "";
    }

    const cmd = commands[command];
    if (!cmd) {
      return `Command not found: ${command}. Type 'help' for available commands.`;
    }

    return await cmd(args);
  },
};

// Export the EmbedOS instance
export const embedOS: EmbedOS = {
  fileSystem,
  processManager,
  terminal,
};

// Initialize file system with default files
const initializeFileSystem = () => {
  const hasInit = localStorage.getItem("fs:__initialized");
  if (!hasInit) {
    fileSystem.write(
      "/desktop/README.txt",
      "Welcome to Embed-OS!\n\nThis is a browser-based operating system running entirely client-side.\n\nFeatures:\n- Draggable, resizable windows\n- Terminal with command support\n- File Explorer\n- Text Editor\n\nRight-click on the desktop for more options.",
    );
    fileSystem.write(
      "/desktop/notes.txt",
      "My Notes\n=========\n\nEdit this file to add your own notes.\n",
    );
    fileSystem.write(
      "/documents/example.txt",
      "This is an example document.\n\nYou can create, edit, and save files using the Text Editor.",
    );
    localStorage.setItem("fs:__initialized", "true");
  }
};

// Run initialization
initializeFileSystem();
