import axiosInstance from "./axisInstance";

export interface Delivery {
    date: string;
    time: string;
    quantity: number;
    destination: string;
}

export interface Tanker {
  location: unknown;
  _id: string;
  driver: string;
  vehicleType: string;
  vehicleNo: string;
  capacity: number;
  status: "online" | "offline";
  lastSeen: string;
  maintenance: boolean;
  deliveries: Delivery[];
}

// Tanker API calls
export const getAllTankers = async (): Promise<Tanker[]> => {
    const res = await axiosInstance.get<Tanker[]>("/tankers/getall");
    return res.data;
};

export const addTanker = async (tanker: Omit<Tanker, "_id" | "deliveries">): Promise<Tanker> => {
    const res = await axiosInstance.post<Tanker>("/tankers/addtanker", tanker);
    return res.data;
};

export const deleteTanker = async (id: string): Promise<void> => {
    await axiosInstance.delete(`/tankers/${id}`);
};
