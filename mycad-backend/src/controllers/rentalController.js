import { db } from "../lib/db.js";
import { RentalStatus } from "@prisma/client";
import { processUploadedFiles } from "../middleware/fileUploadRentalMiddleware.js";
import crypto from "crypto";

const generateUniqueFolio = async () => {
  const year = new Date().getFullYear();
  let uniqueFolio;

  while (true) {
    const randomCode = crypto.randomBytes(3).toString("hex").toUpperCase(); // Genera un código aleatorio de 3 bytes (6 caracteres)
    uniqueFolio = `RNT-${year}-${randomCode}`;

    // Verifica si ya existe en la base de datos
    const existingRental = await db.rental.findUnique({
      where: { folio: uniqueFolio },
    });

    if (!existingRental) break; // Si no existe, salimos del loop
  }

  return uniqueFolio;
};

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
      comments,
      status,
    } = req.body;

    const folio = await generateUniqueFolio();

    // Convertimos valores para evitar errores en Prisma
    const rentalData = {
      vehicleId,
      clientId,
      folio,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      pickupLocation: pickupLocation || null,
      dropoffLocation: dropoffLocation || null,
      dailyRate: dailyRate ? parseFloat(dailyRate) : 0,
      deposit: deposit ? parseFloat(deposit) : null,
      totalCost: totalCost ? parseFloat(totalCost) : null,
      paymentStatus,
      initialMileage: initialMileage ? parseInt(initialMileage, 10) : null,
      finalMileage: finalMileage ? parseInt(finalMileage, 10) : null,
      fuelLevelStart: fuelLevelStart ? parseFloat(fuelLevelStart) : null,
      fuelLevelEnd: fuelLevelEnd ? parseFloat(fuelLevelEnd) : null,
      comments: comments || null,
      status,
    };

    // Manejo de archivos si existen
    const files = req.files ? processUploadedFiles(req.files) : [];

    const newRental = await db.rental.create({
      data: {
        ...rentalData,
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
      comments,
      status,
      existingFiles,
    } = req.body;

    const rentalData = {
      vehicleId,
      clientId,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      pickupLocation: pickupLocation || null,
      dropoffLocation: dropoffLocation || null,
      dailyRate: dailyRate ? parseFloat(dailyRate) : 0,
      deposit: deposit ? parseFloat(deposit) : null,
      totalCost: totalCost ? parseFloat(totalCost) : null,
      paymentStatus,
      initialMileage: initialMileage ? parseInt(initialMileage, 10) : null,
      finalMileage: finalMileage ? parseInt(finalMileage, 10) : null,
      fuelLevelStart: fuelLevelStart ? parseFloat(fuelLevelStart) : null,
      fuelLevelEnd: fuelLevelEnd ? parseFloat(fuelLevelEnd) : null,
      comments: comments || null,
      status,
    };

    const newFiles = req.files ? processUploadedFiles(req.files) : [];

    const parsedExistingFiles = existingFiles ? JSON.parse(existingFiles) : [];
    const validFileIds = parsedExistingFiles
      .filter((id) => id !== null && id !== undefined && id !== "")
      .map((id) => id);

    if (validFileIds.length > 0) {
      await db.rentalFile.deleteMany({
        where: {
          rentalId: id,
          id: { notIn: validFileIds },
        },
      });
    } else {
      await db.rentalFile.deleteMany({
        where: { rentalId: id },
      });
    }

    const updatedRental = await db.rental.update({
      where: { id },
      data: {
        ...rentalData,
        files: {
          create: newFiles,
        },
      },
      include: {
        client: true,
        vehicle: true,
        files: true,
      },
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
    const {
      search = "",
      pageSize = 10,
      sortBy = "createdAt",
      order = "desc",
      status,
      page = 1,
    } = req.query;

    const offset = (page - 1) * pageSize;
    const filters = { enabled: true };

    const validSortFields = [
      "vehicle.model.name",
      "client.name",
      "totalCost",
      "status",
      "paymentStatus",
      "startDate",
      "endDate",
      "createdAt",
      "updatedAt",
    ];

    const searchNumber = !isNaN(search) ? parseFloat(search) : null;

    if (search.trim()) {
      filters.OR = [
        { comments: { contains: search } },
        { pickupLocation: { contains: search } },
        { dropoffLocation: { contains: search } },
        {
          client: {
            OR: [
              { name: { contains: search } },
              { company: { contains: search } },
            ],
          },
        },
        { vehicle: { plateNumber: { contains: search } } },
        { vehicle: { model: { name: { contains: search } } } },
        { vehicle: { model: { brand: { name: { contains: search } } } } },
        { vehicle: { model: { type: { name: { contains: search } } } } },
      ];
      if (searchNumber !== null) {
        filters.OR.push(
          { totalCost: { gte: searchNumber * 0.9, lte: searchNumber * 1.1 } },
          { deposit: { gte: searchNumber * 0.9, lte: searchNumber * 1.1 } },
          { dailyRate: { gte: searchNumber * 0.9, lte: searchNumber * 1.1 } }
        );
      }
    }

    const orderField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
    const orderDirection = order === "desc" ? "desc" : "asc";

    const formSortBy = (value, order) => {
      let arr = value.split(".");
      let obj = {};
      if (arr.length === 3) {
        obj = {
          [arr[0]]: {
            [arr[1]]: {
              [arr[2]]: order,
            },
          },
        };
      } else if (arr.length === 2) {
        obj = {
          [arr[0]]: {
            [arr[1]]: order,
          },
        };
      } else {
        obj = {
          [arr[0]]: order,
        };
      }
      return obj;
    };

    const statusMapping = {
      Pendiente: RentalStatus.PENDING,
      Activa: RentalStatus.ACTIVE,
      Completada: RentalStatus.COMPLETED,
      Cancelada: RentalStatus.CANCELED,
    };

    if (status && status !== "ALL") {
      const validStatuses = Array.isArray(status)
        ? status.map((s) => statusMapping[s.trim()]).filter(Boolean)
        : statusMapping[status.trim()]
        ? [statusMapping[status.trim()]]
        : [];

      if (validStatuses.length > 0) {
        filters.status = { in: validStatuses };
      }
    }

    const rentals = await db.rental.findMany({
      where: filters,
      include: {
        client: true,
        vehicle: {
          include: {
            model: {
              include: {
                brand: true,
                type: true,
              },
            },
            images: {
              take: 1,
            },
          },
        },
        files: true,
      },
      orderBy: formSortBy(orderField, orderDirection),
      take: parseInt(pageSize),
      skip: parseInt(offset),
    });

    const totalRentals = await db.rental.count({ where: filters });
    const totalPages = Math.ceil(totalRentals / pageSize);

    res.status(200).json({
      pagination: {
        totalRecords: totalRentals,
        totalPages: totalPages,
        currentPage: parseInt(page),
        pageSize: parseInt(pageSize),
      },
      data: rentals,
    });
  } catch (error) {
    console.error("Error al buscar rentas:", error);
    res.status(500).json({ error: "Error al buscar rentas" });
  }
};
