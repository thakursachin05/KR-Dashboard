import React, { lazy, useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { themeChange } from "theme-change";
import checkAuth from "./app/auth";
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const token = checkAuth();

// const token = true;

function App() {
  useEffect(() => {
    // 👆 daisy UI themes initialization
    themeChange(false);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/newJoinee" element={<NewJoinee />} /> */}

          <Route path="/app/*" element={<Layout />} />
          <Route
            path="*"
            element={<Navigate to={token ? "/app/leads" : "/login"} replace />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
