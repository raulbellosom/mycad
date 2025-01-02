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
// const Login = lazy(() => import('../pages/login/Login'));
// const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
// const Vehicles = lazy(() => import('../pages/vehicles/Vehicles'));
// const CreateVehicle = lazy(() => import('../pages/vehicles/CreateVehicle'));
// const UpdateVehicle = lazy(() => import('../pages/vehicles/UpdateVehicle'));
// const ViewVehicle = lazy(() => import('../pages/vehicles/ViewVehicle'));
// const Catalogs = lazy(() => import('../pages/vehicles/catalogs/Catalogs'));
// const Account = lazy(() => import('../pages/account/Account'));
// const NotFound = lazy(() => import('../pages/notFound/NotFound'));

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
                  <Route path="/catalogs" element={<Catalogs />} />
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
