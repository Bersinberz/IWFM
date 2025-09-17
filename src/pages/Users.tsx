import { Container, Table, Card, Row, Col } from "react-bootstrap";

interface User {
  id: number;
  name: string;
  role: "Admin" | "Driver";
  email: string;
}

const users: User[] = [
  { id: 1, name: "Aditi Sharma", role: "Admin", email: "aditi@iwfm.local" },
  { id: 2, name: "Rahul Menon", role: "Driver", email: "rahul@iwfm.local" },
  { id: 3, name: "Rajesh Kumar", role: "Admin", email: "rajesh@iwfm.local" },
  { id: 4, name: "Sneha Reddy", role: "Driver", email: "sneha@iwfm.local" },
];

export default function Users() {
  return (
    <div
      style={{
        marginLeft: "260px", // space for sidebar
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        padding: "2rem",
      }}
    >
      <Container fluid>
        <Card
          className="shadow-sm border-0"
          style={{
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Card.Header
            className="bg-white border-0"
            style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0 fw-bold text-primary">👥 Users</h3>
              </Col>
            </Row>
          </Card.Header>

          {/* Table */}
          <Card.Body className="p-0">
            <Table
              hover
              responsive
              className="mb-0 align-middle"
              style={{ borderRadius: "0.75rem", overflow: "hidden" }}
            >
              <thead
                style={{
                  backgroundColor: "#F3F4F6",
                  color: "#374151",
                  fontSize: "0.95rem",
                }}
              >
                <tr>
                  <th style={{ width: "5%" }}>#</th>
                  <th style={{ width: "30%" }}>Name</th>
                  <th style={{ width: "20%" }}>Role</th>
                  <th style={{ width: "45%" }}>Email</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.95rem" }}>
                {users.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      transition: "all 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#F9FAFB")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td className="fw-semibold text-secondary">{u.id}</td>
                    <td className="fw-semibold">{u.name}</td>
                    <td>
                      <span
                        className={`badge px-3 py-2 ${
                          u.role === "Admin"
                            ? "bg-primary bg-opacity-75"
                            : "bg-success bg-opacity-75"
                        }`}
                        style={{ fontSize: "0.85rem" }}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="text-muted">{u.email}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
