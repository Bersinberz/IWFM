import { useState } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { BsExclamationTriangle, BsDroplet, BsBattery } from "react-icons/bs";

interface Alert {
  id: number;
  type: string;
  severity: "low" | "medium" | "high";
  tanker: string;
  ts: string; // format: YYYY-MM-DD HH:mm
  description: string;
}

const alerts: Alert[] = [
  {
    id: 1,
    type: "Low Level",
    severity: "medium",
    tanker: "TK-007",
    ts: "2025-09-15 09:12",
    description: "Water level dropped below 40%. Immediate refill required.",
  },
  {
    id: 2,
    type: "PH Out of Range",
    severity: "high",
    tanker: "TK-021",
    ts: "2025-09-15 14:22",
    description: "pH sensor detected unsafe water quality levels.",
  },
  {
    id: 3,
    type: "Battery Low",
    severity: "low",
    tanker: "TK-001",
    ts: "2025-09-15 15:02",
    description: "Device battery below 20%. Please schedule maintenance.",
  },
  {
    id: 4,
    type: "GPS Signal Lost",
    severity: "high",
    tanker: "TK-055",
    ts: "2025-09-16 08:45",
    description: "Vehicle location not updating for last 30 minutes.",
  },
  {
    id: 5,
    type: "Over Speeding",
    severity: "medium",
    tanker: "TK-018",
    ts: "2025-09-16 10:22",
    description: "Tanker exceeded speed limit of 60 km/h on Mount Road, Chennai.",
  },
  {
    id: 6,
    type: "Engine Overheating",
    severity: "high",
    tanker: "TK-032",
    ts: "2025-09-16 12:10",
    description: "Engine temperature crossed 95°C. Immediate check needed.",
  },
  {
    id: 7,
    type: "Leakage Detected",
    severity: "high",
    tanker: "TK-045",
    ts: "2025-09-16 13:50",
    description: "Leakage sensor triggered near Anna Nagar, Chennai.",
  },
  {
    id: 8,
    type: "Unauthorized Stop",
    severity: "medium",
    tanker: "TK-029",
    ts: "2025-09-16 16:35",
    description: "Vehicle stopped for more than 25 minutes outside delivery zone.",
  },
  {
    id: 9,
    type: "Door Tampering",
    severity: "high",
    tanker: "TK-066",
    ts: "2025-09-16 20:15",
    description: "Cargo door opened unexpectedly during transit.",
  },
  {
    id: 10,
    type: "Communication Failure",
    severity: "low",
    tanker: "TK-014",
    ts: "2025-09-17 07:05",
    description: "Data not synced for last 10 minutes. Network issue suspected.",
  },
];

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // helper to pick icon
  const getIcon = (type: string) => {
    if (type.toLowerCase().includes("low")) return <BsDroplet className="text-primary me-2" />;
    if (type.toLowerCase().includes("battery")) return <BsBattery className="text-warning me-2" />;
    return <BsExclamationTriangle className="text-danger me-2" />;
  };

  // filter alerts
  const filteredAlerts = alerts.filter((a) => {
    // filter severity
    if (severityFilter !== "all" && a.severity !== severityFilter) return false;

    // filter dates
    const alertDate = new Date(a.ts.split(" ")[0]); // take date part only
    if (startDate && alertDate < new Date(startDate)) return false;
    if (endDate && alertDate > new Date(endDate)) return false;

    return true;
  });

  return (
    <div
      style={{
        marginLeft: "260px",
        minHeight: "100vh",
        backgroundColor: "#F9FAFB",
        padding: "2rem",
      }}
    >
      <Container fluid>
        <Card className="shadow-sm border-0" style={{ borderRadius: "1rem", overflow: "hidden" }}>
          <Card.Header
            className="bg-white border-0"
            style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E5E7EB" }}
          >
            <Row className="align-items-center">
              <Col>
                <h3 className="mb-0 fw-bold text-danger">⚠️ Alerts</h3>
              </Col>
              <Col md={6} className="text-end">
                <Row>
                  <Col>
                    <Form.Select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      size="sm"
                    >
                      <option value="all">All Severities</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="date"
                      size="sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-0">
            <ListGroup variant="flush">
              {filteredAlerts.length === 0 && (
                <ListGroup.Item className="text-center text-muted py-4">
                  No alerts found for the selected filters.
                </ListGroup.Item>
              )}
              {filteredAlerts.map((a) => (
                <ListGroup.Item
                  key={a.id}
                  className="d-flex flex-column"
                  style={{
                    padding: "1rem 1.25rem",
                    borderBottom: "1px solid #E5E7EB",
                  }}
                >
                  <Row className="align-items-center">
                    <Col md={8} className="d-flex align-items-center">
                      {getIcon(a.type)}
                      <div>
                        <h6 className="mb-1 fw-bold">{a.type}</h6>
                        <small className="text-muted">{a.description}</small>
                      </div>
                    </Col>
                    <Col md={2} className="d-flex align-items-center justify-content-center">
                      <Badge
                        bg={
                          a.severity === "high"
                            ? "danger"
                            : a.severity === "medium"
                            ? "warning"
                            : "secondary"
                        }
                        className="px-3 py-2"
                        style={{ fontSize: "0.85rem" }}
                      >
                        {a.severity.charAt(0).toUpperCase() + a.severity.slice(1)}
                      </Badge>
                    </Col>
                    <Col md={2} className="text-end text-muted" style={{ fontSize: "0.85rem" }}>
                      {a.ts}
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col>
                      <small className="text-primary fw-semibold">🚛 Tanker: {a.tanker}</small>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}