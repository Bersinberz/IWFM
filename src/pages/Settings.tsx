import { Container, Form, Button } from "react-bootstrap";

export default function Settings() {
  return (
    <Container className="p-4">
      <h3>Settings</h3>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Notification Email</Form.Label>
          <Form.Control type="email" placeholder="admin@example.com" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Alert Threshold</Form.Label>
          <Form.Control type="number" placeholder="Enter threshold value" />
        </Form.Group>
        <Button variant="primary">Save</Button>
      </Form>
    </Container>
  );
}
