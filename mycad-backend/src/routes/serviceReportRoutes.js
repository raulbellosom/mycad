import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createServiceReport,
  deleteServiceReport,
  getAllServiceReports,
  getServiceReportById,
  updateServiceReport,
} from "../controllers/serviceReportController.js";
import { upload } from "../controllers/uploadImagesController.js";
import { processFiles } from "../controllers/uploadFilesController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getAllServiceReports)
  .post(
    protect,
    upload.fields([{ name: "files" }]),
    processFiles,
    createServiceReport
  );

router
  .route("/:id")
  .get(protect, getServiceReportById)
  .put(
    protect,
    upload.fields([{ name: "files" }]),
    processFiles,
    updateServiceReport
  )
  .delete(protect, deleteServiceReport);

export default router;
