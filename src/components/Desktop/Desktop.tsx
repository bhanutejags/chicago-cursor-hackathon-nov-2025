import { useEffect } from "react";
import { useWindowStore } from "@/store/windowStore";
import { useFileSystemStore } from "@/store/fileSystemStore";
import Window from "../Window/Window";
import Taskbar from "../Taskbar/Taskbar";
import DesktopBackground from "./DesktopBackground";
import DesktopIcon from "./DesktopIcon";

export default function Desktop() {
  const { windows } = useWindowStore();
  const { desktopFiles, refreshDesktop } = useFileSystemStore();

  useEffect(() => {
    refreshDesktop();
  }, [refreshDesktop]);

  return (
    <div className="desktop relative w-screen h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background with context menu */}
      <DesktopBackground />

      {/* Desktop Icons */}
      <div className="absolute inset-0 p-4 pb-14">
        <div className="grid grid-cols-[repeat(auto-fill,80px)] gap-2">
          {desktopFiles.map((file) => (
            <DesktopIcon key={file.path} file={file} />
          ))}
        </div>
      </div>

      {/* Windows Layer */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from(windows.values())
          .filter((w) => w.state !== "minimized")
          .map((window) => (
            <Window key={window.id} window={window} />
          ))}
      </div>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
