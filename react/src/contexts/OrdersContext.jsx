import { createContext, useContext, useState } from 'react';

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);

  return (
    <OrdersContext.Provider value={{ customers, setCustomers, orders, setOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
