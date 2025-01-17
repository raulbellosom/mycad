import { db } from "../lib/db.js";

export const generateFolio = async (reportType) => {
  // Determinar el prefijo según el tipo de reporte
  let prefix;
  let lastReport;

  if (reportType === "PREVENTIVE") {
    prefix = "MANT";
    lastReport = await db.serviceHistory.findFirst({
      where: { reportType },
      orderBy: { folio: "desc" },
    });
  } else if (reportType === "CORRECTIVE") {
    prefix = "SERV";
    lastReport = await db.serviceHistory.findFirst({
      where: { reportType },
      orderBy: { folio: "desc" },
    });
  } else if (reportType === "REPAIR") {
    prefix = "RPR";
    lastReport = await db.repairReport.findFirst({
      orderBy: { folio: "desc" },
    });
  } else {
    throw new Error("Tipo de reporte no válido");
  }

  // Obtener el último número del folio
  const lastNumber = lastReport
    ? parseInt(lastReport.folio.split("-")[1], 10)
    : 0;

  // Generar el siguiente número del folio
  const nextNumber = String(lastNumber + 1).padStart(4, "0");

  return `${prefix}-${nextNumber}`;
};
