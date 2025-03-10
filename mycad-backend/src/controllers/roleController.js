import { db } from "../lib/db.js";

export const getRoles = async (req, res) => {
  try {
    // get roles excluding role with id 1
    const roles = await db.role.findMany({
      where: {
        id: {
          not: 1,
        },
      },
    });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener roles." });
  }
};

export const getRoleById = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await db.role.findUnique({
      where: { id: parseInt(id) },
    });
    if (role) {
      res.status(200).json(role);
    } else {
      res.status(404).json({ error: "Rol no encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al obtener rol." });
  }
};

export const createRole = async (req, res) => {
  const { name } = req.body;

  try {
    const newRole = await db.role.create({
      data: {
        name,
      },
    });
    res.status(201).json(newRole);
  } catch (error) {
    res.status(500).json({ error: "Error al crear rol." });
  }
};

export const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    if (parseInt(id) === 1) {
      return res
        .status(400)
        .json({ error: "No se puede actualizar este rol." });
    }

    const updatedRole = await db.role.update({
      where: { id: parseInt(id) },
      data: {
        name,
      },
    });
    res.status(200).json(updatedRole);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar rol." });
  }
};

export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    if (parseInt(id) === 1) {
      return res.status(400).json({ error: "No se puede eliminar este rol." });
    }

    // check if role is being used by any user
    const usersWithRole = await db.user.findMany({
      where: { roleId: parseInt(id) },
    });

    if (usersWithRole.length > 0) {
      return res
        .status(400)
        .json({ error: "No se puede eliminar un rol asignado a un usuario." });
    }

    // check if role has permissions
    const rolePermissions = await db.rolePermission.findMany({
      where: { roleId: parseInt(id) },
    });

    if (rolePermissions.length > 0) {
      return res
        .status(400)
        .json({ error: "No se puede eliminar un rol con permisos asignados." });
    }

    await db.role.delete({
      where: { id: parseInt(id) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar rol." });
  }
};
