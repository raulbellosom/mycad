import React, { Suspense, lazy, useContext } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import LoadingModal from '../components/loadingModal/LoadingModal';
import Sidebar from '../components/sidebar/Sidebar';
import ProtectedRoute from './ProtectedRoute';

import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import Vehicles from '../pages/vehicles/Vehicles';
import CreateVehicle from '../pages/vehicles/CreateVehicle';
import UpdateVehicle from '../pages/vehicles/UpdateVehicle';
import ViewVehicle from '../pages/vehicles/ViewVehicle';
import Catalogs from '../pages/vehicles/catalogs/Catalogs';
import Account from '../pages/account/Account';
import Users from '../pages/users/Users';
import NotFound from '../pages/notFound/NotFound';
import Roles from '../pages/roles/Roles';
import ServicesReport from '../pages/reports/servicesReport/ServicesReport';
import CreateServicesReport from '../pages/reports/servicesReport/CreateServicesReport';
import UpdateServicesReport from '../pages/reports/servicesReport/UpdateServicesReport';
import ViewServicesReport from '../pages/reports/servicesReport/ViewServicesReport';
import RepairReports from '../pages/reports/repairReport/RepairReport';
import CreateRepairReport from '../pages/reports/repairReport/CreateRepairReport';
import UpdateRepairReport from '../pages/reports/repairReport/UpdateRepairReport';
import ViewRepairReport from '../pages/reports/repairReport/ViewRepairReport';
import Clients from '../pages/clients/Clients';
import Rentals from '../pages/rentals/Rentals';
import CreateRental from '../pages/rentals/CreateRental';

const AppRouter = () => {
  const { user } = useContext(AuthContext);

  return (
    // <div className="min-h-dvh h-screen overflow-hidden w-full">
    <>
      <Router>
        <Suspense fallback={<LoadingModal loading={true} />}>
          {user ? <AuthorizedRoute user={user} /> : <UnauthorizedRoute />}
        </Suspense>
      </Router>
    </>
  );
};

const AuthorizedRoute = ({ user }) => {
  return (
    <Routes>
      <Route
        path="*"
        element={
          <>
            <Sidebar>
              <Routes>
                <Route element={<ProtectedRoute user={user} />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/account-settings" element={<Account />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/vehicles/create" element={<CreateVehicle />} />
                  <Route
                    path="/vehicles/edit/:id"
                    element={<UpdateVehicle />}
                  />
                  <Route path="/vehicles/view/:id" element={<ViewVehicle />} />
                  <Route
                    path="/reports/services"
                    element={<ServicesReport />}
                  />
                  <Route
                    path="/reports/services/create"
                    element={<CreateServicesReport />}
                  />
                  <Route
                    path="/reports/services/edit/:id"
                    element={<UpdateServicesReport />}
                  />
                  <Route
                    path="/reports/services/view/:id"
                    element={<ViewServicesReport />}
                  />
                  <Route path="/reports/repairs" element={<RepairReports />} />
                  <Route
                    path="/reports/repairs/create"
                    element={<CreateRepairReport />}
                  />
                  <Route
                    path="/reports/repairs/edit/:id"
                    element={<UpdateRepairReport />}
                  />
                  <Route
                    path="/reports/repairs/view/:id"
                    element={<ViewRepairReport />}
                  />
                  <Route path="/catalogs" element={<Catalogs />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/rentals" element={<Rentals />} />
                  <Route path="/rentals/create" element={<CreateRental />} />
                  <Route path="/roles" element={<Roles />} />
                  <Route
                    path="/login"
                    element={
                      <>
                        <Navigate to={'/'} replace={true} />
                      </>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Sidebar>
          </>
        }
      />
    </Routes>
  );
};

const UnauthorizedRoute = () => {
  return (
    <Routes>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
