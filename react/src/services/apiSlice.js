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
      query: () => '/customers/all?lang=az',
      providesTags: ['Customer'],
      transformResponse: (response) => {
        console.log('Get customers response:', response);
        // Backend response formatını düzəld
        if (response && response.response && Array.isArray(response.response)) {
          return response.response.map(customer => {
            console.log('Processing customer:', customer);
            const isDeleted = customer.status === 0;
            console.log('Customer isDeleted:', isDeleted, 'Status:', customer.status);
            return {
              ...customer,
              isDeleted: isDeleted
            };
          });
        }
        return response;
      },
    }),

    getCustomerById: builder.query({
      query: (id) => `/customers/${id}?lang=az`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
      transformResponse: (response) => {
        console.log('Get customer by ID response:', response);
        // Backend response formatını düzəld
        if (response && response.response) {
          return {
            ...response.response,
            isDeleted: response.response.status === 0
          };
        }
        return response;
      },
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
        url: `/customers/delete/${id}?lang=az`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Customer', id },
        'Customer',
        'getCustomers',
        'getAllCustomers'
      ],
      // Soft delete response-unu düzgün idarə et
      transformResponse: (response, meta, arg) => {
        console.log('Delete customer response:', response);
        if (response && (response.message === 'CUSTOMER_WAS_DELETED' || response.code === 4002)) {
          return { 
            success: true, 
            message: 'Müştəri uğurla silindi', 
            deletedId: arg 
          };
        }
        return response;
      },
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

    // Customer loan endpoints
    getCustomerLoanCarboyCount: builder.query({
      query: () => '/customers/loan/carboy/count',
      providesTags: ['Customer'],
    }),

    getCustomerCarboyLoans: builder.query({
      query: () => '/customers/carboy/loans',
      providesTags: ['Customer'],
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
    getOrders: builder.query({
      query: () => '/orders/all?lang=az',
      providesTags: ['Order'],
      transformResponse: (response) => {
        console.log('Get orders response:', response);
        // Backend response formatını düzəld
        if (response && response.response && Array.isArray(response.response)) {
          return response.response.map(order => {
            console.log('Processing order:', order);
            const isDeleted = order.status === 0 || order.orderStatus === 'DELETED';
            console.log('Order isDeleted:', isDeleted, 'Status:', order.status, 'OrderStatus:', order.orderStatus);
            return {
              ...order,
              isDeleted: isDeleted
            };
          });
        }
        return response;
      },
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
        url: `/orders/delete/${id}?lang=az`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Order', id },
        'Order',
        'getOrders'
      ],
      // Soft delete response-unu düzgün idarə et
      transformResponse: (response, meta, arg) => {
        console.log('Delete order response:', response);
        if (response && (response.message === 'ORDER_WAS_DELETED' || response.code === 4004)) {
          return { 
            success: true, 
            message: 'Sifariş uğurla ləğv edildi', 
            deletedId: arg 
          };
        }
        return response;
      },
    }),

    // Order count endpoint
    getOrderCount: builder.query({
      query: () => '/orders/count',
      providesTags: ['Order'],
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
  useGetCustomerLoanCarboyCountQuery,
  useGetCustomerCarboyLoansQuery,
  
  // Courier hooks
  useGetCouriersQuery,
  useGetCourierByIdQuery,
  
  // Order hooks
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetOrderCountQuery,
  useSearchOrdersByCustomerQuery,
  useSearchOrdersByDateQuery,
  
  // File upload hooks
  useUploadFileMutation,
  
  // Search hooks
  useSearchProductsQuery,
  useSearchOrdersQuery,
} = apiSlice;