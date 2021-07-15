import axios from "axios";
import Cookies from "js-cookie";
import React, { createContext, useContext, useState } from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

interface AuthContext {
  sessionId: string | null;
  login: (
    username: string,
    password: string,
    callback: () => void
  ) => Promise<void>;
  logout: (callback: () => void) => Promise<void>;
}

const SESSION_ID_COOKIE = "sessionId";

const authContext = createContext<AuthContext>({
  sessionId: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

function useProvideAuth(): AuthContext {
  const [sessionId, setSessionId] = useState<string | null>(
    Cookies.get(SESSION_ID_COOKIE) ?? null
  );

  const login = async (
    username: string,
    password: string,
    callback: () => void
  ) => {
    try {
      const response = await axios.post("/api/login", {
        username,
        password,
      });
      const sessionId = response.data.sessionId;
      console.log(sessionId);
      Cookies.set(SESSION_ID_COOKIE, sessionId, { expires: 1 });
      setSessionId(response.data.sessionId);
      callback();
    } catch (e) {
      console.error(e);
    }
  };

  const logout = async (callback: () => void) => {
    try {
      await axios.post("/api/logout");
      Cookies.remove(SESSION_ID_COOKIE);
      setSessionId(null);
      callback();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    sessionId,
    login,
    logout,
  };
}

export function useAuth() {
  return useContext(authContext);
}

export function UnauthRequiredRoute({
  children,
  ...props
}: {
  children: JSX.Element;
} & RouteProps): JSX.Element {
  let auth = useAuth();
  return (
    <Route
      {...props}
      render={({ location }) =>
        auth.sessionId == null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export function AuthRequiredRoute({
  children,
  ...props
}: {
  children: JSX.Element;
} & RouteProps): JSX.Element {
  let auth = useAuth();
  return (
    <Route
      {...props}
      render={({ location }) =>
        auth.sessionId != null ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export default function AuthProvider(props: { children: JSX.Element }) {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>{props.children}</authContext.Provider>
  );
}
