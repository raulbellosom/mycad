import React from 'react';
import AuthProvider from './AuthProvider';
import UserProvider from './UserProvider';
import VehicleProvider from './VehicleProvider';
import LoadingProvider from './LoadingProvider';
import CatalogProvider from './CatalogProvider';
import RoleProvider from './RoleProvider';
import PermissionProvider from './PermissionProvider';
import ReportsProvider from './ReportsProvider';
import RepairReportsProvider from './RepairReportsProvider';
import ClientsProvider from './ClientsProvider';
import RentalProvider from './RentalProvider';

import { BreadcrumbProvider } from './BreadcrumbContext';

const SecurityProvider = ({ children }) => (
  <AuthProvider>
    <RoleProvider>
      <PermissionProvider>{children}</PermissionProvider>
    </RoleProvider>
  </AuthProvider>
);

const DataProvider = ({ children }) => (
  <UserProvider>
    <VehicleProvider>
      <CatalogProvider>
        <ReportsProvider>
          <RepairReportsProvider>
            <RentalProvider>
              <ClientsProvider>{children}</ClientsProvider>
            </RentalProvider>
          </RepairReportsProvider>
        </ReportsProvider>
      </CatalogProvider>
    </VehicleProvider>
  </UserProvider>
);

const AppProvider = ({ children }) => (
  <LoadingProvider>
    <SecurityProvider>
      <DataProvider>
        <BreadcrumbProvider>{children}</BreadcrumbProvider>
      </DataProvider>
    </SecurityProvider>
  </LoadingProvider>
);

export default AppProvider;
