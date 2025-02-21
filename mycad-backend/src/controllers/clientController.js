import { db } from "../lib/db.js";

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const clients = await db.client.findMany();
    res.status(200).json(clients);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await db.client.findUnique({ where: { id } });
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });
    res.status(200).json(client);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

// Crear un nuevo cliente
export const createClient = async (req, res) => {
  try {
    const { name, company, email, phoneNumber } = req.body;
    const newClient = await db.client.create({
      data: { name, company, email, phoneNumber },
    });
    res.status(201).json(newClient);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, company, email, phoneNumber } = req.body;
    if (!name || !company) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    const updatedClient = await db.client.update({
      where: { id },
      data: { name, company, email, phoneNumber },
    });
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// Eliminar un cliente (lógica: deshabilitar en lugar de borrar)
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await db.client.update({
      where: { id },
      data: { enabled: false },
    });
    res.status(200).json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

// Buscar clientes con filtros y paginación
export const searchClients = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;
    const offset = (page - 1) * limit;

    // Construir los filtros de búsqueda
    const filters = { enabled: true };

    if (search.trim()) {
      filters.OR = [
        { name: { contains: search } }, // Buscar por nombre
        { company: { contains: search } }, // Buscar por empresa
        { email: { contains: search } }, // Buscar por correo
        { phoneNumber: { contains: search } }, // Buscar por teléfono
      ];
    }

    // Obtener clientes de la base de datos
    const clients = await db.client.findMany({
      where: filters,
      skip: parseInt(offset),
      take: parseInt(limit),
      orderBy: { [sortBy]: order },
    });

    // Contar el total de clientes que coinciden con la búsqueda
    const totalRecords = await db.client.count({ where: filters });
    const pageSize = parseInt(limit);
    const currentPage = parseInt(page);
    const totalPages = Math.ceil(totalRecords / pageSize);

    res.status(200).json({
      pagination: { totalRecords, totalPages, currentPage, pageSize },
      data: clients,
    });
  } catch (error) {
    console.error("Error al buscar clientes:", error);
    res.status(500).json({ error: "Error al buscar clientes" });
  }
};
