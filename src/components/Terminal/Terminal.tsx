import { useState, useRef, useEffect } from "react";
import { embedOS } from "../../lib/embedos";
import { cn } from "../../lib/utils";
import { Terminal as TerminalIcon } from "lucide-react";

interface TerminalLine {
  type: "prompt" | "output" | "error";
  content: string;
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "Embed-OS initialized! Type 'help' for commands.",
    },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new lines are added
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = async () => {
    const command = input.trim();
    if (!command) return;

    // Add command to history
    setLines((prev) => [...prev, { type: "prompt", content: `$ ${command}` }]);
    setInput("");

    // Handle clear command specially
    if (command === "clear") {
      setLines([]);
      return;
    }

    // Execute command
    try {
      const result = await embedOS.terminal.execute(command);
      if (result) {
        const outputLines = result.split("\n").map((line) => ({
          type: "output" as const,
          content: line,
        }));
        setLines((prev) => [...prev, ...outputLines]);
      }
    } catch (error) {
      setLines((prev) => [
        ...prev,
        {
          type: "error",
          content: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-600 via-purple-800 to-indigo-900">
      <div className="container max-w-4xl mx-auto p-8 flex flex-col h-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <TerminalIcon className="w-12 h-12" />
            Embed-OS
          </h1>
          <p className="text-xl text-white/90">
            A browser-based operating system running entirely client-side
          </p>
        </div>

        {/* Terminal Window */}
        <div className="flex-1 bg-black/30 backdrop-blur-md rounded-lg shadow-2xl border border-white/10 p-6 flex flex-col">
          {/* Terminal Output */}
          <div
            ref={terminalRef}
            className="flex-1 overflow-y-auto mb-4 font-mono text-sm space-y-1"
          >
            {lines.map((line, index) => (
              <div
                key={index}
                className={cn(
                  "whitespace-pre-wrap",
                  line.type === "prompt" && "text-green-400 font-semibold",
                  line.type === "output" && "text-white",
                  line.type === "error" && "text-red-400",
                )}
              >
                {line.content}
              </div>
            ))}
          </div>

          {/* Input Line */}
          <div className="flex items-center gap-2 border-t border-white/10 pt-4">
            <span className="text-green-400 font-mono font-semibold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-white/40"
              placeholder="Type 'help' to see available commands..."
              autoFocus
            />
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-3xl mb-2">💾</div>
            <div className="text-white font-medium">File System</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="text-white font-medium">Process Manager</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-3xl mb-2">💻</div>
            <div className="text-white font-medium">Terminal</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/10">
            <div className="text-3xl mb-2">🔧</div>
            <div className="text-white font-medium">WASM Ready</div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-white/70 text-sm">
          Chicago Cursor Hackathon - November 2025
          <br />
          Built with Bun, React, TypeScript & Tailwind CSS
        </div>
      </div>
    </div>
  );
}
