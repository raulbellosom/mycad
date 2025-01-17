import express from "express";
import upload from "../middleware/fileUploadMiddleware.js";
import {
  createServiceReport,
  getServiceReports,
  updateServiceReport,
  deleteServiceReport,
  searchServiceReports,
  getServiceReportById,
} from "../controllers/serviceReportController.js";

const router = express.Router();

router.get("/search", searchServiceReports);
router.post("/", upload.array("attachments", 10), createServiceReport);
router.get("/", getServiceReports);
router
  .get("/:id", getServiceReportById)
  .put("/:id", upload.array("attachments", 10), updateServiceReport);
router.delete("/:id", deleteServiceReport);

export default router;
