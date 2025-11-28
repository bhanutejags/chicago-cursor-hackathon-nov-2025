import { X, Minus, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowStore } from "@/store/windowStore";
import type { Window } from "@/types/window";

interface WindowHeaderProps {
  window: Window;
}

export default function WindowHeader({ window }: WindowHeaderProps) {
  const { closeWindow, minimizeWindow, maximizeWindow, restoreWindow } =
    useWindowStore();

  const isMaximized = window.state === "maximized";

  return (
    <div className="window-drag-handle flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700 select-none">
      <span className="text-sm font-medium text-white truncate">
        {window.title}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700"
          onClick={() => minimizeWindow(window.id)}
        >
          <Minus className="h-3 w-3" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700"
          onClick={() =>
            isMaximized ? restoreWindow(window.id) : maximizeWindow(window.id)
          }
        >
          {isMaximized ? (
            <Minimize2 className="h-3 w-3" />
          ) : (
            <Maximize2 className="h-3 w-3" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-slate-400 hover:text-white hover:bg-red-600"
          onClick={() => closeWindow(window.id)}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
