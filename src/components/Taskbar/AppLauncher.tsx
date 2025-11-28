import { Terminal, Folder, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWindowStore } from "@/store/windowStore";

const apps = [
  { type: "terminal" as const, icon: Terminal, label: "Terminal" },
  { type: "file-explorer" as const, icon: Folder, label: "Files" },
  { type: "text-editor" as const, icon: FileText, label: "Editor" },
];

export default function AppLauncher() {
  const { openWindow } = useWindowStore();

  return (
    <div className="flex items-center gap-1">
      {apps.map((app) => (
        <Button
          key={app.type}
          variant="ghost"
          size="icon"
          className="h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800"
          onClick={() => openWindow({ type: app.type, title: app.label })}
          title={app.label}
        >
          <app.icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
}
