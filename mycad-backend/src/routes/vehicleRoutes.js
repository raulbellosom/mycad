import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  searchVehicles,
} from "../controllers/vehicleController.js";
import {
  getVehicleTypes,
  getVehicleTypeById,
  getVehicleBrands,
  getVehicleBrandById,
  getVehicleModels,
  getVehicleModelById,
  searchModels,
  createVehicleBrand,
  updateVehicleBrand,
  createVehicleModel,
  updateVehicleModel,
  createVehicleType,
  updateVehicleType,
  deleteVehicleModel,
  createCondition,
  updateCondition,
  deleteCondition,
  deleteVehicleBrand,
  deleteVehicleType,
  getConditionById,
  getConditions,
} from "../controllers/vehicleModelController.js";
import { createMultipleVehicles } from "../controllers/VehicleExtrasController.js";
import { createMultipleModels } from "../controllers/vehicleModelExtrasController.js";
import {
  processImages,
  upload,
} from "../controllers/uploadImagesController.js";
import { processFiles } from "../controllers/uploadFilesController.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getVehicles)
  .post(
    protect,
    upload.fields([{ name: "images" }, { name: "files" }]),
    processImages,
    processFiles,
    createVehicle
  );
router
  .route("/vehicleTypes")
  .get(protect, getVehicleTypes)
  .post(protect, createVehicleType);
router
  .route("/vehicleBrands")
  .get(protect, getVehicleBrands)
  .post(protect, createVehicleBrand);
router
  .route("/vehicleModels")
  .get(protect, getVehicleModels)
  .post(protect, createVehicleModel);
router
  .route("/vehicleConditions")
  .get(protect, getConditions)
  .post(protect, createCondition);
router.route("/search").get(protect, searchVehicles);
router
  .route("/createMultipleVehicles")
  .post(protect, upload.single("csvFile"), createMultipleVehicles);
router.route("/vehicleModels/search").get(protect, searchModels);
router
  .route("/vehicleModels/createMultipleModels")
  .post(protect, upload.single("csvFile"), createMultipleModels);
router
  .route("/:id")
  .get(protect, getVehicleById)
  .put(
    protect,
    upload.fields([{ name: "images" }, { name: "files" }]),
    processImages,
    processFiles,
    updateVehicle
  )
  .delete(protect, deleteVehicle);
router
  .route("/vehicleTypes/:id")
  .get(protect, getVehicleTypeById)
  .put(protect, updateVehicleType)
  .delete(protect, deleteVehicleType);
router
  .route("/vehicleBrands/:id")
  .get(protect, getVehicleBrandById)
  .put(protect, updateVehicleBrand)
  .delete(protect, deleteVehicleBrand);
router
  .route("/vehicleModels/:id")
  .get(protect, getVehicleModelById)
  .put(protect, updateVehicleModel)
  .delete(protect, deleteVehicleModel);
router
  .route("/vehicleConditions/:id")
  .get(protect, getConditionById)
  .put(protect, updateCondition)
  .delete(protect, deleteCondition);

export default router;
