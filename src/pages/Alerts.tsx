import { Container, ListGroup, Badge } from "react-bootstrap";

interface Alert {
  id: number;
  type: string;
  severity: "low" | "medium" | "high";
  tanker: string;
  ts: string;
}

const alerts: Alert[] = [
  { id: 1, type: "Low Level", severity: "medium", tanker: "TK-007", ts: "2025-09-15 09:12" },
  { id: 2, type: "PH Out of Range", severity: "high", tanker: "TK-021", ts: "2025-09-15 14:22" },
  { id: 3, type: "Battery Low", severity: "low", tanker: "TK-001", ts: "2025-09-15 15:02" },
];

export default function Alerts() {
  return (
    <Container className="p-4">
      <h3>Alerts</h3>
      <ListGroup>
        {alerts.map(a => (
          <ListGroup.Item key={a.id} className="d-flex justify-content-between align-items-center">
            <span>{a.type} (Tanker {a.tanker})</span>
            <Badge bg={
              a.severity === "high" ? "danger" :
              a.severity === "medium" ? "warning" : "secondary"
            }>
              {a.severity}
            </Badge>
            <span className="text-muted">{a.ts}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}
