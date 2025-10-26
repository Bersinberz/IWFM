import { useEffect, useState } from "react";
import { Container, Table, Card, Button, Modal, Form } from "react-bootstrap";
import { getAllUsers, createUser, deleteUser, type User } from "../services/userService";
import DotsLoader from "../components/Loader";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState<User>({ _id: "", name: "", role: "Admin", email: "" });
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    getAllUsers()
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setLoading(false);
      });
  };

  const handleAddUser = async () => {
    setAdding(true);
    try {
      await createUser(newUser);
      setShowModal(false);
      setNewUser({ _id: "", name: "", role: "Admin", email: "" });
      fetchUsers();
    } catch (err) {
      console.error("Error adding user:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    setDeletingId(id);
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div style={{ marginLeft: "260px", minHeight: "100vh", backgroundColor: "#F9FAFB", padding: "2rem" }}>
      <Container fluid>
        <Card className="shadow-sm border-0" style={{ borderRadius: "1rem" }}>
          <Card.Header
            className="bg-white border-0 d-flex justify-content-between align-items-center"
            style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid #E5E7EB" }}
          >
            <h3 className="mb-0 fw-bold text-primary">👥 Users</h3>
            <Button onClick={() => setShowModal(true)} variant="primary">
              + Add User
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
                    <th>#</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: "0.95rem" }}>
                  {users.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>
                        <span
                          className={`badge px-3 py-2 ${
                            u.role === "Admin" ? "bg-primary bg-opacity-75" : "bg-success bg-opacity-75"
                          }`}
                          style={{ fontSize: "0.85rem" }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="text-muted">{u.email}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={deletingId === u._id}
                        >
                          {deletingId === u._id ? <DotsLoader dotCount={3} size={6} color="#fff" /> : "Delete"}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Container>

      {/* Add User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "Admin" | "Driver" })}
              >
                <option value="Admin">Admin</option>
                <option value="Driver">Driver</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddUser} disabled={adding}>
            {adding ? <DotsLoader dotCount={3} size={6} color="#fff" /> : "Add User"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
