import { db } from "../lib/db.js";
import { generateFolio } from "../utils/generateFolio.js";
import { processUploadedFiles } from "../middleware/fileUploadRepairMiddleware.js";

// Obtener todos los reportes
export const getRepairReports = async (req, res) => {
  try {
    const reports = await db.repairReport.findMany({
      include: {
        vehicle: true,
        attachments: true,
        repairedParts: true,
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los reportes de reparación" });
  }
};

// Obtener un reporte por ID
export const getRepairReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de reporte requerido" });
    }

    const report = await db.repairReport.findUnique({
      where: { id },
      include: {
        vehicle: {
          select: {
            plateNumber: true,
            model: {
              select: {
                name: true,
                year: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        attachments: true,
        repairedParts: true,
      },
    });

    if (!report) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener el reporte de reparación" });
  }
};

// Crear un nuevo reporte de reparación
export const createRepairReport = async (req, res) => {
  try {
    const {
      vehicleId,
      repairDate,
      failureDate,
      startRepairDate,
      description,
      totalCost,
      comments,
      repairedParts,
      workshopType,
      workshopName,
      workshopContact,
    } = req.body;

    // Generar el folio basado en el tipo de reporte
    const folio = await generateFolio("REPAIR");

    // Procesar los adjuntos usando la función del middleware
    const attachments = req.files ? processUploadedFiles(req.files) : [];

    // Crear el reporte en la base de datos
    const report = await db.repairReport.create({
      data: {
        folio,
        vehicleId,
        failureDate: new Date(failureDate),
        startRepairDate: new Date(startRepairDate),
        repairDate: new Date(repairDate),
        description,
        totalCost: parseFloat(totalCost),
        comments,
        workshopType,
        workshopName,
        workshopContact,
        attachments: {
          create: attachments,
        },
        repairedParts: {
          create: JSON.parse(repairedParts || "[]").map((part) => ({
            partName: part.partName,
            actionType: part.actionType,
            cost: parseFloat(part.cost),
          })),
        },
      },
      include: {
        attachments: true,
        repairedParts: true,
        vehicle: {
          select: {
            plateNumber: true,
            model: {
              select: {
                name: true,
                year: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(201).json(report);
  } catch (error) {
    console.error("Error al crear el reporte:", error);
    res.status(500).json({ error: "Error al crear el reporte" });
  }
};

// Actualizar un reporte
export const updateRepairReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      totalCost,
      startRepairDate,
      repairDate,
      failureDate,
      comments,
      repairedParts,
      existingAttachments,
      vehicleId,
      workshopType,
      workshopName,
      workshopContact,
    } = req.body;

    const parsedExistingAttachments = existingAttachments
      ? JSON.parse(existingAttachments)
      : [];

    const validAttachmentIds = parsedExistingAttachments.map(
      (attachment) => attachment.id
    );

    const newAttachments = req.files ? processUploadedFiles(req.files) : [];

    if (validAttachmentIds.length > 0) {
      await db.repairFile.deleteMany({
        where: {
          repairId: id,
          id: {
            notIn: validAttachmentIds,
          },
        },
      });
    } else {
      await db.repairFile.deleteMany({
        where: { repairId: id },
      });
    }

    const updatedReport = await db.repairReport.update({
      where: { id },
      data: {
        description,
        vehicleId,
        failureDate: new Date(failureDate),
        startRepairDate: new Date(startRepairDate),
        repairDate: new Date(repairDate),
        totalCost: parseFloat(totalCost),
        comments,
        workshopType,
        workshopName,
        workshopContact,
        attachments: {
          create: newAttachments,
        },
        repairedParts: {
          deleteMany: {},
          create: JSON.parse(repairedParts || "[]").map((part) => ({
            partName: part.partName,
            actionType: part.actionType,
            cost: parseFloat(part.cost),
          })),
        },
      },
      include: {
        attachments: true,
        repairedParts: true,
        vehicle: {
          select: {
            plateNumber: true,
            model: {
              select: {
                name: true,
                year: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json(updatedReport);
  } catch (error) {
    console.error("Error al actualizar el reporte:", error);
    res.status(500).json({ error: "Error al actualizar el reporte" });
  }
};

// Eliminar un reporte (lógica)
export const deleteRepairReport = async (req, res) => {
  try {
    const { id } = req.params;

    await db.repairReport.update({
      where: { id },
      data: { enabled: false },
    });

    const allRepaitReports = await db.repairReport.findMany({
      where: { enabled: true },
      include: {
        attachments: true,
        repairedParts: true,
        vehicle: {
          select: {
            plateNumber: true,
            model: {
              select: {
                name: true,
                year: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).json({
      message: "Reporte eliminado correctamente",
      data: allRepaitReports,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al eliminar el reporte de reparación" });
  }
};

// Buscar reportes
export const searchRepairReports = async (req, res) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const filters = {
      enabled: true,
    };

    if (search.trim()) {
      filters.OR = [
        { folio: { contains: search } },
        { description: { contains: search } },
        { comments: { contains: search } },
        {
          repairedParts: {
            some: { partName: { contains: search } },
          },
        },
        // Buscar por placa, marca, modelo o tipo de vehículo
        {
          vehicle: {
            model: {
              brand: { name: { contains: search } },
              type: { name: { contains: search } },
              name: { contains: search },
            },
            plateNumber: { contains: search },
          },
        },
      ];

      //   buscar por costo total, tipo de taller, nombre de taller o contacto de taller
      filters.OR.push(
        { totalCost: parseFloat(search) },
        { workshopType: { contains: search } },
        { workshopName: { contains: search } },
        { workshopContact: { contains: search } }
      );
    }

    const reports = await db.repairReport.findMany({
      where: filters,
      skip: parseInt(offset),
      take: parseInt(limit),
      include: {
        attachments: true,
        repairedParts: true,
        vehicle: {
          select: {
            plateNumber: true,
            model: {
              select: {
                name: true,
                year: true,
                brand: {
                  select: {
                    name: true,
                  },
                },
                type: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { repairDate: "desc" },
    });

    const totalReports = await db.repairReport.count({ where: filters });

    res.status(200).json({
      total: totalReports,
      page: parseInt(page),
      limit: parseInt(limit),
      data: reports,
    });
  } catch (error) {
    console.error("Error al buscar reportes:", error);
    res.status(500).json({ error: "Error al buscar reportes" });
  }
};
