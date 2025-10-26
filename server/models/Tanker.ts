import mongoose, { Document, Schema } from "mongoose";

export interface IDelivery {
  date: string;
  time: string;
  quantity: number;
  destination: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface ITanker extends Document {
  driver: string;
  vehicleType: string;
  vehicleNo: string;
  capacity: number;
  totalQuantity: number;
  status: "online" | "offline";
  lastSeen: string;
  location: ILocation; 
  maintenance: boolean; 
  deliveries: IDelivery[];
}

const DeliverySchema = new Schema<IDelivery>({
  date: { type: String, required: true },
  time: { type: String, required: true },
  quantity: { type: Number, required: true },
  destination: { type: String, required: true },
});

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const TankerSchema = new Schema<ITanker>(
  {
    driver: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleNo: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    totalQuantity: { type: Number, default: 0 },
    status: { type: String, enum: ["online", "offline"], default: "offline" },
    lastSeen: { type: String, required: true },
    location: { type: LocationSchema, default: { latitude: 0, longitude: 0 } },
    maintenance: { type: Boolean, default: false },
    deliveries: { type: [DeliverySchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.model<ITanker>("Tanker", TankerSchema);