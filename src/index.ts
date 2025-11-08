/**
 * Embed-OS: A browser-based operating system running entirely on client-side
 * Chicago Cursor Hackathon - November 2025
 */

console.log("🚀 Embed-OS initializing...");

// Core OS interface
interface EmbedOS {
	version: string;
	init: () => Promise<void>;
	processManager: ProcessManager;
	fileSystem: FileSystem;
	terminal: Terminal;
}

// Process Manager
interface ProcessManager {
	processes: Map<string, Process>;
	spawn: (name: string, code: string) => Promise<string>;
	kill: (pid: string) => void;
	list: () => Process[];
}

// File System
interface FileSystem {
	read: (path: string) => Promise<string>;
	write: (path: string, content: string) => Promise<void>;
	list: (path: string) => Promise<string[]>;
	delete: (path: string) => Promise<void>;
}

// Terminal
interface Terminal {
	execute: (command: string) => Promise<string>;
	history: string[];
	addCommand: (name: string, handler: CommandHandler) => void;
}

type Process = {
	pid: string;
	name: string;
	status: "running" | "stopped" | "paused";
	startTime: number;
};

type CommandHandler = (args: string[]) => Promise<string>;

// Initial implementation
class EmbedOSImpl implements EmbedOS {
	version = "0.1.0";
	processManager: ProcessManager;
	fileSystem: FileSystem;
	terminal: Terminal;

	constructor() {
		this.processManager = this.createProcessManager();
		this.fileSystem = this.createFileSystem();
		this.terminal = this.createTerminal();
	}

	async init(): Promise<void> {
		console.log(`Embed-OS v${this.version} starting...`);
		console.log("✅ Process Manager initialized");
		console.log("✅ File System initialized");
		console.log("✅ Terminal initialized");
		console.log("🎉 Embed-OS ready!");
	}

	private createProcessManager(): ProcessManager {
		const processes = new Map<string, Process>();

		return {
			processes,
			spawn: async (name: string, _code: string): Promise<string> => {
				const pid = crypto.randomUUID();
				processes.set(pid, {
					pid,
					name,
					status: "running",
					startTime: Date.now(),
				});
				return pid;
			},
			kill: (pid: string) => {
				processes.delete(pid);
			},
			list: () => Array.from(processes.values()),
		};
	}

	private createFileSystem(): FileSystem {
		// Using localStorage for persistence
		const FS_PREFIX = "embedos_fs_";

		return {
			read: async (path: string): Promise<string> => {
				const content = localStorage.getItem(FS_PREFIX + path);
				if (content === null) {
					throw new Error(`File not found: ${path}`);
				}
				return content;
			},
			write: async (path: string, content: string): Promise<void> => {
				localStorage.setItem(FS_PREFIX + path, content);
			},
			list: async (path: string): Promise<string[]> => {
				const files: string[] = [];
				for (let i = 0; i < localStorage.length; i++) {
					const key = localStorage.key(i);
					if (key?.startsWith(FS_PREFIX + path)) {
						files.push(key.substring(FS_PREFIX.length));
					}
				}
				return files;
			},
			delete: async (path: string): Promise<void> => {
				localStorage.removeItem(FS_PREFIX + path);
			},
		};
	}

	private createTerminal(): Terminal {
		const history: string[] = [];
		const commands = new Map<string, CommandHandler>();

		// Built-in commands
		commands.set("help", async () => {
			return "Available commands:\n- help\n- ls\n- ps\n- clear\n- echo <text>";
		});

		commands.set("ls", async () => {
			const files = await this.fileSystem.list("/");
			return files.join("\n");
		});

		commands.set("ps", async () => {
			const processes = this.processManager.list();
			return processes
				.map((p) => `${p.pid} - ${p.name} (${p.status})`)
				.join("\n");
		});

		commands.set("clear", async () => {
			history.length = 0;
			return "";
		});

		commands.set("echo", async (args: string[]) => {
			return args.join(" ");
		});

		return {
			history,
			execute: async (command: string): Promise<string> => {
				history.push(command);
				const [cmd, ...args] = command.split(" ");
				if (!cmd) {
					return "";
				}
				const handler = commands.get(cmd);
				if (!handler) {
					return `Command not found: ${cmd}`;
				}
				return await handler(args);
			},
			addCommand: (name: string, handler: CommandHandler) => {
				commands.set(name, handler);
			},
		};
	}
}

// Initialize and expose to window
const embedOS = new EmbedOSImpl();

if (typeof window !== "undefined") {
	(window as unknown as { embedOS: EmbedOS }).embedOS = embedOS;
}

// Auto-initialize on load
if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", () => embedOS.init());
} else {
	embedOS.init();
}

export { embedOS, type EmbedOS };
