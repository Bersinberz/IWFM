import React, { useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
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
  yellow: "#ECC94B",
};

// ------------------- KPI DATA -------------------
const kpis = [
  { title: "Active Tankers", value: "18", icon: "bi-truck" },
  { title: "Deliveries Today", value: "42", icon: "bi-check-circle" },
  { title: "Open Alerts", value: "6", icon: "bi-exclamation-triangle" },
  { title: "Water Quality Score", value: "92%", icon: "bi-graph-up-arrow" },
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

// ------------------- Truck Data -------------------
interface Truck {
  id: number;
  name: string;
  lat: number;
  lng: number;
  status: "active" | "maintenance" | "delayed";
  ph: number;
  inlet: number;
  outlet: number;
  capacity: number;
}

const trucks: Truck[] = [
  { id: 1, name: "Truck #101", lat: 13.05, lng: 80.25, status: "active", ph: 7.2, inlet: 800, outlet: 500, capacity: 1000 },
  { id: 2, name: "Truck #102", lat: 13.02, lng: 80.28, status: "maintenance", ph: 6.8, inlet: 600, outlet: 600, capacity: 1000 },
  { id: 3, name: "Truck #103", lat: 12.99, lng: 80.23, status: "delayed", ph: 7.5, inlet: 1000, outlet: 900, capacity: 1200 },
];

// ------------------- Areas Requiring Water -------------------
interface WaterDemandArea {
  id: number;
  name: string;
  lat: number;
  lng: number;
  demandLevel: "High" | "Medium" | "Low";
  requiredWater: number; // KL
  predictedWater?: number; // KL - ML prediction
  predictedTime?: string; // timestamp
}

// Example ML-predicted values with timestamps
const demandAreas: WaterDemandArea[] = [
  { id: 1, name: "T. Nagar", lat: 13.04, lng: 80.24, demandLevel: "High", requiredWater: 500, predictedWater: 520, predictedTime: "10:30 AM" },
  { id: 2, name: "Adyar", lat: 13.01, lng: 80.25, demandLevel: "Medium", requiredWater: 300, predictedWater: 330, predictedTime: "10:45 AM" },
  { id: 3, name: "Porur", lat: 13.03, lng: 80.18, demandLevel: "Low", requiredWater: 150, predictedWater: 160, predictedTime: "11:00 AM" },
];

// ------------------- Icons -------------------
const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/743/743922.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// ------------------- Map Center -------------------
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
export default function SuperAdminDashboard() {
  const [hoveredKpi, setHoveredKpi] = useState<number | null>(null);
  const [hoveredMiniKpi, setHoveredMiniKpi] = useState<number | null>(null);

  return (
    <main style={{ padding: "20px", overflowY: "auto", minHeight: "100vh", backgroundColor: colors.background, marginLeft: "260px" }}>
      {/* Main KPI Row */}
      <Row className="g-4 mb-4">
        {kpis.map((item, idx) => (
          <Col md={3} key={idx}>
            <Card
              className="text-center shadow-sm border-0 h-100 d-flex flex-column justify-content-center"
              style={{
                transition: "all 0.3s ease",
                transform: hoveredKpi === idx ? "translateY(-5px)" : "none",
                boxShadow: hoveredKpi === idx ? "0 8px 15px rgba(0,0,0,0.1)" : "0 2px 5px rgba(0,0,0,0.05)",
              }}
              onMouseOver={() => setHoveredKpi(idx)}
              onMouseOut={() => setHoveredKpi(null)}
            >
              <Card.Body>
                <i className={`bi ${item.icon} mb-2`} style={{ fontSize: "2rem", color: colors.primary }}></i>
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
                transition: "all 0.3s ease",
                transform: hoveredMiniKpi === idx ? "translateY(-5px)" : "none",
                boxShadow: hoveredMiniKpi === idx ? "0 8px 15px rgba(0,0,0,0.1)" : "0 2px 5px rgba(0,0,0,0.05)",
              }}
              onMouseOver={() => setHoveredMiniKpi(idx)}
              onMouseOut={() => setHoveredMiniKpi(null)}
            >
              <Card.Body>
                <i className={`bi ${item.icon} mb-2`} style={{ fontSize: "1.5rem", color: item.color }}></i>
                <Card.Title className="text-muted fw-bold">{item.title}</Card.Title>
                <Card.Text className="fs-3 fw-bold" style={{ color: item.color }}>
                  {item.value}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Water Truck Tracking Map + Charts */}
      <Row className="g-4 mt-4">
        {/* Truck Tracking Map */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.text }}>Truck Water Tracking</Card.Title>
              <div style={{ height: "500px" }}>
                <MapContainer center={chennaiCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  />
                  {trucks.map((truck) => (
                    <Marker key={truck.id} position={[truck.lat, truck.lng]} icon={truckIcon}>
                      <Popup>
                        <strong>{truck.name}</strong>
                        <br />
                        Status: {truck.status}
                        <br />
                        pH: {truck.ph}
                        <br />
                        Inlet: {truck.inlet} KL
                        <br />
                        Outlet: {truck.outlet} KL
                        <br />
                        Capacity: {truck.capacity} KL
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Charts */}
        <Col md={6}>
          <Row className="g-4 h-100">
            <Col xs={12}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title style={{ color: colors.text }}>Deliveries This Week</Card.Title>
                  <div style={{ height: "250px" }}>
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
            <Col xs={12}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body>
                  <Card.Title style={{ color: colors.text }}>Water Quality Distribution</Card.Title>
                  <div style={{ height: "250px" }}>
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

      {/* Water Demand Map + Area Details */}
      <Row className="g-4 mt-4">
        {/* Water Demand Map */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.text }}>Areas Requiring Water </Card.Title>
              <div style={{ height: "500px" }}>
                <MapContainer center={chennaiCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  />
                  {demandAreas.map((area) => {
                    const radius = (area.predictedWater ?? area.requiredWater) * 2; // scaled using predicted
                    const color =
                      area.demandLevel === "High" ? colors.red :
                      area.demandLevel === "Medium" ? colors.orange : colors.green;
                    return (
                      <Circle key={area.id} center={[area.lat, area.lng]} radius={radius} color={color} fillOpacity={0.4}>
                        <Popup>
                          <strong>{area.name}</strong>
                          <br />
                          Actual Demand: {area.requiredWater} KL
                          <br />
                          Predicted Demand: {area.predictedWater ?? area.requiredWater} KL
                          <br />
                          Predicted Time: {area.predictedTime ?? "-"}
                        </Popup>
                      </Circle>
                    );
                  })}
                </MapContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Area Details */}
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.text }}>Demand Area Details</Card.Title>
              <ul className="list-group list-group-flush">
                {demandAreas.map((area) => (
                  <li key={area.id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{area.name}</strong>
                      <br />
                      <span className="text-muted">Demand Level: {area.demandLevel}</span>
                      <br />
                      <span className="text-muted">Predicted: {area.predictedWater ?? area.requiredWater} KL</span>
                      <br />
                      <span className="text-muted">Time: {area.predictedTime ?? "-"}</span>
                    </div>
                    <span className={`badge rounded-pill ${
                      area.demandLevel === "High" ? "bg-danger" :
                      area.demandLevel === "Medium" ? "bg-warning text-dark" : "bg-success"
                    }`}>
                      {area.predictedWater ?? area.requiredWater} KL
                    </span>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </main>
  );
}