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
    // Backend-də /customers GET endpoint olmadığı üçün boş array qaytarırıq
    // Real həll üçün backend-də /customers GET endpoint lazımdır
    getCustomers: builder.query({
      queryFn: async () => {
        try {
          // Backend-də /customers GET endpoint olmadığı üçün boş array qaytarırıq
          // Bu endpoint backend-də əlavə edilməlidir
          return { data: [] };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: error.message } };
        }
      },
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

    // Digər endpointlər (əgər lazımsa)
    getCouriers: builder.query({
      query: (params) => ({
        url: '/couriers',
        params,
      }),
      providesTags: ['Courier'],
    }),

    getCourierById: builder.query({
      query: (id) => `/couriers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courier', id }],
    }),

    createCourier: builder.mutation({
      query: (courierData) => ({
        url: '/couriers',
        method: 'POST',
        body: courierData,
      }),
      invalidatesTags: ['Courier'],
    }),

    updateCourier: builder.mutation({
      query: ({ id, ...courierData }) => ({
        url: `/couriers/${id}`,
        method: 'PUT',
        body: courierData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Courier', id }],
    }),

    deleteCourier: builder.mutation({
      query: (id) => ({
        url: `/couriers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courier'],
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