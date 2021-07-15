import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Iframe from "react-iframe";
import { useSelectedFileContext } from "./fileContext";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
});

function useEvent(handler: (event: MessageEvent) => void, passive = false) {
  useEffect(() => {
    window.addEventListener("message", handler, passive);

    return function cleanup() {
      window.removeEventListener("message", handler);
    };
  });
}

export default function FileViewer(): JSX.Element {
  const { selectedFile } = useSelectedFileContext();
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null);
  const classes = useStyles();

  useEvent((event: MessageEvent) => {
    if (event.origin === "http://localhost:8000") {
      if (event.data === "SAVED") {
        if (selectedFile == null) {
          console.log("saving null file somehow");
          return;
        }
        axios.post(`/api/file/${selectedFile.id}:save`).then(() => {
          console.log("saved file");
        });
      }
    }
  });

  useEffect(() => {
    if (selectedFile == null) {
      return;
    }
    setJupyterUrl(null);
    axios.get(`/api/file/${selectedFile.id}`).then((response) => {
      setJupyterUrl(response.data.notebookUrl);
    });
  }, [selectedFile]);

  return (
    <Paper className={classes.root} elevation={1}>
      {jupyterUrl != null ? (
        <Iframe url={jupyterUrl} width="100%" height="100%" />
      ) : (
        <CircularProgress />
      )}
    </Paper>
  );
}
