import express from "express";
import upload from "../middleware/fileUploadRepairMiddleware.js";
import {
  createRepairReport,
  getRepairReports,
  updateRepairReport,
  deleteRepairReport,
  searchRepairReports,
  getRepairReportById,
} from "../controllers/repairReportController.js";

const router = express.Router();

// Buscar reportes con filtros
router.get("/search", searchRepairReports);

// Crear un nuevo reporte de reparación
router.post("/", upload.array("attachments", 10), createRepairReport);

// Obtener todos los reportes de reparación
router.get("/", getRepairReports);

// Operaciones sobre un reporte específico
router
  .get("/:id", getRepairReportById) // Obtener reporte por ID
  .put("/:id", upload.array("attachments", 10), updateRepairReport); // Actualizar reporte

// Eliminar un reporte (lógica)
router.delete("/:id", deleteRepairReport);

export default router;
