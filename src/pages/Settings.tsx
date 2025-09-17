import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";

export default function Settings() {
  return (
    <div
      style={{
        marginLeft: "260px",
        minHeight: "100vh",
        backgroundColor: "#F3F4F6",
        padding: "2rem",
      }}
    >
      <Container fluid>
        <h3 className="fw-bold text-primary mb-4">⚙️ Settings</h3>

        {/* Profile Settings */}
        <Card className="shadow-sm border-0 mb-4 rounded-3">
          <Card.Header className="bg-white fw-bold">👤 Profile Settings</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" defaultValue="Admin" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" defaultValue="admin@gmail.com" readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" defaultValue="+91 98765 43210" readOnly />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Notification Settings */}
        <Card className="shadow-sm border-0 mb-4 rounded-3">
          <Card.Header className="bg-white fw-bold">🔔 Notification Settings</Card.Header>
          <Card.Body>
            <Form.Group className="mb-3">
              <Form.Check type="switch" id="notif-email" label="Email Notifications" defaultChecked />
              <Form.Check type="switch" id="notif-sms" label="SMS Notifications" />
              <Form.Check type="switch" id="notif-push" label="Push Notifications" defaultChecked />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Notification Email</Form.Label>
              <Form.Control type="email" defaultValue="alerts@example.com" readOnly />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Alert Preferences */}
        <Card className="shadow-sm border-0 mb-4 rounded-3">
          <Card.Header className="bg-white fw-bold">🚨 Alert Preferences</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alert Threshold (Liters)</Form.Label>
                  <Form.Control type="number" defaultValue={1000} />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Critical Alert Escalation</Form.Label>
                  <Form.Select defaultValue="Immediate">
                    <option>Immediate</option>
                    <option>After 5 min</option>
                    <option>After 15 min</option>
                    <option>After 30 min</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* System Preferences */}
        <Card className="shadow-sm border-0 mb-4 rounded-3">
          <Card.Header className="bg-white fw-bold">🖥️ System Preferences</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Control type="text" defaultValue="English" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Timezone</Form.Label>
                  <Form.Control type="text" defaultValue="IST (GMT+5:30)" readOnly />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check type="switch" id="dark-mode" label="Enable Dark Mode" defaultChecked />
            </Form.Group>
          </Card.Body>
        </Card>

        {/* Security Settings */}
        <Card className="shadow-sm border-0 mb-4 rounded-3">
          <Card.Header className="bg-white fw-bold">🔐 Security Settings</Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" defaultValue="********" readOnly />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Two-Factor Authentication</Form.Label>
                  <Form.Check type="switch" id="2fa" label="Enabled" defaultChecked />
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Save Button */}
        <div className="text-end">
          <Button variant="primary" size="lg">
            💾 Save Settings
          </Button>
        </div>
      </Container>
    </div>
  );
}
