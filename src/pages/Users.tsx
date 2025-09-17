import { useState } from "react";
import {
  Container,
  Table,
  Card,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: "Aditi Sharma", role: "Admin", email: "aditi@iwfm.local" },
  { id: 2, name: "Rahul Menon", role: "Dispatcher", email: "rahul@iwfm.local" },
  { id: 3, name: "Priya Nair", role: "Quality", email: "priya@iwfm.local" },
  { id: 4, name: "Rajesh Kumar", role: "Admin", email: "rajesh@iwfm.local" },
  { id: 5, name: "Sneha Reddy", role: "Dispatcher", email: "sneha@iwfm.local" },
  { id: 6, name: "Kiran Singh", role: "Quality", email: "kiran@iwfm.local" },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container className="p-4">
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <h3 className="mb-0">Users</h3>
            </Col>
            <Col xs={12} md={6} className="mt-2 mt-md-0">
              <div className="d-flex justify-content-end">
                <InputGroup className="w-100 w-md-75">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped bordered={false} hover responsive className="mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.role}</td>
                    <td>{u.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center text-muted py-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}