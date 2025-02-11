export const PermissionsByGroup = {
  vehicles: {
    name: 'Vehículos',
    permissions: [
      'view_vehicles',
      'create_vehicles',
      ,
      'edit_vehicles',
      'delete_vehicles',
    ],
  },
  vehicleConditions: {
    name: 'Condiciones de vehículos',
    permissions: [
      'view_vehicles_conditions',
      'create_vehicles_conditions',
      'edit_vehicles_conditions',
      'delete_vehicles_conditions',
    ],
  },
  vehicleBrands: {
    name: 'Marcas de vehículos',
    permissions: [
      'view_vehicles_brands',
      'create_vehicles_brands',
      'edit_vehicles_brands',
      'delete_vehicles_brands',
    ],
  },
  vehicleModels: {
    name: 'Modelos de vehículos',
    permissions: [
      'view_vehicles_models',
      'create_vehicles_models',
      'edit_vehicles_models',
      'delete_vehicles_models',
    ],
  },
  vehicleTypes: {
    name: 'Tipos de vehículos',
    permissions: [
      'view_vehicles_types',
      'create_vehicles_types',
      'edit_vehicles_types',
      'delete_vehicles_types',
    ],
  },
  users: {
    name: 'Usuarios',
    permissions: ['view_users', 'create_users', , 'edit_users', 'delete_users'],
  },
  roles: {
    name: 'Roles',
    permissions: ['view_roles', 'create_roles', 'edit_roles', 'delete_roles'],
  },
  account: {
    name: 'Configuracion de la cuenta',
    permissions: [
      'view_account',
      'edit_account',
      'change_password',
      'change_account_image',
    ],
  },
  dashboard: {
    name: 'Dashboard',
    permissions: ['view_dashboard'],
  },
  clients: {
    name: 'Clientes',
    permissions: [
      'view_clients',
      'create_clients',
      'edit_clients',
      'delete_clients',
    ],
  },
  rentals: {
    name: 'Rentas',
    permissions: [
      'view_rentals',
      'create_rentals',
      'edit_rentals',
      'delete_rentals',
    ],
  },
  serviceReports: {
    name: 'Reportes de Servicios',
    permissions: [
      'view_services_reports',
      'create_services_reports',
      'edit_services_reports',
      'delete_services_reports',
    ],
  },
  repairReports: {
    name: 'Reportes de Reparaciones',
    permissions: [
      'view_repairs_reports',
      'create_repairs_reports',
      'edit_repairs_reports',
      'delete_repairs_reports',
    ],
  },
};
