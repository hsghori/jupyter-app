import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Link from "@material-ui/core/Link";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import React, { useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import useAuthStyles from "./useAuthStyles";

export default function LoginPage(): JSX.Element {
  const auth = useAuth();
  const classes = useAuthStyles();
  const history = useHistory();
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();

  return (
    <div className={classes.root}>
      <Card>
        <CardContent>
          <Typography variant="h4">Log in</Typography>
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
              await auth.login(username!, password!, () => {
                history.push("/");
              });
            }}
          >
            Log in
          </Button>
        </CardActions>
      </Card>
      <Link component={RouterLink} to="/signup">
        Sign up
      </Link>
    </div>
  );
}
