import { Request, Response } from "express";
import Tanker, { ITanker } from "../models/Tanker";

// Helper function to format lastSeen
const formatLastSeen = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

// GET all tankers
export const getTankers = async (req: Request, res: Response) => {
  try {
    const tankers = await Tanker.find();

    // Map to include formatted lastSeen
    const formattedTankers = tankers.map((tanker) => {
      const t = tanker.toObject();
      return {
        ...t,
        lastSeen: formatLastSeen(t.lastSeen),
      };
    });

    res.status(200).json(formattedTankers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// CREATE a new tanker
export const createTanker = async (req: Request, res: Response) => {
  try {
    const tankerData: ITanker = req.body;
    const tanker = await Tanker.create(tankerData);
    res.status(201).json(tanker);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a tanker by ID
export const deleteTankerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const tanker = await Tanker.findByIdAndDelete(id);

    if (!tanker) {
      return res.status(404).json({ message: "Tanker not found" });
    }

    res.status(200).json({ message: "Tanker deleted successfully" });
  } catch (err) {
    console.error("Error deleting tanker:", err);
    res.status(500).json({ message: "Server error" });
  }
};