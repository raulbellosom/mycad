import { db } from "../lib/db.js";
import { generateFolio } from "../utils/generateFolio.js";
import { processUploadedFiles } from "../middleware/fileUploadMiddleware.js";

// Obtener todos los reportes
export const getServiceReports = async (req, res) => {
  try {
    const reports = await db.serviceHistory.findMany({
      include: {
        vehicle: true,
        attachments: true,
        replacedParts: true,
      },
    });

    res.status(200).json(reports);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al obtener los reportes de servicio" });
  }
};

// Obtener un reporte por ID
export const getServiceReportById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID de reporte requerido" });
    }

    const report = await db.serviceHistory.findUnique({
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
        replacedParts: true,
      },
    });

    if (!report) {
      return res.status(404).json({ error: "Reporte no encontrado" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el reporte de servicio" });
  }
};

// Crear un nuevo reporte de servicio
export const createServiceReport = async (req, res) => {
  try {
    const {
      vehicleId,
      reportType,
      serviceDate,
      endServiceDate,
      serviceProviderName,
      serviceContactInfo,
      description,
      totalCost,
      comments,
      replacedParts,
    } = req.body;

    // Generar el folio basado en el tipo de reporte
    const folio = await generateFolio(reportType);

    // Procesar los adjuntos usando la función del middleware
    const attachments = req.files ? processUploadedFiles(req.files) : [];

    // Crear el reporte en la base de datos
    const report = await db.serviceHistory.create({
      data: {
        folio, // Agregar el folio generado
        vehicleId,
        reportType,
        serviceDate: new Date(serviceDate),
        endServiceDate: endServiceDate ? new Date(endServiceDate) : null,
        serviceProviderName,
        serviceContactInfo,
        description,
        totalCost: parseFloat(totalCost),
        comments,
        attachments: {
          create: attachments, // Guardar las rutas procesadas de los archivos
        },
        replacedParts: {
          create: JSON.parse(replacedParts || "[]").map((part) => ({
            partName: part.partName,
            actionType: part.actionType,
            cost: parseFloat(part.cost),
          })),
        },
      },
      include: {
        attachments: true,
        replacedParts: true,
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
export const updateServiceReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serviceDate,
      endServiceDate,
      serviceProviderName,
      serviceContactInfo,
      description,
      totalCost,
      comments,
      replacedParts,
      reportType,
      existingAttachments,
      vehicleId,
    } = req.body;

    // Parsear los adjuntos existentes
    const parsedExistingAttachments = existingAttachments
      ? JSON.parse(existingAttachments)
      : [];

    const validAttachmentIds = parsedExistingAttachments.map(
      (attachment) => attachment.id
    );

    // Procesar nuevos adjuntos
    const newAttachments = req.files ? processUploadedFiles(req.files) : [];

    // Eliminar archivos obsoletos si hay adjuntos válidos
    if (validAttachmentIds.length > 0) {
      await db.servicesFile.deleteMany({
        where: {
          serviceId: id,
          id: {
            notIn: validAttachmentIds, // Mantener solo los adjuntos existentes
          },
        },
      });
    } else {
      // Eliminar todos los adjuntos si no hay ninguno válido
      await db.servicesFile.deleteMany({
        where: { serviceId: id },
      });
    }

    // Actualizar el reporte en la base de datos
    const updatedReport = await db.serviceHistory.update({
      where: { id },
      data: {
        serviceDate: new Date(serviceDate),
        endServiceDate: endServiceDate ? new Date(endServiceDate) : null,
        serviceProviderName,
        serviceContactInfo,
        description,
        vehicleId,
        totalCost: parseFloat(totalCost),
        comments,
        reportType,
        attachments: {
          create: newAttachments, // Crear nuevos adjuntos
        },
        replacedParts: {
          deleteMany: {}, // Eliminar todas las piezas reemplazadas existentes
          create: JSON.parse(replacedParts || "[]").map((part) => ({
            partName: part.partName,
            actionType: part.actionType,
            cost: parseFloat(part.cost),
          })),
        },
      },
      include: {
        attachments: true,
        replacedParts: true,
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
export const deleteServiceReport = async (req, res) => {
  try {
    const { id } = req.params;

    // Eliminación lógica del reporte
    await db.serviceHistory.update({
      where: { id },
      data: { enabled: false },
    });

    const allServicesReports = await db.serviceHistory.findMany({
      where: { enabled: true },
      include: {
        attachments: true,
        replacedParts: true,
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
      data: allServicesReports,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar el reporte de servicio" });
  }
};

export const searchServiceReports = async (req, res) => {
  try {
    const { search = "", type = "ALL", page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    // Construir el filtro base
    const filters = {
      enabled: true, // Filtrar solo reportes habilitados
    };

    // Filtro por tipo de reporte
    if (type !== "ALL") {
      filters.reportType = type;
    }

    // Validar y construir el filtro de búsqueda
    const trimmedSearch = search.trim();

    if (trimmedSearch) {
      filters.OR = [];

      // Filtrar por placa del vehículo
      filters.OR.push({
        vehicle: {
          plateNumber: {
            contains: trimmedSearch,
          },
        },
      });

      // Filtrar por modelo del vehículo
      filters.OR.push({
        vehicle: {
          model: {
            name: {
              contains: trimmedSearch,
            },
          },
        },
      });

      // Filtrar por descripción del reporte
      filters.OR.push({
        description: {
          contains: trimmedSearch,
        },
      });

      // filtrar por folio
      filters.OR.push({
        folio: {
          contains: trimmedSearch,
        },
      });

      // Filtrar por comentarios
      filters.OR.push({
        comments: {
          contains: trimmedSearch,
        },
      });

      // Filtrar por partes reemplazadas
      filters.OR.push({
        replacedParts: {
          some: {
            partName: {
              contains: trimmedSearch,
            },
          },
        },
      });

      // Filtrar por costos (numéricos)
      const numericSearch = parseFloat(trimmedSearch);
      if (!isNaN(numericSearch)) {
        filters.OR.push(
          {
            replacedParts: {
              some: {
                cost: {
                  equals: numericSearch,
                },
              },
            },
          },
          {
            totalCost: {
              equals: numericSearch,
            },
          }
        );
      }
    }

    // Consultar reportes en la base de datos
    const reports = await db.serviceHistory.findMany({
      where: filters,
      skip: parseInt(offset),
      take: parseInt(limit),
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
        attachments: true, // Incluye archivos adjuntos
        replacedParts: true, // Incluye partes reemplazadas
      },
      orderBy: {
        updatedAt: "desc", // Ordenar por fecha de servicio
      },
    });

    // Contar el total de reportes que coinciden con los filtros
    const totalReports = await db.serviceHistory.count({
      where: filters,
    });

    // Responder con los datos
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
