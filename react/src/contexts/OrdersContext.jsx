import { createContext, useContext, useState, useEffect } from 'react';
import { useGetCustomersQuery } from '../services/apiSlice';
// import { useGetOrdersQuery } from '../services/apiSlice'; // Bu endpoint hələ yoxdur

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [couriers, setCouriers] = useState([]);

  // Fetch data from API
  const { data: customersData, isLoading: customersLoading } = useGetCustomersQuery();
  // const { data: couriersData, isLoading: couriersLoading } = useGetCouriersQuery(); // Hələ hazır deyil
  // const { data: ordersData, isLoading: ordersLoading, error: ordersError } = useGetOrdersQuery(); // Bu endpoint hələ yoxdur

  // Update local state when API data changes
  useEffect(() => {
    if (customersData) {
      setCustomers(customersData);
    }
  }, [customersData]);

  // useEffect(() => {
  //   if (couriersData) {
  //     setCouriers(couriersData);
  //   }
  // }, [couriersData]); // Hələ hazır deyil

  // useEffect(() => {
  //   if (ordersData) {
  //     setOrders(ordersData);
  //   }
  // }, [ordersData]); // Bu endpoint hələ yoxdur

  // Error handling for orders API
  // useEffect(() => {
  //   if (ordersError) {
  //     console.error('Orders API Error:', ordersError);
  //     // Əgər orders API xəta versə, boş array istifadə edirik
  //     setOrders([]);
  //   }
  // }, [ordersError]); // Bu endpoint hələ yoxdur

  const isLoading = customersLoading; // ordersLoading hələ yoxdur

  return (
    <OrdersContext.Provider value={{ 
      customers, 
      setCustomers, 
      orders, 
      setOrders, 
      couriers, 
      setCouriers,
      isLoading 
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
