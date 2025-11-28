export type FileType = "file" | "directory";

export interface FileNode {
  name: string;
  path: string;
  type: FileType;
  size?: number;
  modifiedAt?: Date;
}
