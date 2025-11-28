import { Folder, FileText, File } from "lucide-react";
import { useWindowStore } from "@/store/windowStore";
import type { FileNode } from "@/types/file";

interface DesktopIconProps {
  file: FileNode;
}

export default function DesktopIcon({ file }: DesktopIconProps) {
  const { openWindow } = useWindowStore();

  const getIcon = () => {
    if (file.type === "directory")
      return <Folder className="h-8 w-8 text-yellow-400" />;
    if (file.name.endsWith(".txt"))
      return <FileText className="h-8 w-8 text-blue-400" />;
    return <File className="h-8 w-8 text-gray-400" />;
  };

  const handleDoubleClick = () => {
    if (file.type === "directory") {
      openWindow({
        type: "file-explorer",
        title: file.name,
        data: { path: file.path },
      });
    } else {
      openWindow({
        type: "text-editor",
        title: file.name,
        data: { path: file.path },
      });
    }
  };

  return (
    <button
      className="flex flex-col items-center gap-1 p-2 rounded hover:bg-white/10 transition-colors"
      onDoubleClick={handleDoubleClick}
    >
      {getIcon()}
      <span className="text-xs text-white text-center line-clamp-2 max-w-[70px]">
        {file.name}
      </span>
    </button>
  );
}
