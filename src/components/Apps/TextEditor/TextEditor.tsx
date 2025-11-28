import { useState, useEffect } from "react";
import { Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { embedOS } from "@/lib/embedos";

interface TextEditorProps {
  filePath?: string;
}

export default function TextEditor({ filePath }: TextEditorProps) {
  const [content, setContent] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (filePath) {
      loadFile();
    }
  }, [filePath]);

  const loadFile = async () => {
    if (!filePath) return;
    try {
      const data = await embedOS.fileSystem.read(filePath);
      setContent(data);
      setIsDirty(false);
      setStatus("Loaded");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("New file");
    }
  };

  const handleSave = async () => {
    if (!filePath) {
      setStatus("No file path");
      return;
    }
    try {
      await embedOS.fileSystem.write(filePath, content);
      setIsDirty(false);
      setStatus("Saved!");
      setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Save failed");
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b border-slate-700 bg-slate-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || !filePath}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
        <div className="flex-1 flex items-center gap-2 text-sm text-slate-400">
          <FileText className="h-4 w-4" />
          <span className="truncate">{filePath || "Untitled"}</span>
          {isDirty && <span className="text-yellow-400">*</span>}
        </div>
        {status && <span className="text-xs text-slate-500">{status}</span>}
      </div>

      {/* Editor */}
      <textarea
        className="flex-1 p-4 bg-transparent font-mono text-sm resize-none outline-none placeholder:text-slate-600"
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsDirty(true);
        }}
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
