export enum FileSystemType {
  FILE = "file",
  FOLDER = "folder",
}

export interface FileItem {
  type: FileSystemType.FILE;
  id: number;
  name: string;
}

export interface FolderItem {
  type: FileSystemType.FOLDER;
  id: number;
  name: string;
  empty: boolean;
}

export type FileSystemItem = FileItem | FolderItem;
