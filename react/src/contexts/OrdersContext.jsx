import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useGetCustomersQuery } from '../services/apiSlice';
// import { useGetOrdersQuery } from '../services/apiSlice'; // Bu endpoint hələ yoxdur

export const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  // Orders are stored per date as YYYY-MM-DD => Order[]
  const [ordersByDate, setOrdersByDate] = useState(() => {
    try {
      const raw = localStorage.getItem('ordersByDate');
      return raw ? JSON.parse(raw) : {};
    } catch (_) {
      return {};
    }
  });
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

  // Persist ordersByDate to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ordersByDate', JSON.stringify(ordersByDate));
    } catch (_) {
      // ignore persistence errors
    }
  }, [ordersByDate]);

  // Helpers for date-based order access
  const getOrdersForDate = (dateStr) => {
    if (!dateStr) return [];
    return ordersByDate[dateStr] || [];
  };

  const setOrdersForDate = (dateStr, ordersForDate) => {
    setOrdersByDate(prev => ({ ...prev, [dateStr]: ordersForDate }));
  };

  const addOrderForDate = (dateStr, order) => {
    setOrdersByDate(prev => {
      const existing = prev[dateStr] || [];
      const nextId = existing.length > 0 ? Math.max(...existing.map(o => Number(o.id) || 0)) + 1 : 1;
      const orderWithId = { ...order, id: order.id ?? nextId, date: dateStr };
      return { ...prev, [dateStr]: [...existing, orderWithId] };
    });
  };

  const removeOrderForDate = (dateStr, orderId) => {
    setOrdersByDate(prev => {
      const existing = prev[dateStr] || [];
      return { ...prev, [dateStr]: existing.filter(o => o.id !== orderId) };
    });
  };

  const updateOrderForDate = (dateStr, orderId, updates) => {
    setOrdersByDate(prev => {
      const existing = prev[dateStr] || [];
      return {
        ...prev,
        [dateStr]: existing.map(o => (o.id === orderId ? { ...o, ...updates } : o))
      };
    });
  };

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
      ordersByDate,
      setOrdersByDate,
      getOrdersForDate,
      setOrdersForDate,
      addOrderForDate,
      removeOrderForDate,
      updateOrderForDate,
      couriers,
      setCouriers,
      isLoading 
    }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
