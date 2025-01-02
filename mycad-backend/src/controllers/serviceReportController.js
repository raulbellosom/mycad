import { db } from "../lib/db.js";

// Crear un reporte de servicio
export const createServiceReport = async (req, res) => {
  const {
    vehicleId,
    reportType,
    serviceDate,
    description,
    totalCost,
    comments,
    replacedParts,
  } = req.body;

  // Archivos procesados con Multer
  const uploadedFiles = req.files || []; // Los archivos estarán en req.files

  try {
    const serviceReport = await db.$transaction(async (prisma) => {
      // Crear el reporte de servicio
      const report = await prisma.serviceHistory.create({
        data: {
          vehicleId,
          reportType,
          serviceDate: new Date(serviceDate),
          description,
          totalCost: parseFloat(totalCost),
          comments,
          enabled: true, // El reporte se marca como habilitado inicialmente
        },
      });

      // Crear los repuestos reemplazados si existen
      if (replacedParts && replacedParts.length > 0) {
        await prisma.replacedPart.createMany({
          data: replacedParts.map((part) => ({
            serviceHistoryId: report.id,
            partName: part.partName,
            actionType: part.actionType,
            cost: parseFloat(part.cost),
          })),
        });
      }

      // Crear los archivos adjuntos si existen
      if (uploadedFiles.length > 0) {
        await prisma.attachment.createMany({
          data: uploadedFiles.map((file) => ({
            serviceHistoryId: report.id,
            url: file.path, // Ruta donde Multer guarda los archivos
            type: file.mimetype,
          })),
        });
      }

      return report;
    });

    res.status(201).json(serviceReport);
  } catch (error) {
    console.error("Error creating service report:", error.message);
    res.status(500).json({ message: "Failed to create service report" });
  }
};

// Actualizar un reporte de servicio
export const updateServiceReport = async (req, res) => {
  const { id } = req.params;
  const {
    reportType,
    serviceDate,
    description,
    totalCost,
    comments,
    replacedParts,
    files,
  } = req.body;

  const uploadedFiles = req.files || []; // Archivos procesados con Multer

  try {
    const serviceReport = await db.serviceHistory.update({
      where: { id },
      data: {
        reportType,
        serviceDate: new Date(serviceDate),
        description,
        totalCost: parseFloat(totalCost),
        comments,
      },
    });

    // Eliminar los repuestos existentes y agregar los nuevos
    if (replacedParts && replacedParts.length > 0) {
      await db.replacedPart.deleteMany({
        where: { serviceHistoryId: id },
      });

      await db.replacedPart.createMany({
        data: replacedParts.map((part) => ({
          serviceHistoryId: id,
          partName: part.partName,
          actionType: part.actionType,
          cost: parseFloat(part.cost),
        })),
      });
    }

    // Actualizar los archivos adjuntos
    if (uploadedFiles.length > 0) {
      await db.attachment.createMany({
        data: uploadedFiles.map((file) => ({
          serviceHistoryId: id,
          url: file.path,
          type: file.mimetype,
        })),
      });
    }

    res.json(serviceReport);
  } catch (error) {
    console.error("Error updating service report:", error.message);
    res.status(500).json({ message: "Failed to update service report" });
  }
};

// Consultar todos los reportes de servicio
export const getAllServiceReports = async (req, res) => {
  try {
    const reports = await db.serviceHistory.findMany({
      where: { enabled: true },
      include: {
        replacedParts: true,
        attachments: true,
      },
    });

    res.json(reports);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching service reports" });
  }
};

// Consultar un reporte de servicio por ID
export const getServiceReportById = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await db.serviceHistory.findUnique({
      where: { id },
      include: {
        replacedParts: true,
        attachments: true,
      },
    });

    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: "Reporte no encontrado" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error fetching service report" });
  }
};

// Eliminar un reporte de servicio de manera lógica (marcar como 'enabled: false')
export const deleteServiceReport = async (req, res) => {
  const { id } = req.params;

  try {
    // search if the service report exists
    const existingReport = await db.serviceHistory.findUnique({
      where: { id },
    });

    if (!existingReport) {
      return res.status(404).json({ message: "Reporte no encontrado" });
    }

    const serviceReport = await db.serviceHistory.update({
      where: { id },
      data: { enabled: false }, // Marcamos como deshabilitado
    });

    res.json({ message: "Reporte eliminado.", serviceReport });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Error deleting service report" });
  }
};
