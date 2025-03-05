import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as ProSidebar,
  Menu,
  MenuItem,
  menuClasses,
  SubMenu,
} from 'react-pro-sidebar';
import {
  FaTachometerAlt,
  FaCar,
  FaUserCircle,
  FaSignOutAlt,
  FaUserCog,
  FaUserShield,
  FaToolbox,
  FaAddressBook,
  FaFileContract,
} from 'react-icons/fa';
import { useAuthContext } from '../../context/AuthContext';
import AccountSidebar from './AccountSidebar';
import BgPattern from '../../assets/bg/bg_pattern_dark.png';
import { Button } from 'flowbite-react';
import Navbar from '../navbar/Navbar';
import MainLayout from '../../Layout/MainLayout';
import { BiCategory } from 'react-icons/bi';
import {
  MdAddBox,
  MdAdminPanelSettings,
  MdGarage,
  MdMiscellaneousServices,
} from 'react-icons/md';
import useCheckPermissions from '../../hooks/useCheckPermissions';
import { TbNotebook } from 'react-icons/tb';
import { RiContractFill } from 'react-icons/ri';

const themes = {
  light: {
    sidebar: {
      backgroundColor: '#0D0D0D',
      color: '#ffffff',
    },
    menu: {
      menuContent: '#0D0D0D',
      icon: '#ffffff',
      hover: {
        backgroundColor: '#f43f5e',
        color: '#fff',
      },
      disabled: {
        color: '#9fb6cf',
      },
      active: {
        color: '#FFF',
        backgroundColor: '#f43f5e',
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: '#0b2948',
      color: '#8ba1b7',
    },
    menu: {
      menuContent: '#082440',
      icon: '#59d0ff',
      hover: {
        backgroundColor: '#00458b',
        color: '#b6c8d9',
      },
      disabled: {
        color: '#3e5e7e',
      },
    },
  },
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const Sidebar = ({ children }) => {
  const location = useLocation();
  const { user, logout } = useAuthContext();
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);
  const [broken, setBroken] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [hasImage, setHasImage] = useState(true);
  const [theme, setTheme] = useState('light');

  const handleRTLChange = (e) => {
    setRtl(e.target.checked);
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.checked ? 'dark' : 'light');
  };

  const handleImageChange = (e) => {
    setHasImage(e.target.checked);
  };

  const menuItemStyles = {
    root: {
      fontSize: '16px',
      fontWeight: 600,
    },
    icon: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      [`&.${menuClasses.active}`]: {
        color: themes[theme].menu.active.color,
      },
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(
              themes[theme].menu.menuContent,
              hasImage && !collapsed ? 0.15 : 1,
            )
          : '',
    }),
    SubMenuExpandIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
      transform: ' scale(1.75)',
    },
    button: {
      [`&:hover, &${menuClasses.SubMenuExpandIcon}`]: {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          hasImage ? 0.75 : 1,
        ),
        color: themes[theme].menu.hover.color,
      },
      [`&.ps-active`]: {
        backgroundColor: hexToRgba(
          themes[theme].menu.active.backgroundColor,
          hasImage ? 0.75 : 1,
        ),
        color: themes[theme].menu.active.color,
      },
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },

    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  const isActivePath = (path) => {
    const currentPath = location.pathname;

    if (currentPath === '/' && path === '/dashboard') {
      return true;
    }

    if (currentPath === path) {
      return true;
    }

    if (
      path !== '/' &&
      currentPath.startsWith(path) &&
      currentPath.length > path.length &&
      currentPath[path.length] === '/'
    ) {
      return false;
    }

    return false;
  };

  const isDashBoardPermission = useCheckPermissions('view_dashboard');
  const isUsersPermission = useCheckPermissions('view_users');
  const isAccountPermission = useCheckPermissions('view_account');
  const isRolesPermission = useCheckPermissions('view_roles');
  const isVehiclesPermission = useCheckPermissions('view_vehicles');
  const isCreateVehiclesPermission = useCheckPermissions('create_vehicles');
  const isModelsPermission = useCheckPermissions('view_vehicles_models');
  const isBrandsPermission = useCheckPermissions('view_vehicles_brands');
  const isTypesPermission = useCheckPermissions('view_vehicles_types');
  const isConditionsPermission = useCheckPermissions(
    'view_vehicles_conditions',
  );

  const isCatalogsPermission =
    isModelsPermission.hasPermission ||
    isBrandsPermission.hasPermission ||
    isTypesPermission.hasPermission ||
    isConditionsPermission.hasPermission;

  return (
    <div
      style={{
        display: 'flex',
        direction: rtl ? 'rtl' : 'ltr',
        height: '100dvh',
      }}
    >
      <ProSidebar
        collapsed={collapsed}
        toggled={toggled}
        onBackdropClick={() => setToggled(false)}
        onBreakPoint={setBroken}
        image={BgPattern}
        rtl={rtl}
        breakPoint="md"
        backgroundColor={hexToRgba(
          themes[theme].sidebar.backgroundColor,
          hasImage ? 0.2 : 1,
        )}
        rootStyles={{
          color: themes[theme].sidebar.color,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <AccountSidebar
              role={user.email}
              name={user.firstName + ' ' + user.lastName}
              photo={user.photo}
              collapsed={collapsed}
              broken={broken}
            />
            <div className="border-t md:border-none border-gray-300 py-1" />
            <Menu menuItemStyles={menuItemStyles}>
              {/* {isDashBoardPermission.hasPermission && (
                <MenuItem
                  component={<Link to={'/dashboard'} />}
                  active={isActivePath('/dashboard')}
                  icon={<FaTachometerAlt size={23} />}
                >
                  Dashboard
                </MenuItem>
              )} */}
              {(isCatalogsPermission ||
                isVehiclesPermission.hasPermission ||
                isCreateVehiclesPermission.hasPermission) && (
                <SubMenu label="Vehículos" icon={<MdGarage size={23} />}>
                  {isVehiclesPermission.hasPermission && (
                    <MenuItem
                      icon={<MdAddBox size={23} />}
                      active={isActivePath('/vehicles/create')}
                      component={<Link to={'/vehicles/create'} />}
                      onClick={() => {
                        setToggled(false);
                      }}
                    >
                      Nuevo Vehículo
                    </MenuItem>
                  )}
                  {isVehiclesPermission.hasPermission && (
                    <MenuItem
                      icon={<FaCar size={23} />}
                      active={isActivePath('/vehicles')}
                      component={<Link to={'/vehicles'} />}
                      onClick={() => {
                        setToggled(false);
                      }}
                    >
                      Mis Vehículos
                    </MenuItem>
                  )}
                  {isCatalogsPermission && (
                    <MenuItem
                      icon={<BiCategory size={23} />}
                      active={isActivePath('/catalogs')}
                      component={<Link to={'/catalogs'} />}
                      onClick={() => {
                        setToggled(false);
                      }}
                    >
                      Catálogos
                    </MenuItem>
                  )}
                </SubMenu>
              )}
              <SubMenu label="Rentas" icon={<RiContractFill size={23} />}>
                <MenuItem
                  icon={<FaFileContract size={23} />}
                  active={isActivePath('/rentals')}
                  component={<Link to={'/rentals'} />}
                  onClick={() => {
                    setToggled(false);
                  }}
                >
                  Rentas
                </MenuItem>
                <MenuItem
                  icon={<FaAddressBook size={23} />}
                  active={isActivePath('/clients')}
                  component={<Link to={'/clients'} />}
                  onClick={() => {
                    setToggled(false);
                  }}
                >
                  Clientes
                </MenuItem>
              </SubMenu>
              <SubMenu label="Reportes" icon={<TbNotebook size={23} />}>
                <MenuItem
                  icon={<MdMiscellaneousServices size={23} />}
                  active={isActivePath('/reports/services')}
                  component={<Link to={'/reports/services'} />}
                  onClick={() => {
                    setToggled(false);
                  }}
                >
                  Servicios
                </MenuItem>
                <MenuItem
                  icon={<FaToolbox size={23} />}
                  active={isActivePath('/reports/repairs')}
                  component={<Link to={'/reports/repairs'} />}
                  onClick={() => {
                    setToggled(false);
                  }}
                >
                  Reparaciones
                </MenuItem>
              </SubMenu>
              {(isUsersPermission.hasPermission ||
                isRolesPermission.hasPermission) && (
                <SubMenu
                  label="Usuarios"
                  icon={<MdAdminPanelSettings size={23} />}
                >
                  {isUsersPermission.hasPermission && (
                    <MenuItem
                      component={<Link to={'/users'} />}
                      active={isActivePath('/users')}
                      icon={<FaUserCircle size={23} />}
                    >
                      Usuarios
                    </MenuItem>
                  )}
                  {isRolesPermission.hasPermission && (
                    <MenuItem
                      component={<Link to={'/roles'} />}
                      active={isActivePath('/roles')}
                      icon={<FaUserShield size={23} />}
                    >
                      Roles
                    </MenuItem>
                  )}
                </SubMenu>
              )}
              {isAccountPermission && (
                <MenuItem
                  component={<Link to={'/account-settings'} />}
                  active={isActivePath('/account-settings')}
                  icon={<FaUserCog size={23} />}
                >
                  Editar Perfil
                </MenuItem>
              )}
            </Menu>
          </div>
          <div className="p-4">
            <Button
              type="button"
              gradientDuoTone="pinkToOrange"
              className="w-full border-none truncate flex justify-start items-center"
              onClick={logout}
            >
              <div
                className="w-full"
                style={{
                  display: 'flex',
                  justifyContent: 'start',
                  alignItems: 'center',
                }}
              >
                <i>
                  <FaSignOutAlt size={18} className="text-lg mt-0.5" />
                </i>
                {collapsed ? null : <span className="ml-4">Cerrar Sesión</span>}
              </div>
            </Button>
          </div>
        </div>
      </ProSidebar>
      <div className="flex-1 min-h-0 max-h-dvh overflow-hidden relative">
        <Navbar
          collapsed={collapsed}
          setCollapsed={() => setCollapsed(!collapsed)}
          toggled={toggled}
          setToggled={() => setToggled(!toggled)}
          broken={broken}
          user={user}
        />
        <div className="flex-1 overflow-auto pt-16 h-full">
          <MainLayout>{children}</MainLayout>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
