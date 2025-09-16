import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { MapContainer, TileLayer, Circle } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ------------------- THEME COLORS -------------------
const colors = {
  primary: "#5A67D8",
  secondary: "#A3B3FF",
  background: "#F2F4F8",
  text: "#4A5568",
  red: "#F56565",
  green: "#48BB78",
  orange: "#FF9100",
  lightHover: "#E8EAF6",
};

// ------------------- KPI DATA -------------------
const kpis = [
  { title: "Active Trucks", value: "18", icon: "bi-truck" },
  { title: "Deliveries Today", value: "42", icon: "bi-check-circle" },
  { title: "Open Alerts", value: "6", icon: "bi-exclamation-triangle" },
  { title: "Quality Score", value: "92%", icon: "bi-graph-up-arrow" },
];

const miniKpis = [
  { title: "Total Deliveries This Month", value: "312", color: colors.primary, icon: "bi-graph-up" },
  { title: "Trucks in Maintenance", value: "3", color: colors.orange, icon: "bi-wrench" },
  { title: "Alerts Resolved Today", value: "8", color: colors.green, icon: "bi-check-circle-fill" },
];

// ------------------- Deliveries Chart -------------------
const deliveriesSeries = [
  { day: "Mon", deliveries: 12 },
  { day: "Tue", deliveries: 18 },
  { day: "Wed", deliveries: 20 },
  { day: "Thu", deliveries: 15 },
  { day: "Fri", deliveries: 25 },
  { day: "Sat", deliveries: 10 },
  { day: "Sun", deliveries: 8 },
];

// ------------------- Quality Pie Chart -------------------
const qualityData = [
  { name: "Good", value: 80, color: colors.green },
  { name: "Poor", value: 20, color: colors.red },
];

// ------------------- Demand Areas -------------------
interface DemandArea {
  id: number;
  name: string;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high";
}

const demandAreas: DemandArea[] = [
  { id: 1, name: "Adyar", lat: 13.0102, lng: 80.2356, severity: "high" },
  { id: 2, name: "T. Nagar", lat: 13.0416, lng: 80.2375, severity: "medium" },
  { id: 3, name: "Velachery", lat: 12.9958, lng: 80.2296, severity: "low" },
];

// Center map around Chennai
const chennaiCenter: LatLngExpression = [13.0827, 80.2707];

// ------------------- Custom Tooltip -------------------
interface TooltipPayloadItem {
  value: number;
  name?: string;
  dataKey: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-2 rounded shadow-sm">
        <p className="label text-muted m-0">{`${label}`}</p>
        <p className="intro fw-bold m-0" style={{ color: colors.primary }}>
          {`Deliveries: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

// ------------------- Dashboard Component -------------------
export default function Dashboard() {
  const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);
  const [hoveredMiniKpi, setHoveredMiniKpi] = useState<number | null>(null);

  return (
    <main
      style={{
        padding: "20px",
        overflowY: "auto",
        minHeight: "100vh",
        backgroundColor: colors.background,
        marginLeft: "260px", // This line fixes the overlap issue
      }}
    >
      {/* Main KPI Row */}
      <Row className="g-4 mb-4">
        {kpis.map((item, idx) => (
          <Col md={3} key={idx}>
            <Card
              className="text-center shadow-sm border-0 h-100 d-flex flex-column justify-content-center"
              style={{
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                transform: hoveredKpi === idx ? "translateY(-5px)" : "none",
                boxShadow: hoveredKpi === idx ? "0 8px 15px rgba(0,0,0,0.1)" : "0 2px 5px rgba(0,0,0,0.05)",
              }}
              onMouseOver={() => setHoveredKpi(idx)}
              onMouseOut={() => setHoveredKpi(null)}
            >
              <Card.Body>
                <i
                  className={`bi ${item.icon} mb-2`}
                  style={{ fontSize: "2rem", color: colors.primary }}
                ></i>
                <Card.Title className="text-muted fw-bold">{item.title}</Card.Title>
                <Card.Text className="fs-2 fw-bold" style={{ color: colors.primary }}>
                  {item.value}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Mini KPIs */}
      <Row className="g-4 mb-4">
        {miniKpis.map((item, idx) => (
          <Col xs={12} md={4} key={idx}>
            <Card
              className="text-center shadow-sm border-0"
              style={{
                transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                transform: hoveredMiniKpi === idx ? "translateY(-5px)" : "none",
                boxShadow: hoveredMiniKpi === idx ? "0 8px 15px rgba(0,0,0,0.1)" : "0 2px 5px rgba(0,0,0,0.05)",
              }}
              onMouseOver={() => setHoveredMiniKpi(idx)}
              onMouseOut={() => setHoveredMiniKpi(null)}
            >
              <Card.Body>
                <i
                  className={`bi ${item.icon} mb-2`}
                  style={{ fontSize: "1.5rem", color: item.color }}
                ></i>
                <Card.Title className="text-muted fw-bold">{item.title}</Card.Title>
                <Card.Text className="fs-3 fw-bold" style={{ color: item.color }}>
                  {item.value}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Map + Charts */}
      <Row className="g-4">
        {/* Map */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.text }}>High Demand Areas</Card.Title>
              <div style={{ height: "400px" }}>
                <MapContainer center={chennaiCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  />
                  {demandAreas.map((area) => (
                    <Circle
                      key={area.id}
                      center={[area.lat, area.lng]}
                      radius={area.severity === "high" ? 2000 : area.severity === "medium" ? 1200 : 600}
                      pathOptions={{
                        color: area.severity === "high" ? colors.red : area.severity === "medium" ? colors.orange : colors.green,
                        fillOpacity: 0.3,
                      }}
                    />
                  ))}
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Charts */}
        <Col md={6}>
          <Row className="g-4 h-100">
            {/* Deliveries Chart */}
            <Col xs={12}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title style={{ color: colors.text }}>Deliveries This Week</Card.Title>
                  <div style={{ height: "200px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={deliveriesSeries}>
                        <XAxis dataKey="day" stroke={colors.text} />
                        <YAxis stroke={colors.text} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area type="monotone" dataKey="deliveries" stroke={colors.primary} fill={colors.secondary} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Quality Pie Chart */}
            <Col xs={12}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title style={{ color: colors.text }}>Quality Score Distribution</Card.Title>
                  <div style={{ height: "200px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={qualityData} dataKey="value" nameKey="name" label outerRadius={70}>
                          {qualityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Recent Alerts */}
      <Row className="g-4 mt-4">
        <Col xs={12}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Card.Title style={{ color: colors.text }}>Recent Alerts</Card.Title>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                  Delivery delay in Adyar
                </li>
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill text-warning me-2"></i>
                  Vehicle maintenance due for Truck #12
                </li>
                <li className="mb-2">
                  <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>
                  Open ticket in T. Nagar warehouse
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  );
}