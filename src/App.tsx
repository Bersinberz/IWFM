import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Tankers from "./pages/Tankers";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

export default function App() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      <Sidebar setPage={setPage} />
      <div className="flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1 overflow-auto">
          {page === "dashboard" && <Dashboard />}
          {page === "users" && <Users />}
          {page === "tankers" && <Tankers />}
          {page === "alerts" && <Alerts />}
          {page === "settings" && <Settings />}
        </div>
      </div>
    </div>
  );
}
