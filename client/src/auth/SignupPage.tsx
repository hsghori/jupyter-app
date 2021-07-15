import React, { useState } from "react";
import axios from "axios";
import { useHistory, Link as RouterLink } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import useAuthStyles from "./useAuthStyles";

export default function SignupPage(): JSX.Element {
  const classes = useAuthStyles();
  const history = useHistory();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h4">Sign up</Typography>
          <TextField
            label="Username"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <TextField
            label="Password"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            onClick={async () => {
              try {
                const response = await axios.post("/api/signup", {
                  username,
                  password,
                });
                if (response.status === 200) {
                  history.push("/login");
                }
              } catch (e) {
                console.error(e);
              }
            }}
          >
            Sign up
          </Button>
        </CardActions>
      </Card>
      <Link component={RouterLink} to="/login">
        Log in
      </Link>
    </div>
  );
}
