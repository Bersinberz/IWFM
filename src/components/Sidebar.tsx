import { Nav, Button } from "react-bootstrap";
import { useState } from "react";

interface SidebarProps {
  setPage: (page: string) => void;
}

export default function Sidebar({ setPage }: SidebarProps) {
  const [active, setActive] = useState("dashboard");

  const handleClick = (page: string) => {
    setActive(page);
    setPage(page);
  };

  const getIcon = (page: string) => {
    const icons: { [key: string]: string } = {
      dashboard: "bi-speedometer2",
      users: "bi-people",
      tankers: "bi-truck",
      alerts: "bi-exclamation-triangle",
      settings: "bi-gear",
    };
    return icons[page] || "bi-dot";
  };

  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const linkStyle = {
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    padding: "0.75rem 1.25rem",
    borderRadius: "9999px",
  };

  const colors = {
    primary: "#5A67D8",
    secondary: "#A3B3FF",
    background: "#F2F4F8",
    text: "#4A5568",
    hover: "#E8EAF6",
    logout: "#F56565",
    logoutHover: "#E53E3E",
  };

  return (
    <div
      className="d-flex flex-column shadow-sm"
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: colors.background,
        boxShadow: "2px 0 15px rgba(0, 0, 0, 0.05)",
        overflowX: "hidden",
        position: "fixed", // This makes the sidebar static
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
    >
      {/* Brand Header */}
      <div
        className="p-4 border-bottom text-center"
        style={{
          paddingTop: "2.5rem",
          paddingBottom: "1.5rem",
          backgroundImage: `linear-gradient(to bottom, #ffffff, ${colors.background})`,
        }}
      >
        <h4
          className="fw-bold m-0"
          style={{ fontSize: "1.5rem", letterSpacing: "-0.5px", color: colors.primary }}
        >
          IWFM Admin
        </h4>
        <small className="text-muted" style={{ fontSize: "0.8rem" }}>
          Superadmin Panel
        </small>
      </div>

      {/* Navigation */}
      <Nav className="flex-column p-3" variant="pills">
        {["dashboard", "users", "tankers", "alerts", "settings"].map((page) => (
          <Nav.Link
            key={page}
            active={active === page}
            onClick={() => handleClick(page)}
            className="d-flex align-items-center mb-2 rounded-pill"
            style={{
              ...linkStyle,
              color: active === page ? "#ffffff" : colors.text,
              backgroundColor: active === page ? colors.primary : "transparent",
              fontWeight: active === page ? "600" : "500",
              boxShadow: active === page ? `0 4px 10px ${colors.secondary}` : "none",
            }}
            onMouseOver={(e) => {
              if (active !== page) {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                e.currentTarget.style.backgroundColor = colors.hover;
                e.currentTarget.style.color = colors.primary;
              }
            }}
            onMouseOut={(e) => {
              if (active !== page) {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = colors.text;
              }
            }}
          >
            <i className={`bi ${getIcon(page)} me-2`}></i> {capitalize(page)}
          </Nav.Link>
        ))}
      </Nav>

      {/* Spacer */}
      <div className="flex-grow-1" />

      {/* Footer / User Actions */}
      <div className="p-3 border-top">
        {/* Logout Button */}
        <Button
          className="w-100 d-flex align-items-center justify-content-center"
          style={{
            fontWeight: "600",
            backgroundColor: colors.logout,
            borderColor: colors.logout,
            transition: "all 0.2s ease-in-out",
          }}
          onClick={() => console.log("Logging out...")} // Add logout logic here
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.backgroundColor = colors.logoutHover;
            e.currentTarget.style.borderColor = colors.logoutHover;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = colors.logout;
            e.currentTarget.style.borderColor = colors.logout;
          }}
        >
          <i className="bi bi-box-arrow-right me-2"></i> Logout
        </Button>
      </div>
    </div>
  );
}