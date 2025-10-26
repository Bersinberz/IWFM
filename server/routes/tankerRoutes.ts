import express from "express";
import { getTankers, createTanker, deleteTankerById } from "../controllers/tankerController";

const router = express.Router();

// Tankers
router.get("/getall", getTankers);
router.post("/addtanker", createTanker);
router.delete("/:id", deleteTankerById);

export default router;
