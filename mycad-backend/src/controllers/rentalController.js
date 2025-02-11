import { db } from "../lib/db.js";
import { processUploadedFiles } from "../middleware/fileUploadRentalMiddleware.js";

// Obtener todas las rentas
export const getAllRentals = async (req, res) => {
  try {
    const rentals = await db.rental.findMany({
      include: {
        client: true,
        vehicle: true,
        files: true,
      },
    });
    res.status(200).json(rentals);
  } catch (error) {
    console.error("Error al obtener rentas:", error);
    res.status(500).json({ error: "Error al obtener rentas" });
  }
};

// Obtener una renta por ID
export const getRentalById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID de renta requerido" });

    const rental = await db.rental.findUnique({
      where: { id },
      include: {
        client: true,
        vehicle: true,
        files: true,
      },
    });

    if (!rental) return res.status(404).json({ error: "Renta no encontrada" });
    res.status(200).json(rental);
  } catch (error) {
    console.error("Error al obtener la renta:", error);
    res.status(500).json({ error: "Error al obtener la renta" });
  }
};

// Crear una nueva renta
export const createRental = async (req, res) => {
  try {
    const {
      vehicleId,
      clientId,
      startDate,
      endDate,
      pickupLocation,
      dropoffLocation,
      dailyRate,
      deposit,
      totalCost,
      paymentStatus,
      initialMileage,
      finalMileage,
      fuelLevelStart,
      fuelLevelEnd,
      vehicleConditionStart,
      vehicleConditionEnd,
      comments,
      status,
    } = req.body;

    const files = req.files ? processUploadedFiles(req.files) : [];

    const newRental = await db.rental.create({
      data: {
        vehicleId,
        clientId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        pickupLocation,
        dropoffLocation,
        dailyRate: parseFloat(dailyRate),
        deposit: deposit ? parseFloat(deposit) : null,
        totalCost: totalCost ? parseFloat(totalCost) : null,
        paymentStatus,
        initialMileage,
        finalMileage,
        fuelLevelStart,
        fuelLevelEnd,
        vehicleConditionStart,
        vehicleConditionEnd,
        comments,
        status,
        files: {
          create: files,
        },
      },
      include: {
        client: true,
        vehicle: true,
        files: true,
      },
    });

    res.status(201).json(newRental);
  } catch (error) {
    console.error("Error al crear la renta:", error);
    res.status(500).json({ error: "Error al crear la renta" });
  }
};

// Actualizar una renta
export const updateRental = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRental = await db.rental.update({
      where: { id },
      data: req.body,
    });
    res.status(200).json(updatedRental);
  } catch (error) {
    console.error("Error al actualizar la renta:", error);
    res.status(500).json({ error: "Error al actualizar la renta" });
  }
};

// Eliminar una renta (lógica: deshabilitar en lugar de borrar)
export const deleteRental = async (req, res) => {
  try {
    const { id } = req.params;
    await db.rental.update({
      where: { id },
      data: { enabled: false },
    });
    res.status(200).json({ message: "Renta eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la renta:", error);
    res.status(500).json({ error: "Error al eliminar la renta" });
  }
};

// Buscar rentas con filtros y paginación
export const searchRentals = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const filters = { enabled: true };
    if (search.trim()) {
      filters.OR = [
        { comments: { contains: search } },
        { client: { name: { contains: search } } },
        { vehicle: { plateNumber: { contains: search } } },
      ];
    }

    const rentals = await db.rental.findMany({
      where: filters,
      skip: parseInt(offset),
      take: parseInt(limit),
      include: { client: true, vehicle: true, files: true },
      orderBy: { createdAt: "desc" },
    });

    const totalRentals = await db.rental.count({ where: filters });
    res.status(200).json({
      total: totalRentals,
      page: parseInt(page),
      limit: parseInt(limit),
      data: rentals,
    });
  } catch (error) {
    console.error("Error al buscar rentas:", error);
    res.status(500).json({ error: "Error al buscar rentas" });
  }
};
