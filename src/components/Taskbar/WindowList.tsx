import { Button } from "@/components/ui/button";
import { useWindowStore } from "@/store/windowStore";
import { cn } from "@/lib/utils";

export default function WindowList() {
  const { windows, activeWindowId, focusWindow, restoreWindow } =
    useWindowStore();

  const handleClick = (id: string, state: string) => {
    if (state === "minimized") {
      restoreWindow(id);
    }
    focusWindow(id);
  };

  return (
    <div className="flex-1 flex items-center gap-1 px-4 overflow-x-auto">
      {Array.from(windows.values()).map((window) => (
        <Button
          key={window.id}
          variant="ghost"
          size="sm"
          className={cn(
            "max-w-[180px] truncate text-slate-300 hover:text-white",
            activeWindowId === window.id && "bg-slate-700 text-white",
            window.state === "minimized" && "opacity-60",
          )}
          onClick={() => handleClick(window.id, window.state)}
        >
          {window.title}
        </Button>
      ))}
    </div>
  );
}
