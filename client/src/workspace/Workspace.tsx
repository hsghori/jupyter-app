import { makeStyles } from "@material-ui/core/styles";
import React, { useState } from "react";
import { fileContext } from "./fileContext";
import FileViewer from "./FileViewer";
import Sidepanel from "./Sidepanel";
import { FileItem } from "./WorkspaceConstants";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    height: "90vh",
  },
}));

export default function Workspace(): JSX.Element {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  return (
    <div className={classes.root}>
      <fileContext.Provider
        value={{
          selectedFile,
          setSelectedFile: (newFile) => {
            console.log(newFile);
            setSelectedFile(newFile);
          },
        }}
      >
        <>
          <Sidepanel />
          <div style={{ width: 250 }}></div>
          <FileViewer />
        </>
      </fileContext.Provider>
    </div>
  );
}
