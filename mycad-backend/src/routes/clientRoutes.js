import express from "express";
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
} from "../controllers/clientController.js";

const router = express.Router();

router.get("/", getAllClients);
router.get("/search", searchClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);
router.delete("/:id", deleteClient);

export default router;
