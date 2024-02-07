import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./styles/index.css";
import "./styles/bs.css";

import { App } from "./pages/App";
import { Theme } from "./components/Theme";
import { NotFound } from "./pages/NotFound";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Databases } from "./pages/dashboard/Databases";
import { Destinations } from "./pages/dashboard/Dests";
import { ToastComponent } from "./components/Toast";
import { Register } from "./pages/Register";
import { ViewDest } from "./pages/dashboard/ViewDest";
import { ViewDB } from "./pages/dashboard/ViewDB";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Theme />
    <ToastComponent />
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/databases" element={<Databases />} />
        <Route path="/dashboard/destinations" element={<Destinations />} />
        <Route path="/dashboard/destinations/:id" element={<ViewDest />} />
        <Route path="/dashboard/databases/:id" element={<ViewDB />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  </>,
);
