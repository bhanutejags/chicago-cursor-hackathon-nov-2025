import { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";
import "xterm/css/xterm.css";
import { embedOS } from "@/lib/embedos";

interface XTerminalProps {
  windowId: string;
}

export default function XTerminal({ windowId }: XTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const currentLineRef = useRef("");

  useEffect(() => {
    if (!containerRef.current || terminalRef.current) return;

    const term = new Terminal({
      theme: {
        background: "#0f172a",
        foreground: "#e2e8f0",
        cursor: "#4ade80",
        cursorAccent: "#0f172a",
        selectionBackground: "rgba(148, 163, 184, 0.3)",
      },
      fontFamily: '"SF Mono", Monaco, "Cascadia Code", monospace',
      fontSize: 14,
      cursorBlink: true,
      cursorStyle: "block",
    });

    const fitAddon = new FitAddon();
    const webLinksAddon = new WebLinksAddon();

    term.loadAddon(fitAddon);
    term.loadAddon(webLinksAddon);

    term.open(containerRef.current);

    // Delay fit to ensure container has dimensions
    setTimeout(() => {
      fitAddon.fit();
    }, 0);

    terminalRef.current = term;
    fitAddonRef.current = fitAddon;

    // Welcome message
    term.writeln("\x1b[32mEmbed-OS Terminal v1.0\x1b[0m");
    term.writeln("Type 'help' for available commands\n");
    term.write("$ ");

    // Command handling
    const handleData = (data: string) => {
      if (data === "\r") {
        term.writeln("");
        const command = currentLineRef.current.trim();
        if (command) {
          handleCommand(command, term);
        } else {
          term.write("$ ");
        }
        currentLineRef.current = "";
      } else if (data === "\x7F") {
        // Backspace
        if (currentLineRef.current.length > 0) {
          currentLineRef.current = currentLineRef.current.slice(0, -1);
          term.write("\b \b");
        }
      } else if (data === "\x03") {
        // Ctrl+C
        term.writeln("^C");
        currentLineRef.current = "";
        term.write("$ ");
      } else if (data >= " " || data === "\t") {
        // Printable characters
        currentLineRef.current += data;
        term.write(data);
      }
    };

    term.onData(handleData);

    // Resize handling with safety check
    const resizeObserver = new ResizeObserver(() => {
      if (fitAddonRef.current && containerRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch {
          // Ignore errors during resize if terminal not ready
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
    };
  }, [windowId]);

  const handleCommand = async (command: string, term: Terminal) => {
    if (command === "clear") {
      term.clear();
      term.write("$ ");
      return;
    }

    try {
      const result = await embedOS.terminal.execute(command);
      if (result) {
        term.writeln(result);
      }
    } catch (error) {
      term.writeln(
        `\x1b[31mError: ${error instanceof Error ? error.message : String(error)}\x1b[0m`,
      );
    }
    term.write("$ ");
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-slate-900"
      style={{ padding: "8px" }}
    />
  );
}
