import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration based on Swagger documentation
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage directly
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      
      // Debug üçün
      console.log('Request headers:', Object.fromEntries(headers.entries()));
      
      return headers;
    },
  }),
  tagTypes: ['User', 'Order', 'Customer', 'Courier', 'Report', 'Product', 'Category'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (credentials) => ({
        url: '/users/login', // relative to baseUrl
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: '/users/register', // relative to baseUrl
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/users/${id}`, // relative to baseUrl
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    

    // Customer endpoints
    getCustomers: builder.query({
      query: (params) => ({
        url: '/customers',
        params,
      }),
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
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
      query: () => '/customers/export',
      providesTags: ['Customer'],
    }),

    getCustomerCount: builder.query({
      query: () => '/customers/count',
      providesTags: ['Customer'],
    }),

    // Courier endpoints
    getCouriers: builder.query({
      query: (params) => ({
        url: '/api/couriers',
        params,
      }),
      providesTags: ['Courier'],
    }),

    getCourierById: builder.query({
      query: (id) => `/api/couriers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courier', id }],
    }),

    createCourier: builder.mutation({
      query: (courierData) => ({
        url: '/api/couriers',
        method: 'POST',
        body: courierData,
      }),
      invalidatesTags: ['Courier'],
    }),

    updateCourier: builder.mutation({
      query: ({ id, ...courierData }) => ({
        url: `/api/couriers/${id}`,
        method: 'PUT',
        body: courierData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Courier', id }],
    }),

    deleteCourier: builder.mutation({
      query: (id) => ({
        url: `/api/couriers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courier'],
    }),

    

   

    // File upload endpoints
    uploadFile: builder.mutation({
      query: (fileData) => ({
        url: '/api/files/upload',
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
        url: '/api/search/products',
        params: { q: searchTerm },
      }),
      providesTags: ['Product'],
    }),

    searchOrders: builder.query({
      query: (searchTerm) => ({
        url: '/api/search/orders',
        params: { q: searchTerm },
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
  useRefreshTokenMutation,
  

  
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
  
  // Courier hooks
  useGetCouriersQuery,
  useGetCourierByIdQuery,
  useCreateCourierMutation,
  useUpdateCourierMutation,
  useDeleteCourierMutation,
  

  
  // File upload hooks
  useUploadFileMutation,
  
  // Search hooks
  useSearchProductsQuery,
  useSearchOrdersQuery,
} = apiSlice;
