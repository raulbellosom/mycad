import React from 'react'

const CreateServicesReport = () => {
  return (
    <>
      <section className="flex flex-col gap-3 bg-white shadow-md rounded-md dark:bg-gray-900 p-3 antialiased">
        <TableHeader
          icon={MdMiscellaneousServices}
          title="Crear nuevo reporte"
          actions={[
            {
              label: 'Nuevo',
              href: '/reports/services/create',
              color: 'mycad',
              icon: IoMdAdd,
              filled: true,
            },
          ]}
        />
      </section>
    </>
  );
}

export default CreateServicesReport
