import { Rnd } from "react-rnd";
import { useWindowStore } from "@/store/windowStore";
import WindowHeader from "./WindowHeader";
import WindowContent from "./WindowContent";
import { cn } from "@/lib/utils";
import type { Window as WindowType } from "@/types/window";

interface WindowProps {
  window: WindowType;
}

export default function Window({ window }: WindowProps) {
  const { focusWindow, updateWindowPosition, updateWindowSize } =
    useWindowStore();

  const isMaximized = window.state === "maximized";

  const position = isMaximized ? { x: 0, y: 0 } : window.position;
  const size = isMaximized
    ? { width: globalThis.innerWidth, height: globalThis.innerHeight - 48 }
    : window.size;

  return (
    <Rnd
      position={position}
      size={size}
      minWidth={window.minimumSize.width}
      minHeight={window.minimumSize.height}
      bounds="parent"
      disableDragging={isMaximized}
      enableResizing={!isMaximized && window.resizable}
      onDragStop={(_, d) => updateWindowPosition(window.id, d.x, d.y)}
      onResizeStop={(_, __, ref, ___, pos) => {
        updateWindowSize(window.id, ref.offsetWidth, ref.offsetHeight);
        updateWindowPosition(window.id, pos.x, pos.y);
      }}
      onMouseDown={() => focusWindow(window.id)}
      style={{ zIndex: window.zIndex }}
      className="pointer-events-auto"
      dragHandleClassName="window-drag-handle"
    >
      <div
        className={cn(
          "flex flex-col h-full bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden animate-window-appear",
          isMaximized && "rounded-none",
        )}
      >
        <WindowHeader window={window} />
        <WindowContent window={window} />
      </div>
    </Rnd>
  );
}
