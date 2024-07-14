import { createContext, useContext } from 'react';

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  register: () => {},
  dispatch: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default AuthContext;
