import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function createConditions() {
  await prisma.condition.createMany({
    data: [
      { name: "Nuevo", enabled: true },
      { name: "Semi Nuevo", enabled: true },
      { name: "Usado", enabled: true },
      { name: "En Reparación", enabled: true },
      { name: "En Mantenimiento", enabled: true },
      { name: "En Uso", enabled: true },
      { name: "En Desuso", enabled: true },
      { name: "En Venta", enabled: true },
      { name: "Vendido", enabled: true },
      { name: "En renta", enabled: true },
      { name: "Rentado", enabled: true },
      { name: "Prestado", enabled: true },
      { name: "En Préstamo", enabled: true },
      { name: "Descompuesto", enabled: true },
    ],
  });
  console.log("Condiciones creadas");
}

async function createRoles() {
  const rolesToCreate = ["Root", "Administrador", "User", "Guest"];
  const createdRoles = {};

  for (const roleName of rolesToCreate) {
    const exists = await prisma.role.findFirst({ where: { name: roleName } });
    if (!exists) {
      const role = await prisma.role.create({ data: { name: roleName } });
      console.log(`Rol creado: ${roleName}`);
      createdRoles[roleName] = role;
    } else {
      createdRoles[roleName] = exists;
      console.log(`Rol existente: ${roleName}`);
    }
  }
  return createdRoles;
}

async function createPermissions() {
  const permissions = [
    { name: "view_dashboard", description: "Ver el panel de control" },
    { name: "view_account", description: "Ver la cuenta" },
    { name: "edit_account", description: "Editar información de la cuenta" },
    { name: "change_password", description: "Cambiar contraseña" },
    { name: "change_account_image", description: "Cambiar imagen de perfil" },
    { name: "view_users", description: "Ver usuarios" },
    { name: "create_users", description: "Crear usuarios" },
    { name: "edit_users", description: "Editar usuarios" },
    { name: "delete_users", description: "Eliminar usuarios" },
    { name: "view_roles", description: "Ver roles" },
    { name: "create_roles", description: "Crear roles" },
    { name: "edit_roles", description: "Editar roles" },
    { name: "delete_roles", description: "Eliminar roles" },
    { name: "view_vehicles", description: "Ver vehículos" },
    { name: "create_vehicles", description: "Crear vehículos" },
    { name: "edit_vehicles", description: "Editar vehículos" },
    { name: "delete_vehicles", description: "Eliminar vehículos" },
    {
      name: "view_vehicles_conditions",
      description: "Ver condiciones de vehículos",
    },
    {
      name: "create_vehicles_conditions",
      description: "Crear condiciones de vehículos",
    },
    {
      name: "edit_vehicles_conditions",
      description: "Editar condiciones de vehículos",
    },
    {
      name: "delete_vehicles_conditions",
      description: "Eliminar condiciones de vehículos",
    },
    { name: "view_vehicles_brands", description: "Ver marcas de vehículos" },
    {
      name: "create_vehicles_brands",
      description: "Crear marcas de vehículos",
    },
    {
      name: "edit_vehicles_brands",
      description: "Editar marcas de vehículos",
    },
    {
      name: "delete_vehicles_brands",
      description: "Eliminar marcas de vehículos",
    },
    { name: "view_vehicles_types", description: "Ver tipos de vehículos" },
    {
      name: "create_vehicles_types",
      description: "Crear tipos de vehículos",
    },
    {
      name: "edit_vehicles_types",
      description: "Editar tipos de vehículos",
    },
    {
      name: "delete_vehicles_types",
      description: "Eliminar tipos de vehículos",
    },
    { name: "view_vehicles_models", description: "Ver modelos de vehículos" },
    {
      name: "create_vehicles_models",
      description: "Crear modelos de vehículos",
    },
    {
      name: "edit_vehicles_models",
      description: "Editar modelos de vehículos",
    },
    {
      name: "delete_vehicles_models",
      description: "Eliminar modelos de vehículos",
    },
    // permisos para rentals
    { name: "view_rentals", description: "Ver rentas" },
    { name: "create_rentals", description: "Crear rentas" },
    { name: "edit_rentals", description: "Editar rentas" },
    { name: "delete_rentals", description: "Eliminar rentas" },
    // permisos para clients
    { name: "view_clients", description: "Ver clientes" },
    { name: "create_clients", description: "Crear clientes" },
    { name: "edit_clients", description: "Editar clientes" },
    { name: "delete_clients", description: "Eliminar clientes" },
    // permisos para servicios reportes
    {
      name: "view_services_reports",
      description: "Ver reportes de servicios",
    },
    {
      name: "create_services_reports",
      description: "Crear reportes de servicios",
    },
    {
      name: "edit_services_reports",
      description: "Editar reportes de servicios",
    },
    {
      name: "delete_services_reports",
      description: "Eliminar reportes de servicios",
    },
    // permisos para reparaciones reportes
    {
      name: "view_repairs_reports",
      description: "Ver reportes de reparaciones",
    },
    {
      name: "create_repairs_reports",
      description: "Crear reportes de reparaciones",
    },
    {
      name: "edit_repairs_reports",
      description: "Editar reportes de reparaciones",
    },
    {
      name: "delete_repairs_reports",
      description: "Eliminar reportes de reparaciones",
    },
  ];

  const createdPermissions = [];
  for (const perm of permissions) {
    // Usamos findFirst en lugar de findUnique porque 'name' no es una clave única
    const exists = await prisma.permission.findFirst({
      where: { name: perm.name },
    });
    if (!exists) {
      const newPerm = await prisma.permission.create({ data: perm });
      console.log(`Permiso creado: ${perm.name}`);
      createdPermissions.push(newPerm);
    } else {
      createdPermissions.push(exists);
      console.log(`Permiso existente: ${perm.name}`);
    }
  }
  return createdPermissions;
}

async function assignPermissionsToRoles(roles, permissions) {
  for (const role of Object.values(roles)) {
    for (const perm of permissions) {
      const exists = await prisma.rolePermission.findUnique({
        where: {
          roleId_permissionId: { roleId: role.id, permissionId: perm.id },
        },
      });
      if (!exists) {
        await prisma.rolePermission.create({
          data: { roleId: role.id, permissionId: perm.id },
        });
        console.log(`Permiso ${perm.name} asignado al rol ${role.name}`);
      }
    }
  }
}

async function createRootUser(roles) {
  const rootRole = roles["Root"];
  if (!rootRole) {
    console.error("No se encontró el rol Root.");
    return;
  }
  const exists = await prisma.user.findUnique({
    where: { email: "root@mycad.mx" },
  });
  if (!exists) {
    const hashedPassword = await bcrypt.hash("adminadmin", 10);
    const rootUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        firstName: "Mycad",
        lastName: "Root",
        userName: "root",
        email: "root@mycad.mx",
        password: hashedPassword,
        roleId: rootRole.id,
        enabled: true,
      },
    });
    console.log(`Usuario root creado: ${rootUser.email}`);
  } else {
    console.log("Usuario root ya existe.");
  }
}

async function main() {
  console.log("Iniciando seeder de mycad...");
  // Crear condiciones (si aplica)
  await createConditions();

  // Crear roles y almacenarlos en un objeto
  const roles = await createRoles();

  // Crear permisos
  const permissions = await createPermissions();

  // Asignar todos los permisos a cada rol
  await assignPermissionsToRoles(roles, permissions);

  // Crear usuario root
  await createRootUser(roles);

  console.log("Seeder completado.");
}

main()
  .catch((e) => {
    console.error("Error en el seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
