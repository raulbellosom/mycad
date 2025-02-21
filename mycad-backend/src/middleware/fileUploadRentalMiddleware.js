import multer from "multer";
import path from "path";
import fs from "fs";

// Rutas base para Rentas
const BASE_PATH = path.join(process.cwd(), "src/uploads/rentals");
const IMAGES_PATH = path.join(BASE_PATH, "imagenes");
const FILES_PATH = path.join(BASE_PATH, "files");

// Crear carpetas si no existen
const ensureDirectoriesExist = () => {
  [BASE_PATH, IMAGES_PATH, FILES_PATH].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Llamar a la función para crear las carpetas al cargar el middleware
ensureDirectoriesExist();

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Clasificar los archivos en subcarpetas
    const isImage = file.mimetype.startsWith("image/");
    const isXML =
      file.mimetype === "text/xml" || file.originalname.endsWith(".xml");
    const isZIP =
      file.mimetype === "application/zip" || file.originalname.endsWith(".zip");

    const targetDir = isImage || isXML || isZIP ? IMAGES_PATH : FILES_PATH;

    // Crear directorio si no existe
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    cb(null, targetDir);
  },
  filename: (req, file, cb) => {
    // Convertir el nombre del archivo a UTF-8
    const originalName = Buffer.from(file.originalname, "latin1").toString(
      "utf8"
    );
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${originalName}`);
  },
});

// Función para ajustar las rutas guardadas en la base de datos
const formatFilePath = (filePath) => {
  // Reemplazar separadores de directorios y eliminar todo antes de uploads
  const relativePath = filePath.replace(/\\/g, "/");
  const uploadIndex = relativePath.indexOf("uploads");
  const cleanPath =
    uploadIndex !== -1 ? relativePath.slice(uploadIndex) : relativePath;

  // Asegurarnos de que no haya // duplicados ni un / inicial
  return cleanPath.replace(/\/\/{2,}/g, "/").replace(/^\/+/, "");
};

// Procesar archivos subidos
export const processUploadedFiles = (files) => {
  return files.map((file) => ({
    url: formatFilePath(file.path), // Generar URL correcta
    type: file.mimetype,
    metadata: JSON.stringify({
      originalName: file.originalname,
      size: file.size,
    }),
  }));
};

// Configuración de Multer
const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // Tamaño máximo: 20 MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "text/xml",
      "application/xml",
      "application/pdf",
      "application/zip",
      "application/msword",
      "application/vnd.ms-excel",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.ms-excel.sheet.macroEnabled.12",
      "application/vnd.ms-excel.sheet.binary.macroEnabled.12",
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Formato de archivo no permitido"));
    }
    cb(null, true);
  },
});

// Exportar el middleware para rentas
export default upload;
