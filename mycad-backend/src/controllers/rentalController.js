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
      comments,
      status,
    } = req.body;

    // Convertimos valores para evitar errores en Prisma
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
      existingFiles, // IDs de archivos que deben mantenerse
    } = req.body;

    // Convertimos valores para evitar errores en Prisma
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

    // 🟢 PROCESAR ARCHIVOS ADJUNTOS
    const newFiles = req.files ? processUploadedFiles(req.files) : [];

    // 🔴 Eliminamos archivos si no están en `existingFiles`
    if (existingFiles) {
      await db.rentalFile.deleteMany({
        where: {
          rentalId: id,
          id: { notIn: existingFiles }, // Eliminamos archivos que no están en la lista de archivos existentes
        },
      });
    }

    // 🟢 ACTUALIZAMOS LA RENTA
    const updatedRental = await db.rental.update({
      where: { id },
      data: {
        ...rentalData,
        files: {
          create: newFiles, // Agregamos los nuevos archivos
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
      status,
      paymentStatus,
      clientId,
      vehicleId,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;
    const filters = { enabled: true };

    // Búsqueda general (por nombre del cliente, placas del vehículo o comentarios)
    if (search.trim()) {
      filters.OR = [
        { comments: { contains: search, mode: "insensitive" } },
        // buscar por nombre del cliente y empresa donde trabaja
        {
          client: {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { company: { contains: search, mode: "insensitive" } },
            ],
          },
        },
        // buscar por placas del vehículo
        { vehicle: { plateNumber: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Filtrar por estado de la renta (PENDING, ACTIVE, COMPLETED, CANCELED)
    if (status && status !== "ALL") {
      filters.status = status;
    }

    // Filtrar por estado del pago (PENDING, COMPLETED, PARTIAL, REFUNDED)
    if (paymentStatus && paymentStatus !== "ALL") {
      filters.paymentStatus = paymentStatus;
    }

    // Filtrar por cliente específico
    if (clientId) {
      filters.clientId = clientId;
    }

    // Filtrar por vehículo específico
    if (vehicleId) {
      filters.vehicleId = vehicleId;
    }

    // Obtener rentas con filtros aplicados incluyendo el modelo, marca, tipo y una imagen del vehículo
    const rentals = await db.rental.findMany({
      where: filters,
      skip: parseInt(offset),
      take: parseInt(limit),
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
              take: 1, // Obtener solo una imagen si existe
            },
          },
        },
        files: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Contar el total de rentas con los filtros aplicados
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
