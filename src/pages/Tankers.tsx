import { Container, Table, Badge } from "react-bootstrap";

interface Tanker {
  id: string;
  driver: string;
  capacity: number;
  status: "online" | "offline";
  lastSeen: string;
}

const tankers: Tanker[] = [
  { id: "TK-001", driver: "Ramesh", capacity: 10000, status: "online", lastSeen: "10m" },
  { id: "TK-007", driver: "Suresh", capacity: 8000, status: "offline", lastSeen: "2h" },
  { id: "TK-021", driver: "Fatima", capacity: 12000, status: "online", lastSeen: "2m" },
];

export default function Tankers() {
  return (
    <Container className="p-4">
      <h3>Tankers</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th><th>Driver</th><th>Capacity</th><th>Status</th><th>Last Seen</th>
          </tr>
        </thead>
        <tbody>
          {tankers.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.driver}</td>
              <td>{t.capacity}</td>
              <td>
                <Badge bg={t.status === "online" ? "success" : "danger"}>
                  {t.status}
                </Badge>
              </td>
              <td>{t.lastSeen}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
