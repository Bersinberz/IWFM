// Updated Alerts component with email buttons and success message
import { useState, useEffect, type JSX } from "react";
import {
  Container,
  Card,
  ListGroup,
  Badge,
  Row,
  Col,
  Form,
  Spinner,
  Alert as BootstrapAlert,
  Button,
  Toast,
  ToastContainer
} from "react-bootstrap";
import { BsExclamationTriangle, BsDroplet, BsBattery, BsEnvelope, BsCheckCircle } from "react-icons/bs";
import { alertsService, type Alert } from "../services/alertsService";

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error';
}

export default function Alerts() {
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [sendingEmails, setSendingEmails] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Fetch alerts from API
  const fetchAlerts = async (): Promise<void> => {
    try {
      setLoading(true);
      setError("");
      
      const filters = {
        severity: severityFilter !== "all" ? severityFilter : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const data = await alertsService.getAlerts(filters);
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send email for a specific alert
  const sendEmailAlert = async (alert: Alert): Promise<void> => {
    try {
      setSendingEmails(prev => new Set(prev).add(alert.id));
      
      // Call your email service API
      await alertsService.sendAlertEmail(alert.id);
      
      // Show success message
      showToast('success', `Email sent successfully for ${alert.type} alert!`);
      console.log(`Email sent for alert: ${alert.type}`);
      
    } catch (err) {
      console.error('Error sending email:', err);
      // Show error message
      showToast('error', `Failed to send email for ${alert.type} alert.`);
    } finally {
      setSendingEmails(prev => {
        const newSet = new Set(prev);
        newSet.delete(alert.id);
        return newSet;
      });
    }
  };

  // Show toast message
  const showToast = (type: 'success' | 'error', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  // Remove toast message
  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Fetch alerts when component mounts or filters change
  useEffect(() => {
    fetchAlerts();
  }, [severityFilter, startDate, endDate]);

  // Helper to pick icon
  const getIcon = (type: string): JSX.Element => {
    if (type.toLowerCase().includes("low")) return <BsDroplet className="text-primary me-2" />;
    if (type.toLowerCase().includes("battery")) return <BsBattery className="text-warning me-2" />;
    return <BsExclamationTriangle className="text-danger me-2" />;
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
      {/* Toast Container for notifications */}
      <ToastContainer 
        position="top-end" 
        className="p-3"
        style={{ zIndex: 1050, marginTop: '70px' }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            show={true}
            delay={5000}
            autohide
            bg={toast.type === 'success' ? 'success' : 'danger'}
          >
            <Toast.Header>
              <BsCheckCircle className="text-success me-2" />
              <strong className="me-auto">
                {toast.type === 'success' ? 'Success' : 'Error'}
              </strong>
            </Toast.Header>
            <Toast.Body className={toast.type === 'success' ? 'text-white' : 'text-white'}>
              {toast.message}
            </Toast.Body>
          </Toast>
        ))}
      </ToastContainer>

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
            {loading && (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Loading alerts...</p>
              </div>
            )}

            {error && (
              <BootstrapAlert variant="danger" className="m-3">
                {error}
              </BootstrapAlert>
            )}

            {!loading && !error && (
              <ListGroup variant="flush">
                {alerts.length === 0 ? (
                  <ListGroup.Item className="text-center text-muted py-4">
                    No alerts found for the selected filters.
                  </ListGroup.Item>
                ) : (
                  alerts.map((alert) => (
                    <ListGroup.Item
                      key={alert.id}
                      className="d-flex flex-column"
                      style={{
                        padding: "1rem 1.25rem",
                        borderBottom: "1px solid #E5E7EB",
                      }}
                    >
                      <Row className="align-items-center">
                        <Col md={7} className="d-flex align-items-center">
                          {getIcon(alert.type)}
                          <div>
                            <h6 className="mb-1 fw-bold">{alert.type}</h6>
                            <small className="text-muted">{alert.description}</small>
                          </div>
                        </Col>
                        <Col md={2} className="d-flex align-items-center justify-content-center">
                          <Badge
                            bg={
                              alert.severity === "high"
                                ? "danger"
                                : alert.severity === "medium"
                                ? "warning"
                                : "secondary"
                            }
                            className="px-3 py-2"
                            style={{ fontSize: "0.85rem" }}
                          >
                            {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                          </Badge>
                        </Col>
                        <Col md={3} className="text-end">
                          <div className="d-flex align-items-center justify-content-end gap-2">
                            <small className="text-muted" style={{ fontSize: "0.85rem" }}>
                              {alert.ts}
                            </small>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => sendEmailAlert(alert)}
                              disabled={sendingEmails.has(alert.id)}
                              style={{ 
                                minWidth: "80px",
                                fontSize: "0.75rem"
                              }}
                            >
                              {sendingEmails.has(alert.id) ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <>
                                  <BsEnvelope className="me-1" />
                                  Email
                                </>
                              )}
                            </Button>
                          </div>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col>
                          <small className="text-primary fw-semibold">🚛 Tanker: {alert.tanker}</small>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}