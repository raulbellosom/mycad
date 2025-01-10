import { db } from "../lib/db.js";

export const generateFolio = async (reportType) => {
  const prefix = reportType === "PREVENTIVE" ? "MANT" : "SERV";

  const lastReport = await db.serviceHistory.findFirst({
    where: { reportType },
    orderBy: { folio: "desc" },
  });

  const lastNumber = lastReport
    ? parseInt(lastReport.folio.split("-")[1], 10)
    : 0;

  const nextNumber = String(lastNumber + 1).padStart(4, "0");

  return `${prefix}-${nextNumber}`;
};
