import React from "react";

import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CookiesProvider, useCookies } from "react-cookie";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Edit from "./pages/EditBook";

function App() {
  const [cookies, setCookie] = useCookies(["jwt"]);

  function handleLogin(jwt) {
    setCookie("jwt", jwt, { path: "/" });
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/auth/login",
      element: <Login onLogin={handleLogin} />,
    },
    {
      path: "/books",
      element: <Books />
    },
    {
      path: "/books/:id",
      element: <Edit />
    }
    // TODO: add a route for the books page
  ]);

  return (
    <div className="App">
      <React.StrictMode>
        <CookiesProvider>
          <RouterProvider router={router} />
        </CookiesProvider>
      </React.StrictMode>
    </div>
  );
}

export default App;
