import { useEffect, useState } from "react";
import {
  Container,
  Table,
  Card,
  Badge,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllTankers,
  addTanker, // make sure this is defined in your tankerService
  type Tanker,
  type Delivery,
  deleteTanker,
} from "../services/tankerService";
import DotsLoader from "../components/Loader";

export default function Tankers() {
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedTanker, setSelectedTanker] = useState<Tanker | null>(null);

  // Delivery modal state
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [newDelivery, setNewDelivery] = useState<Delivery>({
    date: "",
    time: "",
    quantity: 0,
    destination: "",
  });

  // Add Tanker modal state
  const [showAddTankerModal, setShowAddTankerModal] = useState(false);
  const [addingTanker, setAddingTanker] = useState(false);
  const [newTanker, setNewTanker] = useState<Omit<Tanker, "_id" | "deliveries">>({
    driver: "",
    vehicleType: "",
    vehicleNo: "",
    capacity: 0,
    status: "offline",
    lastSeen: new Date().toISOString(),
    maintenance: false, // ✅ add this
  });


  useEffect(() => {
    fetchTankers();
  }, []);

  const fetchTankers = () => {
    setLoading(true);
    getAllTankers()
      .then((data) => {
        setTankers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching tankers:", err);
        setLoading(false);
      });
  };

  const handleDeleteTanker = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tanker?")) return;
    try {
      await deleteTanker(id);
      fetchTankers();
    } catch (err) {
      console.error("Error deleting tanker:", err);
    }
  };

  const handleAddTanker = async () => {
    setAddingTanker(true);
    try {
      await addTanker(newTanker);
      setShowAddTankerModal(false);
      setNewTanker({
        driver: "",
        vehicleType: "",
        vehicleNo: "",
        capacity: 0,
        status: "offline",
        lastSeen: new Date().toISOString(),
        maintenance: false,
      });
      fetchTankers();
    } catch (err) {
      console.error("Error adding tanker:", err);
    } finally {
      setAddingTanker(false);
    }
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
            className="bg-white border-0 d-flex justify-content-between align-items-center"
            style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E5E7EB" }}
          >
            <h3 className="mb-0 fw-bold text-primary">🚛 Tankers</h3>
            <Button variant="primary" onClick={() => setShowAddTankerModal(true)}>
              + Add Tanker
            </Button>
          </Card.Header>

          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <DotsLoader dotCount={3} size={10} color="#3b82f6" />
              </div>
            ) : (
              <Table hover responsive className="mb-0 align-middle">
                <thead style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "0.95rem" }}>
                  <tr>
                    <th>Vehicle Number</th>
                    <th>Driver Name</th>
                    <th>Vehicle Type</th>
                    <th>Capacity (L)</th>
                    <th>Status</th>
                    <th>Last Seen</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "0.95rem" }}>
                  <AnimatePresence>
                    {tankers.map((t) => (
                      <motion.tr
                        key={t._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelectedTanker(t)}
                      >
                        <td>{t.vehicleNo}</td>
                        <td>{t.driver}</td>
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
                        <td>{t.lastSeen}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTanker(t._id);
                            }}
                          >
                            Delete
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Add Tanker Modal */}
      <Modal show={showAddTankerModal} onHide={() => setShowAddTankerModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Tanker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Driver Name</Form.Label>
              <Form.Control
                type="text"
                value={newTanker.driver}
                onChange={(e) => setNewTanker({ ...newTanker, driver: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicle Type</Form.Label>
              <Form.Control
                type="text"
                value={newTanker.vehicleType}
                onChange={(e) => setNewTanker({ ...newTanker, vehicleType: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vehicle No</Form.Label>
              <Form.Control
                type="text"
                value={newTanker.vehicleNo}
                onChange={(e) => setNewTanker({ ...newTanker, vehicleNo: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Capacity (L)</Form.Label>
              <Form.Control
                type="number"
                value={newTanker.capacity}
                onChange={(e) => setNewTanker({ ...newTanker, capacity: Number(e.target.value) })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newTanker.status === "online" ? "active" : "inactive"}
                onChange={(e) =>
                  setNewTanker({
                    ...newTanker,
                    status: e.target.value === "active" ? "online" : "offline",
                  })
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddTankerModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddTanker} disabled={addingTanker}>
            {addingTanker ? "Adding..." : "Add Tanker"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delivery Modal */}
      <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newDelivery.date}
                onChange={(e) => setNewDelivery({ ...newDelivery, date: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                value={newDelivery.time}
                onChange={(e) => setNewDelivery({ ...newDelivery, time: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Quantity (L)</Form.Label>
              <Form.Control
                type="number"
                value={newDelivery.quantity}
                onChange={(e) => setNewDelivery({ ...newDelivery, quantity: Number(e.target.value) })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                value={newDelivery.destination}
                onChange={(e) => setNewDelivery({ ...newDelivery, destination: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeliveryModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Tanker Details Modal */}
      <AnimatePresence>
        {selectedTanker && (
          <Modal show onHide={() => setSelectedTanker(null)} centered size="lg" scrollable>
            <Modal.Header closeButton>
              <Modal.Title>
                🚛 {selectedTanker.vehicleNo} – {selectedTanker.driver}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p><strong>Vehicle Type:</strong> {selectedTanker.vehicleType}</p>
              <p><strong>Vehicle No:</strong> {selectedTanker.vehicleNo}</p>
              <p><strong>Total Capacity:</strong> {selectedTanker.capacity.toLocaleString()} L</p>
              <p><strong>Last Seen:</strong> {selectedTanker.lastSeen}</p>

              {selectedTanker.maintenance && (
                <Badge bg="warning" text="dark" className="mb-2">
                  🚧 Vehicle is under maintenance
                </Badge>
              )}

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
                  {selectedTanker.deliveries.map((d, i) => (
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
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}
