import XTerminal from "../Apps/Terminal/XTerminal";
import FileExplorer from "../Apps/FileExplorer/FileExplorer";
import TextEditor from "../Apps/TextEditor/TextEditor";
import type { Window } from "@/types/window";

interface WindowContentProps {
  window: Window;
}

export default function WindowContent({ window }: WindowContentProps) {
  switch (window.type) {
    case "terminal":
      return <XTerminal windowId={window.id} />;
    case "file-explorer":
      return (
        <FileExplorer initialPath={(window.data?.path as string) || "/"} />
      );
    case "text-editor":
      return <TextEditor filePath={window.data?.path as string} />;
    default:
      return <div className="p-4 text-white">Unknown window type</div>;
  }
}
