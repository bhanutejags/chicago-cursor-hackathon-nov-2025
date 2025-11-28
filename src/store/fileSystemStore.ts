import { create } from "zustand";
import { embedOS } from "@/lib/embedos";
import type { FileNode } from "@/types/file";

interface FileSystemStore {
  currentPath: string;
  files: FileNode[];
  desktopFiles: FileNode[];
  navigate: (path: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  refreshFiles: () => Promise<void>;
  refreshDesktop: () => Promise<void>;
}

const parseFilePath = (filePath: string): FileNode => {
  const name = filePath.split("/").filter(Boolean).pop() || filePath;
  const isDirectory = filePath.endsWith("/");
  return {
    name,
    path: filePath,
    type: isDirectory ? "directory" : "file",
  };
};

export const useFileSystemStore = create<FileSystemStore>((set, get) => ({
  currentPath: "/",
  files: [],
  desktopFiles: [],

  navigate: async (path) => {
    try {
      const rawFiles = await embedOS.fileSystem.list(path);
      const files = rawFiles.map(parseFilePath);
      set({ currentPath: path, files });
    } catch {
      set({ currentPath: path, files: [] });
    }
  },

  readFile: async (path) => {
    return await embedOS.fileSystem.read(path);
  },

  writeFile: async (path, content) => {
    await embedOS.fileSystem.write(path, content);
    await get().refreshFiles();
  },

  refreshFiles: async () => {
    const { currentPath, navigate } = get();
    await navigate(currentPath);
  },

  refreshDesktop: async () => {
    try {
      const rawDesktop = await embedOS.fileSystem.list("/desktop/");
      const desktopFiles = rawDesktop.map(parseFilePath);
      set({ desktopFiles });
    } catch {
      set({ desktopFiles: [] });
    }
  },
}));
