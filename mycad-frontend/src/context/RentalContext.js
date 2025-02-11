import { createContext, useContext } from 'react';

const RentalContext = createContext();

export const useRentalContext = () => useContext(RentalContext);

export default RentalContext;
