import express from "express";
import upload from "../middleware/fileUploadRentalMiddleware.js";
import {
  createRental,
  getAllRentals,
  updateRental,
  deleteRental,
  searchRentals,
  getRentalById,
} from "../controllers/rentalController.js";

const router = express.Router();

router.get("/search", searchRentals);
router.post("/", upload.array("files", 10), createRental);
router.get("/", getAllRentals);
router
  .get("/:id", getRentalById)
  .put("/:id", upload.array("files", 10), updateRental);
router.delete("/:id", deleteRental);

export default router;
