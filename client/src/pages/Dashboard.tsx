import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
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
  LineChart,
  Line,
  Legend
} from "recharts";
import type { Tanker } from "../services/tankerService";
import { getAllTankers } from "../services/tankerService";
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen';
import CircleLoader from "../components/Loader";

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

const truckIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const chennaiCenter: [number, number] = [13.0827, 80.2707];

interface DemandArea {
  id: string;
  name: string;
  lat: number;
  lng: number;
  predictedWater: number;
  requiredWater: number;
  demandLevel: "High" | "Medium" | "Low";
  predictedTime?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
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

export default function SuperAdminDashboard() {
  const [tankers, setTankers] = useState<Tanker[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTankers, setActiveTankers] = useState(0);
  const [deliveriesToday, setDeliveriesToday] = useState(0);
  const [deliveriesThisMonth, setDeliveriesThisMonth] = useState(0);
  const [trucksInMaintenance, setTrucksInMaintenance] = useState(0);

  const [demandAreas, setDemandAreas] = useState<DemandArea[]>([]);
  const [predictedWeek, setPredictedWeek] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // ----------------------
      // Fetch tankers data
      // ----------------------
      const data = await getAllTankers();
      setTankers(data);

      const today = new Date().toISOString().split("T")[0];
      const currentMonth = new Date().getMonth();

      let active = 0;
      let todayDeliveries = 0;
      let monthDeliveries = 0;
      let maintenanceCount = 0;

      data.forEach((t) => {
        if (t.status === "online") active++;
        if (t.maintenance) maintenanceCount++;
        t.deliveries.forEach((d) => {
          if (d.date === today) todayDeliveries++;
          if (new Date(d.date).getMonth() === currentMonth) monthDeliveries++;
        });
      });

      setActiveTankers(active);
      setDeliveriesToday(todayDeliveries);
      setDeliveriesThisMonth(monthDeliveries);
      setTrucksInMaintenance(maintenanceCount);

      // ----------------------
      // Fetch 7-day predictions
      // ----------------------
      const response = await fetch("http://localhost:5000/api/predictions");
      const predictionData = await response.json();

      const areas: DemandArea[] = [];

      predictionData.forEach((day: any) => {
        day.areas.forEach((a: any, index: number) => {
          const predictedNum = Number(a.predicted) || 0;
          const demandLvl = a.demandLevel ?? getDemandLevel(predictedNum);

          areas.push({
            id: `${day.date}-${index}`,
            name: a.area,
            predictedWater: predictedNum,
            requiredWater: predictedNum * 0.95,
            demandLevel: demandLvl,
            lat: 13 + Math.random() * 0.1,
            lng: 80.2 + Math.random() * 0.1,
            predictedTime: a.time,
          });
        });
      });

      setDemandAreas(areas);

      // ----------------------
      // Transform prediction data for multi-line chart
      // ----------------------
      const days = [...new Set(predictionData.map((d: any) => d.date))];
      const weekChartData: any[] = [];


      days.forEach((date) => {
        const dayEntry: any = { day: new Date(date as string).toLocaleDateString("en-US", { weekday: "short" }) };
        const dayData = predictionData.find((d: any) => d.date === date);
        if (dayData) {
          dayData.areas.forEach((a: any) => {
            dayEntry[a.area] = Number(a.predicted) || 0;
          });
        }
        weekChartData.push(dayEntry);
      });

      setPredictedWeek(weekChartData);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  function getDemandLevel(predictedWater: number) {
    if (predictedWater >= 800) return "High";
    if (predictedWater >= 400) return "Medium";
    return "Low";
  }

  const trucksOnMap = tankers
    .filter((t: any) => t.location)
    .map((t: any) => ({
      id: t._id,
      name: t.driver,
      lat: t.location.latitude,
      lng: t.location.longitude,
      status: t.maintenance ? "maintenance" : t.status === "online" ? "active" : "delayed",
      capacity: t.capacity,
      deliveriesToday: t.deliveries.filter((d: { date: string; }) => d.date === new Date().toISOString().split("T")[0]).length,
    }));

  const deliveriesSeries = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const deliveriesCount = tankers.reduce(
      (acc, t) =>
        acc + t.deliveries.filter(d => d.date === date.toISOString().split("T")[0]).length,
      0
    );
    return { day: dayName, deliveries: deliveriesCount };
  }).reverse();

  const qualityData = [
    { name: "Good", value: tankers.filter(t => !t.maintenance).length, color: colors.green },
    { name: "Poor", value: tankers.filter(t => t.maintenance).length, color: colors.red },
  ];

  return (
    <main style={{ padding: "20px", minHeight: "100vh", backgroundColor: colors.background, marginLeft: "260px" }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
          <CircleLoader />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-truck mb-2" style={{ fontSize: "2rem", color: colors.primary }} />
                  <Card.Title className="text-muted fw-bold">Active Tankers</Card.Title>
                  <Card.Text className="fs-2 fw-bold" style={{ color: colors.primary }}>{activeTankers}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-check-circle mb-2" style={{ fontSize: "2rem", color: colors.primary }} />
                  <Card.Title className="text-muted fw-bold">Deliveries Today</Card.Title>
                  <Card.Text className="fs-2 fw-bold" style={{ color: colors.primary }}>{deliveriesToday}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-exclamation-triangle mb-2" style={{ fontSize: "2rem", color: colors.red }} />
                  <Card.Title className="text-muted fw-bold">Open Alerts</Card.Title>
                  <Card.Text className="fs-2 fw-bold" style={{ color: colors.red }}>6</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-graph-up-arrow mb-2" style={{ fontSize: "2rem", color: colors.green }} />
                  <Card.Title className="text-muted fw-bold">Water Quality Score</Card.Title>
                  <Card.Text className="fs-2 fw-bold" style={{ color: colors.green }}>92%</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Mini KPIs */}
          <Row className="g-4 mb-4">
            <Col xs={12} md={4}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-graph-up mb-2" style={{ fontSize: "1.5rem", color: colors.primary }} />
                  <Card.Title className="text-muted fw-bold">Total Deliveries This Month</Card.Title>
                  <Card.Text className="fs-3 fw-bold" style={{ color: colors.primary }}>{deliveriesThisMonth}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-wrench mb-2" style={{ fontSize: "1.5rem", color: colors.orange }} />
                  <Card.Title className="text-muted fw-bold">Trucks in Maintenance</Card.Title>
                  <Card.Text className="fs-3 fw-bold" style={{ color: colors.orange }}>{trucksInMaintenance}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={4}>
              <Card className="text-center shadow-sm border-0">
                <Card.Body>
                  <i className="bi bi-check-circle-fill mb-2" style={{ fontSize: "1.5rem", color: colors.green }} />
                  <Card.Title className="text-muted fw-bold">Alerts Resolved Today</Card.Title>
                  <Card.Text className="fs-3 fw-bold" style={{ color: colors.green }}>8</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Truck Map */}
          <Row className="g-4 mb-4">
            <Col xs={12} md={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title style={{ color: colors.text }}>Truck Map</Card.Title>
                  <div style={{ width: "100%", height: "60vh", minHeight: "400px" }}>
                    <MapContainer center={chennaiCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                      />
                      {trucksOnMap.map(truck => (
                        <Marker
                          key={truck.id}
                          position={[truck.lat, truck.lng]}
                          icon={truckIcon}
                        >
                          <Popup>
                            <strong>{truck.name}</strong><br />
                            Status: {truck.status}<br />
                            Capacity: {truck.capacity} L<br />
                            Deliveries Today: {truck.deliveriesToday}
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row className="g-4">
            <Col md={6}><Card className="shadow-sm border-0"><Card.Body>
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
            </Card.Body></Card></Col>

            <Col md={6}><Card className="shadow-sm border-0"><Card.Body>
              <Card.Title style={{ color: colors.text }}>Water Quality Distribution</Card.Title>
              <div style={{ height: "250px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={qualityData} dataKey="value" nameKey="name" label outerRadius={70}>
                      {qualityData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body></Card></Col>
          </Row>

          {/* Water Demand Map */}
          <Row className="g-4 mt-4">
            <Col md={6}><Card className="shadow-sm border-0 h-100"><Card.Body>
              <Card.Title style={{ color: colors.text }}>Areas Requiring Water</Card.Title>
              <div style={{ height: "500px" }}>
                <MapContainer center={chennaiCenter} zoom={12} style={{ height: "100%", width: "100%" }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {demandAreas.slice(0, 3).map(area => {
                    const predictedWater = Number(area.predictedWater) || 0;
                    if (predictedWater === 0) return null;
                    const demandLevel = area.demandLevel ?? getDemandLevel(predictedWater);
                    const color =
                      demandLevel === "High" ? colors.red :
                        demandLevel === "Medium" ? colors.orange :
                          colors.green;
                    const radius = predictedWater * 2;
                    return (
                      <Circle
                        key={area.id}
                        center={[area.lat, area.lng]}
                        radius={radius}
                        color={color}
                        fillOpacity={0.4}
                      >
                        <Popup>
                          <strong>{area.name}</strong><br />
                          Actual Demand: {area.requiredWater} KL<br />
                          Predicted: {area.predictedWater} KL<br />
                          Demand Level: {demandLevel}<br />
                          Predicted Time: {area.predictedTime ?? "-"}
                        </Popup>
                      </Circle>
                    );
                  })}
                </MapContainer>
              </div>
            </Card.Body></Card></Col>

            <Col md={6}><Card className="shadow-sm border-0 h-100"><Card.Body>
              <Card.Title style={{ color: colors.text }}>Demand Area Details</Card.Title>
              <ul className="list-group list-group-flush">
                {demandAreas.slice(0, 3).map(area => {
                  const predictedWater = Number(area.predictedWater) || 0;
                  const demandLevel = area.demandLevel ?? getDemandLevel(predictedWater);
                  return (
                    <li key={area.id} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{area.name}</strong><br />
                        <span className="text-muted">Demand Level: {demandLevel}</span><br />
                        <span className="text-muted">Predicted: {area.predictedWater} KL</span><br />
                        <span className="text-muted">Time: {area.predictedTime ?? "-"}</span>
                      </div>
                      <span
                        className={`badge rounded-pill ${demandLevel === "High" ? "bg-danger" :
                          demandLevel === "Medium" ? "bg-warning text-dark" :
                            "bg-success"
                          }`}
                      >
                        {area.predictedWater} KL
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card.Body></Card></Col>
          </Row>

          {/* Predicted Week Chart (All Areas) */}
          <Row className="g-4 mt-4">
            <Col md={12}>
              <Card className="shadow-sm border-0">
                <Card.Body>
                  <Card.Title style={{ color: colors.text }}>Predicted Water Demand for 1 Week</Card.Title>
                  <div style={{ height: "350px" }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={predictedWeek} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                        <XAxis dataKey="day" stroke={colors.text} />
                        <YAxis stroke={colors.text} />
                        <Tooltip />
                        <Legend />
                        {predictedWeek[0] &&
                          Object.keys(predictedWeek[0])
                            .filter(key => key !== "day")
                            .map((area, idx) => (
                              <Line
                                key={area}
                                type="monotone"
                                dataKey={area}
                                stroke={["#5A67D8", "#FF9100", "#48BB78", "#F56565", "#ECC94B"][idx % 5]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            ))
                        }
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </main>
  );
}
