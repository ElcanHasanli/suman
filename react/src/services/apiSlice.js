import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration based on Swagger documentation
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://62.171.154.6:9090', // Swagger-dən birbaşa URL
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Order', 'Customer', 'Courier', 'Report', 'Product', 'Category'],
  endpoints: (builder) => ({
    // Auth endpoints (əgər varsa)
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // Customer endpoints - Swagger-ə uyğun
    getCustomers: builder.query({
      query: () => ({
        url: '/customers/all',
        params: { lang: 'az' },
      }),
      transformResponse: (raw) => {
        const customers = Array.isArray(raw) ? raw : (raw?.response ?? []);
        return customers.map(customer => ({
          id: customer.id,
          firstName: customer.name,
          lastName: customer.surname,
          phone: customer.phoneNumber,
          address: customer.address,
          pricePerBidon: customer.price,
          currency: customer.currency,
          status: customer.status
        }));
      },
      providesTags: ['Customer'],
    }),

    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      transformResponse: (raw) => {
        const customer = raw?.response || raw;
        return {
          id: customer.id,
          firstName: customer.name,
          lastName: customer.surname,
          phone: customer.phoneNumber,
          address: customer.address,
          pricePerBidon: customer.price,
          currency: customer.currency,
          status: customer.status
        };
      },
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: builder.mutation({
      query: (customerData) => ({
        url: '/customers/add',
        method: 'POST',
        body: {
          name: customerData.firstName,
          surname: customerData.lastName,
          phoneNumber: customerData.phone,
          address: customerData.address,
          price: customerData.pricePerBidon || 5,
          currency: customerData.currency || 'AZN',
          status: customerData.status || 0
        },
      }),
      invalidatesTags: ['Customer'],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `/customers/update/${id}`,
        method: 'PATCH',
        body: {
          name: customerData.firstName,
          surname: customerData.lastName,
          phoneNumber: customerData.phone,
          address: customerData.address,
          price: customerData.pricePerBidon,
          currency: customerData.currency,
          status: customerData.status
        },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, 'Customer'],
    }),

    // Soft delete customer (uses existing DELETE endpoint)
    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/delete/${id}`,
        method: 'DELETE',
        params: { lang: 'az' },
      }),
      transformResponse: (response) => {
        // Swagger response: {"code":4002,"response":null,"message":"CUSTOMER_WAS_DELETED","status":"NO_CONTENT"}
        return response;
      },
      invalidatesTags: ['Customer'],
    }),

    // Restore soft deleted customer - Backend-də mövcud deyil, Swagger-də yoxdur
    // restoreCustomer: builder.mutation({
    //   query: (id) => ({
    //     url: `/customers/restore/${id}`,
    //     method: 'PATCH',
    //     params: { lang: 'az' },
    //   }),
    //   invalidatesTags: ['Customer'],
    // }),

    // Get deleted customers - Backend-də mövcud deyil, Swagger-də yoxdur
    // getDeletedCustomers: builder.query({
    //   query: () => ({
    //     url: '/customers/deleted',
    //     params: { lang: 'az' },
    //   }),
    //   transformResponse: (raw) => Array.isArray(raw) ? raw : (raw?.response ?? []),
    //   providesTags: ['Customer'],
    // }),

    // Customer specific endpoints
    searchCustomerByPhone: builder.query({
      query: (phone) => ({
        url: '/customers/search-by-phone',
        params: { phone },
      }),
      transformResponse: (raw) => {
        const customers = Array.isArray(raw) ? raw : (raw?.response ?? []);
        return customers.map(customer => ({
          id: customer.id,
          firstName: customer.name,
          lastName: customer.surname,
          phone: customer.phoneNumber,
          address: customer.address,
          pricePerBidon: customer.price,
          currency: customer.currency,
          status: customer.status
        }));
      },
      providesTags: ['Customer'],
    }),

    searchCustomerByNameSurname: builder.query({
      query: ({ name, surname }) => ({
        url: '/customers/search-by-name-surname',
        params: { name, surname },
      }),
      transformResponse: (raw) => {
        const customers = Array.isArray(raw) ? raw : (raw?.response ?? []);
        return customers.map(customer => ({
          id: customer.id,
          firstName: customer.name,
          lastName: customer.surname,
          phone: customer.phoneNumber,
          address: customer.address,
          pricePerBidon: customer.price,
          currency: customer.currency,
          status: customer.status
        }));
      },
      providesTags: ['Customer'],
    }),

    exportCustomers: builder.query({
      query: () => ({
        url: '/customers/export',
        responseHandler: 'blob', // Excel faylı üçün
      }),
      providesTags: ['Customer'],
    }),

    getCustomerCount: builder.query({
      query: () => '/customers/count',
      providesTags: ['Customer'],
    }),

    // Customer loan endpoints - Swagger-də var
    getLoanCarboyCount: builder.query({
      query: () => '/customers/loan/carboy/count',
      providesTags: ['Customer'],
    }),

    getCarboyLoans: builder.query({
      query: () => '/customers/carboy/loans',
      transformResponse: (raw) => Array.isArray(raw) ? raw : (raw?.response ?? []),
      providesTags: ['Customer'],
    }),

    // Additional customer endpoints
    getAllCustomers: builder.query({
      query: () => ({
        url: '/customers/all',
        params: { lang: 'az' },
      }),
      transformResponse: (raw) => Array.isArray(raw) ? raw : (raw?.response ?? []),
      providesTags: ['Customer'],
    }),

    // Courier endpoints - hələ hazır deyil, test məlumatlarından istifadə edirik
    // getCouriers: builder.query({
    //   query: (params) => ({
    //     url: '/couriers',
    //     params,
    //   }),
    //   providesTags: ['Courier'],
    // }),

    // File upload endpoints - Backend-də mövcud deyil, Swagger-də yoxdur
    // uploadFile: builder.mutation({
    //   query: (fileData) => ({
    //     url: '/files/upload',
    //     method: 'POST',
    //     body: fileData,
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   }),
    // }),

    // Search endpoints - Backend-də mövcud deyil, Swagger-də yoxdur
    // searchProducts: builder.query({
    //   query: (searchTerm) => ({
    //     url: '/search/products',
    //     params: { q: searchTerm },
    //   }),
    //   providesTags: ['Product'],
    // }),

    // searchOrders: builder.query({
    //   query: (searchTerm) => ({
    //     url: '/search/orders',
    //     params: { q: searchTerm },
    //   }),
    //   providesTags: ['Order'],
    // }),

    // Order endpoints - Swagger-ə uyğun
    getOrders: builder.query({
      query: () => ({
        url: '/orders/all',
        params: { lang: 'az' },
      }),
      transformResponse: (raw) => Array.isArray(raw) ? raw : (raw?.response ?? []),
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/orders/add',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...orderData }) => ({
        url: `/orders/update/${id}`,
        method: 'PATCH',
        body: orderData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, 'Order'],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/delete/${id}`,
        method: 'DELETE',
        params: { lang: 'az' }, // Swagger-də lang parametri var
      }),
      transformResponse: (response) => {
        // Swagger response format-ına uyğun
        return response;
      },
      invalidatesTags: ['Order'],
    }),

    // Order search and filter endpoints - Backend-də mövcud deyil, Swagger-də yoxdur
    // searchOrdersByCustomer: builder.query({
    //   query: (customerId) => ({
    //     url: '/orders/search-by-customer',
    //     params: { customerId },
    //   }),
    //   providesTags: ['Order'],
    // }),

    // searchOrdersByDate: builder.query({
    //   query: (date) => ({
    //     url: '/orders/search-by-date',
    //     params: { date },
    //   }),
    //   providesTags: ['Order'],
    // }),

    getOrderCount: builder.query({
      query: () => '/orders/count',
      providesTags: ['Order'],
    }),

    // Courier endpoints - Swagger-ə uyğun
    getCouriers: builder.query({
      query: () => '/couriers/all',
      providesTags: ['Courier'],
    }),

    getCourierById: builder.query({
      query: (id) => `/couriers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courier', id }],
    }),

    // Courier order management endpoints
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `/orders/${orderId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),

    completeOrderByCourier: builder.mutation({
      query: ({ orderId, ...orderData }) => ({
        url: `/orders/${orderId}/complete`,
        method: 'PATCH',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    sendWhatsAppNotification: builder.mutation({
      query: ({ phone, message }) => ({
        url: '/notifications/whatsapp',
        method: 'POST',
        body: { phone, message },
      }),
    }),

    getCourierOrders: builder.query({
      query: (courierId) => `/orders/courier/${courierId}`,
      providesTags: ['Order'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth hooks
  useLoginMutation,
  useRegisterMutation,
  useGetUserByIdQuery,
  
  // Customer hooks
  useGetCustomersQuery,
  useGetCustomerByIdQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
  // useRestoreCustomerMutation, // Backend-də mövcud deyil
  // useGetDeletedCustomersQuery, // Backend-də mövcud deyil
  useSearchCustomerByPhoneQuery,
  useSearchCustomerByNameSurnameQuery,
  useExportCustomersQuery,
  useGetCustomerCountQuery,
  useGetAllCustomersQuery,
  useGetLoanCarboyCountQuery,
  useGetCarboyLoansQuery,
  
  // Courier hooks
  useGetCouriersQuery,
  useGetCourierByIdQuery,
  
  // Courier order management hooks
  useUpdateOrderStatusMutation,
  useCompleteOrderByCourierMutation,
  useSendWhatsAppNotificationMutation,
  useGetCourierOrdersQuery,
  
  // Order hooks
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  // useSearchOrdersByCustomerQuery, // Backend-də mövcud deyil
  // useSearchOrdersByDateQuery, // Backend-də mövcud deyil
  useGetOrderCountQuery,
  
  // File upload hooks - Backend-də mövcud deyil
  // useUploadFileMutation,
  
  // Search hooks - Backend-də mövcud deyil
  // useSearchProductsQuery,
  // useSearchOrdersQuery,
} = apiSlice;