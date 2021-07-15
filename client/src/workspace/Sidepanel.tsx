import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Collapse from "@material-ui/core/Collapse";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import DescriptionIcon from "@material-ui/icons/Description";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import FolderIcon from "@material-ui/icons/Folder";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import * as uuid from "uuid";
import { useAuth } from "../auth/AuthProvider";
import { useSelectedFileContext } from "./fileContext";
import {
  FileSystemItem,
  FileSystemType,
  FolderItem,
} from "./WorkspaceConstants";

const useStyles = makeStyles(() => ({
  paper: {
    width: 250,
  },
  collapse: {
    marginLeft: "8px",
    borderLeft: "solid",
  },
}));

function SidepanelItem(props: {
  item: FileSystemItem;
  onFirstItemCreated?: () => void;
}) {
  const { selectedFile, setSelectedFile } = useSelectedFileContext();
  const [empty, setEmpty] = useState<boolean>(
    props.item.type === FileSystemType.FOLDER ? props.item.empty : true
  );
  const [contentsKey, setContentsKey] = useState(uuid.v4());
  const [expanded, setExpanded] = useState(false);
  const [creatingNew, setCreatingNew] = useState(false);
  const [creatingType, setCreatingType] = useState<FileSystemType | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const classes = useStyles();

  useEffect(() => {
    if (
      !empty &&
      props.item.type === FileSystemType.FOLDER &&
      props.item.empty
    ) {
      props.onFirstItemCreated?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empty, props.item]);

  const selectAddOption = (e: React.MouseEvent, type: FileSystemType) => {
    e.stopPropagation();
    setExpanded(true);
    setCreatingNew(true);
    setCreatingType(type);
  };

  const getItemButtons = () =>
    props.item.type === FileSystemType.FOLDER ? (
      <>
        <ListItemIcon>
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setMenuAnchor(e.currentTarget);
            }}
          >
            <AddIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            keepMounted
            open={Boolean(menuAnchor)}
            onClose={() => {
              setMenuAnchor(null);
            }}
          >
            <MenuItem
              onClick={(e) => {
                setMenuAnchor(null);
                selectAddOption(e, FileSystemType.FILE);
              }}
            >
              File
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                setMenuAnchor(null);
                selectAddOption(e, FileSystemType.FOLDER);
              }}
            >
              Folder
            </MenuItem>
          </Menu>
        </ListItemIcon>
        {!empty && (expanded ? <ExpandLess /> : <ExpandMore />)}
      </>
    ) : null;

  return (
    <>
      <ListItem
        button={true}
        onClick={() => {
          if (
            props.item.type === FileSystemType.FILE &&
            props.item.id !== selectedFile?.id
          ) {
            setSelectedFile(props.item);
          } else if (!empty) {
            setExpanded(!expanded);
          }
        }}
      >
        <ListItemIcon>
          {props.item.type === FileSystemType.FOLDER ? (
            <FolderIcon />
          ) : (
            <DescriptionIcon />
          )}
        </ListItemIcon>
        <ListItemText>{props.item.name}</ListItemText>
        {props.item.type === FileSystemType.FOLDER &&
          !creatingNew &&
          getItemButtons()}
      </ListItem>
      <Collapse className={classes.collapse} in={expanded} unmountOnExit={true}>
        {creatingNew && (
          <CreateNew
            key={"create-new"}
            type={creatingType!}
            parentFolderId={props.item.id}
            onCreated={(newItem) => {
              setCreatingNew(false);
              setEmpty(false);
              setContentsKey(uuid.v4());
              if (newItem.type === FileSystemType.FILE) {
                setSelectedFile(newItem);
              }
            }}
            onCancel={() => {
              setCreatingNew(false);
            }}
          />
        )}
        <SidepanelList key={contentsKey} id={props.item.id} />
      </Collapse>
    </>
  );
}

function CreateNew(props: {
  type: FileSystemType;
  parentFolderId: number;
  onCreated: (newItem: FileSystemItem) => void;
  onCancel: () => void;
}): JSX.Element {
  const [newFolderName, setNewFolderName] = useState<string>();
  const url =
    props.type === FileSystemType.FOLDER ? "/api/folder" : "/api/file";
  return (
    <TextField
      label="Name"
      autoFocus={true}
      value={newFolderName}
      onChange={(e) => {
        setNewFolderName(e.target.value);
      }}
      InputProps={{
        endAdornment: (
          <>
            <IconButton onClick={props.onCancel}>
              <CloseIcon />
            </IconButton>
            <IconButton
              disabled={!newFolderName}
              onClick={async () => {
                try {
                  const response = await axios.post(url, {
                    parentFolderId: props.parentFolderId,
                    name: newFolderName,
                  });
                  if (response.status === 200) {
                    props.onCreated(response.data);
                  }
                } catch (e) {
                  console.error(e);
                }
              }}
            >
              <CheckIcon />
            </IconButton>
          </>
        ),
      }}
    />
  );
}

function SidepanelList(props: { id: number }) {
  const [contents, setContents] = useState<Array<FileSystemItem> | null>(null);
  useEffect(() => {
    axios.get(`/api/contents/${props.id}`).then((response) => {
      setContents(response.data.contents);
    });
  }, [props.id]);

  return (
    <List component="nav">
      {contents != null ? (
        contents.map((item, idx) => <SidepanelItem key={idx} item={item} />)
      ) : (
        <CircularProgress />
      )}
    </List>
  );
}

export default function Sidepanel(): JSX.Element {
  const classes = useStyles();
  const auth = useAuth();
  const history = useHistory();
  const [rootFolder, setRootFolder] = useState<FolderItem | null>(null);

  useEffect(() => {
    axios.get("/api/folder/1").then((response) => {
      setRootFolder(response.data);
    });
  }, []);

  return (
    <Drawer
      classes={{ paper: classes.paper }}
      anchor="left"
      variant="permanent"
    >
      <span>
        <Typography variant="h5">Nav</Typography>
        <Button
          onClick={() => {
            auth.logout(() => {
              history.push("/login");
            });
          }}
        >
          Log out
        </Button>
      </span>
      <List component="nav">
        {rootFolder ? (
          <SidepanelItem
            item={rootFolder}
            onFirstItemCreated={() => {
              setRootFolder({ ...rootFolder, empty: false });
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </List>
    </Drawer>
  );
}
