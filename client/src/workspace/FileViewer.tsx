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

export default function FileViewer(): JSX.Element {
  const { selectedFile } = useSelectedFileContext();
  const [jupyterUrl, setJupyterUrl] = useState<string | null>(null);
  const classes = useStyles();

  useEffect(() => {
    if (selectedFile == null) {
      return;
    }
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
