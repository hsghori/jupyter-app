import { createContext, useContext } from "react";
import { FileItem } from "./WorkspaceConstants";

interface FileContext {
  selectedFile: FileItem | null;
  setSelectedFile: (file: FileItem | null) => void;
}

export const fileContext = createContext<FileContext>({
  selectedFile: null,
  setSelectedFile: () => {
    console.log("default");
  },
});

export function useSelectedFileContext() {
  return useContext(fileContext);
}
