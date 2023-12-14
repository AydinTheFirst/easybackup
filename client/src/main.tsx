import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/index.css";

import { App } from "./pages/App";
import { Theme } from "./components/Theme";
import { NotFound } from "./pages/NotFound";
import { Toast } from "./components/Toast";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Databases } from "./pages/dashboard/Databases";
import { Destinations } from "./pages/dashboard/Dests";

document.body.classList.add("bg-slate-200", "dark:bg-gray-900");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Theme />
    <Toast />
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/databases/*" element={<Databases />} />
        <Route path="/dashboard/destinations/*" element={<Destinations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </>
);
