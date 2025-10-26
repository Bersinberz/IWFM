import express from "express";
import { createUser, deleteUser, getUsers } from "../controllers/userController";

const router = express.Router();

router.get("/getUsers", getUsers);      // GET /api/users
router.post("/createUser", createUser);   // POST /api/users
router.delete("/:id", deleteUser);  

export default router;
