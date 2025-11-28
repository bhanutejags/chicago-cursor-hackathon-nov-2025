import { useEffect, useState } from "react";
import { Folder, FileText, File, ArrowUp, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { embedOS } from "@/lib/embedos";
import { useWindowStore } from "@/store/windowStore";
import type { FileNode } from "@/types/file";

interface FileExplorerProps {
  initialPath?: string;
}

export default function FileExplorer({ initialPath = "/" }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [files, setFiles] = useState<FileNode[]>([]);
  const { openWindow } = useWindowStore();

  useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath]);

  const loadFiles = async (path: string) => {
    try {
      const rawFiles = await embedOS.fileSystem.list(path);
      const parsed: FileNode[] = rawFiles.map((filePath) => {
        const name = filePath.split("/").filter(Boolean).pop() || filePath;
        return {
          name,
          path: filePath,
          type: filePath.endsWith("/") ? "directory" : "file",
        };
      });
      setFiles(parsed);
    } catch {
      setFiles([]);
    }
  };

  const goUp = () => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath("/" + parts.join("/"));
  };

  const handleDoubleClick = (file: FileNode) => {
    if (file.type === "directory") {
      setCurrentPath(file.path);
    } else {
      openWindow({
        type: "text-editor",
        title: file.name,
        data: { path: file.path },
      });
    }
  };

  const getIcon = (file: FileNode) => {
    if (file.type === "directory")
      return <Folder className="h-8 w-8 text-yellow-400" />;
    if (file.name.endsWith(".txt"))
      return <FileText className="h-8 w-8 text-blue-400" />;
    return <File className="h-8 w-8 text-gray-400" />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-slate-700 bg-slate-800">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={goUp}
          disabled={currentPath === "/"}
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => loadFiles(currentPath)}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <span className="text-sm text-slate-400 truncate flex-1">
          {currentPath || "/"}
        </span>
      </div>

      {/* File Grid */}
      <div className="flex-1 p-4 overflow-auto">
        {files.length === 0 ? (
          <div className="text-center text-slate-500 py-8">No files found</div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4">
            {files.map((file) => (
              <button
                key={file.path}
                className="flex flex-col items-center gap-2 p-2 rounded hover:bg-slate-800 transition-colors"
                onDoubleClick={() => handleDoubleClick(file)}
              >
                {getIcon(file)}
                <span className="text-xs text-center line-clamp-2">
                  {file.name}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
