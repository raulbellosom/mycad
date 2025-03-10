const usersColumns = [
  {
    id: 'photo',
    value: 'Foto',
    type: 'image',
  },
  {
    id: 'firstName',
    value: 'Nombre',
    order: 'asc',
    type: 'text',
  },
  {
    id: 'lastName',
    value: 'Apellido',
    order: 'asc',
    type: 'text',
  },
  {
    id: 'email',
    value: 'Correo',
    order: 'asc',
    type: 'text',
  },
  {
    id: 'userName',
    value: 'Usuario',
    order: 'asc',
    type: 'text',
  },
  {
    id: 'phone',
    value: 'Teléfono',
    order: 'asc',
    type: 'text',
  },
  {
    id: 'role.name',
    value: 'Rol',
    order: 'asc',
    type: 'text',
  },
  {
    id: 'status',
    value: 'Estado',
    order: 'asc',
    type: 'boolean',
  },
  {
    id: 'actions',
    value: 'Acciones',
    type: 'actions',
    classes: 'text-center',
  },
];

export default usersColumns;
