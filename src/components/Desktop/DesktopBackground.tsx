import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useWindowStore } from "@/store/windowStore";

export default function DesktopBackground() {
  const { openWindow } = useWindowStore();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="absolute inset-0" />
      <ContextMenuContent>
        <ContextMenuItem
          onClick={() => openWindow({ type: "terminal", title: "Terminal" })}
        >
          Open Terminal
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => openWindow({ type: "file-explorer", title: "Files" })}
        >
          Open File Explorer
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => openWindow({ type: "text-editor", title: "New File" })}
        >
          New Text File
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
