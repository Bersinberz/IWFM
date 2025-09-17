import { useState } from "react";
import {
  Container,
  Table,
  Card,
  Badge,
  Row,
  Col,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

interface Delivery {
  date: string;
  time: string;
  quantity: number;
  destination: string;
}

interface Tanker {
  id: string;
  driver: string;
  vehicleType: string;
  vehicleNo: string;
  capacity: number;
  status: "online" | "offline";
  lastSeen: string;
  deliveries: Delivery[];
}

const tankers: Tanker[] = [
  {
    id: "TK-001",
    driver: "Ramesh",
    vehicleType: "10-Wheeler",
    vehicleNo: "TN-09-AB-1234",
    capacity: 10000,
    status: "online",
    lastSeen: "10m ago",
    deliveries: [
      { date: "2025-09-16", time: "08:15", quantity: 9000, destination: "Guindy" },
      { date: "2025-09-15", time: "10:30", quantity: 8000, destination: "T. Nagar" },
      { date: "2025-09-14", time: "15:45", quantity: 9500, destination: "Velachery" },
      { date: "2025-09-12", time: "09:10", quantity: 8700, destination: "Perungudi" },
    ],
  },
  {
    id: "TK-007",
    driver: "Suresh",
    vehicleType: "6-Wheeler",
    vehicleNo: "TN-22-CD-5678",
    capacity: 8000,
    status: "offline",
    lastSeen: "2h ago",
    deliveries: [
      { date: "2025-09-14", time: "16:20", quantity: 7500, destination: "Ambattur" },
      { date: "2025-09-13", time: "09:00", quantity: 7000, destination: "Anna Nagar" },
      { date: "2025-09-12", time: "11:30", quantity: 7200, destination: "Mylapore" },
    ],
  },
  {
    id: "TK-021",
    driver: "Fatima",
    vehicleType: "12-Wheeler",
    vehicleNo: "TN-01-EF-9101",
    capacity: 12000,
    status: "online",
    lastSeen: "2m ago",
    deliveries: [
      { date: "2025-09-16", time: "12:15", quantity: 11000, destination: "Adyar" },
      { date: "2025-09-15", time: "19:00", quantity: 11800, destination: "OMR" },
      { date: "2025-09-14", time: "18:40", quantity: 11500, destination: "Tambaram" },
      { date: "2025-09-12", time: "07:50", quantity: 11200, destination: "Saidapet" },
    ],
  },
  {
    id: "TK-033",
    driver: "Vijay",
    vehicleType: "8-Wheeler",
    vehicleNo: "TN-05-GH-3344",
    capacity: 9000,
    status: "online",
    lastSeen: "25m ago",
    deliveries: [
      { date: "2025-09-16", time: "14:25", quantity: 8500, destination: "Egmore" },
      { date: "2025-09-15", time: "11:10", quantity: 8700, destination: "Nungambakkam" },
      { date: "2025-09-13", time: "17:30", quantity: 8900, destination: "Kodambakkam" },
    ],
  },
  {
    id: "TK-044",
    driver: "Anjali",
    vehicleType: "Mini Tanker",
    vehicleNo: "TN-10-IJ-4455",
    capacity: 5000,
    status: "offline",
    lastSeen: "5h ago",
    deliveries: [
      { date: "2025-09-15", time: "13:20", quantity: 4800, destination: "Triplicane" },
      { date: "2025-09-14", time: "08:40", quantity: 4900, destination: "Royapettah" },
      { date: "2025-09-12", time: "15:00", quantity: 5000, destination: "Madhavaram" },
    ],
  },
  {
    id: "TK-055",
    driver: "Karthik",
    vehicleType: "14-Wheeler",
    vehicleNo: "TN-20-KL-5566",
    capacity: 15000,
    status: "online",
    lastSeen: "1h ago",
    deliveries: [
      { date: "2025-09-16", time: "07:15", quantity: 14500, destination: "Sholinganallur" },
      { date: "2025-09-15", time: "20:30", quantity: 14800, destination: "Thoraipakkam" },
      { date: "2025-09-14", time: "09:50", quantity: 14000, destination: "Chromepet" },
      { date: "2025-09-12", time: "18:15", quantity: 14900, destination: "Pallavaram" },
    ],
  },
];


export default function Tankers() {
  const [selectedTanker, setSelectedTanker] = useState<Tanker | null>(null);

  // Date filters
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Filter deliveries based on selected date range
  const filterDeliveries = (deliveries: Delivery[]) => {
    return deliveries.filter((d) => {
      const deliveryDate = new Date(d.date);
      if (startDate && deliveryDate < new Date(startDate)) return false;
      if (endDate && deliveryDate > new Date(endDate)) return false;
      return true;
    });
  };

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
                <h3 className="mb-0 fw-bold text-primary">🚛 Tankers</h3>
              </Col>
            </Row>
          </Card.Header>

          <Card.Body className="p-0">
            <Table hover responsive className="mb-0 align-middle">
              <thead style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "0.95rem" }}>
                <tr>
                  <th>ID</th>
                  <th>Driver Name</th>
                  <th>Vehicle Type</th>
                  <th>Capacity (L)</th>
                  <th>Status</th>
                  <th>Last Seen</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: "0.95rem" }}>
                <AnimatePresence>
                  {tankers.map((t, index) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedTanker(t);
                        setStartDate("");
                        setEndDate("");
                      }}
                    >
                      <td className="fw-semibold text-secondary">{t.id}</td>
                      <td className="fw-semibold">{t.driver}</td>
                      <td>{t.vehicleType}</td>
                      <td>{t.capacity.toLocaleString()}</td>
                      <td>
                        <Badge
                          bg={t.status === "online" ? "success" : "danger"}
                          className="px-3 py-2"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="text-muted">{t.lastSeen}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* Animated Modal */}
      <AnimatePresence>
        {selectedTanker && (
          <Modal
            show
            onHide={() => setSelectedTanker(null)}
            centered
            size="lg"
            scrollable
            backdrop={false}
            contentClassName="border-0 shadow-lg"
          >
            <motion.div
              initial={{ opacity: 0, y: 80, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 80, scale: 0.95 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  🚛 {selectedTanker.vehicleNo} – {selectedTanker.driver}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <p><strong>Vehicle Type:</strong> {selectedTanker.vehicleType}</p>
                <p><strong>Vehicle No:</strong> {selectedTanker.vehicleNo}</p>
                <p><strong>Total Capacity:</strong> {selectedTanker.capacity.toLocaleString()} L</p>
                <p><strong>Location:</strong> Chennai</p>

                {/* Date Filters */}
                <Row className="my-3">
                  <Col md={6}>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>

                {/* Summary */}
                {(() => {
                  const deliveries = filterDeliveries(selectedTanker.deliveries);
                  const totalDeliveries = deliveries.length;
                  const totalLiters = deliveries.reduce((sum, d) => sum + d.quantity, 0);

                  return (
                    <div className="p-3 mb-3 bg-light rounded">
                      <Row>
                        <Col>
                          <h6 className="mb-1 text-secondary">📦 Total Deliveries</h6>
                          <h5 className="fw-bold">{totalDeliveries}</h5>
                        </Col>
                        <Col>
                          <h6 className="mb-1 text-secondary">💧 Total Liters Delivered</h6>
                          <h5 className="fw-bold">{totalLiters.toLocaleString()} L</h5>
                        </Col>
                      </Row>
                    </div>
                  );
                })()}

                {/* Deliveries Table */}
                <h6 className="mt-3">📜 Delivery History</h6>
                <Table striped hover size="sm" className="mt-2">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Quantity (L)</th>
                      <th>Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterDeliveries(selectedTanker.deliveries).map((d, i) => (
                      <tr key={i}>
                        <td>{d.date}</td>
                        <td>{d.time}</td>
                        <td>{d.quantity.toLocaleString()}</td>
                        <td>{d.destination}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setSelectedTanker(null)}>
                  Close
                </Button>
              </Modal.Footer>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
