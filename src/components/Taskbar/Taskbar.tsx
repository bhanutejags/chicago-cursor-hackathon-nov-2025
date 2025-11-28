import AppLauncher from "./AppLauncher";
import WindowList from "./WindowList";
import SystemTray from "./SystemTray";

export default function Taskbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-slate-900/95 backdrop-blur border-t border-slate-700 z-[9999]">
      <div className="flex items-center justify-between h-full px-2">
        <AppLauncher />
        <WindowList />
        <SystemTray />
      </div>
    </div>
  );
}
