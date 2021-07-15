import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import LoginPage from "./auth/LoginPage";
import SignupPage from "./auth/SignupPage";
import AuthProvider, {
  AuthRequiredRoute,
  UnauthRequiredRoute,
} from "./auth/AuthProvider";
import Workspace from "./workspace/Workspace";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <UnauthRequiredRoute path="/login">
            <LoginPage />
          </UnauthRequiredRoute>
          <UnauthRequiredRoute path="/signup">
            <SignupPage />
          </UnauthRequiredRoute>
          <AuthRequiredRoute path="/">
            <Workspace />
          </AuthRequiredRoute>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
