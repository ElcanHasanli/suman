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
      query: () => '/customers/all',
      providesTags: ['Customer'],
    }),

    getCustomerById: builder.query({
      query: (id) => `/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: builder.mutation({
      query: (customerData) => ({
        url: '/customers/add',
        method: 'POST',
        body: customerData,
      }),
      invalidatesTags: ['Customer'],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `/customers/update/${id}`,
        method: 'PATCH',
        body: customerData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }, 'Customer'],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/customers/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),

    // Customer specific endpoints
    searchCustomerByPhone: builder.query({
      query: (phone) => ({
        url: '/customers/search-by-phone',
        params: { phone },
      }),
      providesTags: ['Customer'],
    }),

    searchCustomerByNameSurname: builder.query({
      query: ({ name, surname }) => ({
        url: '/customers/search-by-name-surname',
        params: { name, surname },
      }),
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

    // Additional customer endpoints
    getAllCustomers: builder.query({
      query: () => '/customers/all',
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

    // File upload endpoints
    uploadFile: builder.mutation({
      query: (fileData) => ({
        url: '/files/upload',
        method: 'POST',
        body: fileData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    }),

    // Search endpoints
    searchProducts: builder.query({
      query: (searchTerm) => ({
        url: '/search/products',
        params: { q: searchTerm },
      }),
      providesTags: ['Product'],
    }),

    searchOrders: builder.query({
      query: (searchTerm) => ({
        url: '/search/orders',
        params: { q: searchTerm },
      }),
      providesTags: ['Order'],
    }),

    // Order endpoints - Swagger-ə uyğun
    // getOrders: builder.query({
    //   query: () => '/orders/all', // Bu endpoint hələ yoxdur
    //   providesTags: ['Order'],
    //   retry: false,
    //   transformErrorResponse: () => [],
    // }),

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
      }),
      invalidatesTags: ['Order'],
    }),

    // Order search and filter endpoints
    searchOrdersByCustomer: builder.query({
      query: (customerId) => ({
        url: '/orders/search-by-customer',
        params: { customerId },
      }),
      providesTags: ['Order'],
    }),

    searchOrdersByDate: builder.query({
      query: (date) => ({
        url: '/orders/search-by-date',
        params: { date },
      }),
      providesTags: ['Order'],
    }),

    getOrderCount: builder.query({
      query: () => '/orders/count',
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
  useSearchCustomerByPhoneQuery,
  useSearchCustomerByNameSurnameQuery,
  useExportCustomersQuery,
  useGetCustomerCountQuery,
  useGetAllCustomersQuery,
  
  // Courier hooks - hələ hazır deyil
  // useGetCouriersQuery,
  // useGetCourierByIdQuery,
  // useCreateCourierMutation,
  // useUpdateCourierMutation,
  // useDeleteCourierMutation,
  
  // Order hooks
  // useGetOrdersQuery, // Bu endpoint hələ yoxdur
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useSearchOrdersByCustomerQuery,
  useSearchOrdersByDateQuery,
  // useGetOrderCountQuery, // Bu endpoint hələ yoxdur
  
  // File upload hooks
  useUploadFileMutation,
  
  // Search hooks
  useSearchProductsQuery,
  useSearchOrdersQuery,
} = apiSlice;