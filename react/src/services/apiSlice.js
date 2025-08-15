import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration based on Swagger documentation
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5173', // Vite proxy üçün
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth?.token;
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
        url: '/api/users/login', // Vite proxy vasitəsilə /users/login-ə yönləndiriləcək
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    
    register: builder.mutation({
      query: (userData) => ({
        url: '/api/users/register', // Vite proxy vasitəsilə /users/register-ə yönləndiriləcək
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/api/users/${id}`, // Vite proxy vasitəsilə /users/{id}-ə yönləndiriləcək
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // User endpoints
    getProfile: builder.query({
      query: () => '/api/users/profile',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation({
      query: (userData) => ({
        url: '/api/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    getUsers: builder.query({
      query: (params) => ({
        url: '/api/users',
        params,
      }),
      providesTags: ['User'],
    }),

    getUserById: builder.query({
      query: (id) => `/api/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation({
      query: (userData) => ({
        url: '/api/users',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...userData }) => ({
        url: `/api/users/${id}`,
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/api/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Product endpoints
    getProducts: builder.query({
      query: (params) => ({
        url: '/api/products',
        params,
      }),
      providesTags: ['Product'],
    }),

    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),

    createProduct: builder.mutation({
      query: (productData) => ({
        url: '/api/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: ['Product'],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...productData }) => ({
        url: `/api/products/${id}`,
        method: 'PUT',
        body: productData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/api/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Category endpoints
    getCategories: builder.query({
      query: () => '/api/categories',
      providesTags: ['Category'],
    }),

    getCategoryById: builder.query({
      query: (id) => `/api/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    createCategory: builder.mutation({
      query: (categoryData) => ({
        url: '/api/categories',
        method: 'POST',
        body: categoryData,
      }),
      invalidatesTags: ['Category'],
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...categoryData }) => ({
        url: `/api/categories/${id}`,
        method: 'PUT',
        body: categoryData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/api/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),

    // Order endpoints
    getOrders: builder.query({
      query: (params) => ({
        url: '/api/orders',
        params,
      }),
      providesTags: ['Order'],
    }),

    getOrderById: builder.query({
      query: (id) => `/api/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),

    createOrder: builder.mutation({
      query: (orderData) => ({
        url: '/api/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Order'],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...orderData }) => ({
        url: `/api/orders/${id}`,
        method: 'PUT',
        body: orderData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/api/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Order'],
    }),

    // Customer endpoints
    getCustomers: builder.query({
      query: (params) => ({
        url: '/api/customers',
        params,
      }),
      providesTags: ['Customer'],
    }),

    getCustomerById: builder.query({
      query: (id) => `/api/customers/${id}`,
      providesTags: (result, error, id) => [{ type: 'Customer', id }],
    }),

    createCustomer: builder.mutation({
      query: (customerData) => ({
        url: '/api/customers/add',
        method: 'POST',
        body: customerData,
      }),
      invalidatesTags: ['Customer'],
    }),

    updateCustomer: builder.mutation({
      query: ({ id, ...customerData }) => ({
        url: `/api/customers/update/${id}`,
        method: 'PATCH',
        body: customerData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => ({
        url: `/api/customers/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Customer'],
    }),

    // Customer specific endpoints
    searchCustomerByPhone: builder.query({
      query: (phone) => ({
        url: '/api/customers/search-by-phone',
        params: { phone },
      }),
      providesTags: ['Customer'],
    }),

    searchCustomerByNameSurname: builder.query({
      query: ({ name, surname }) => ({
        url: '/api/customers/search-by-name-surname',
        params: { name, surname },
      }),
      providesTags: ['Customer'],
    }),

    exportCustomers: builder.query({
      query: () => '/api/customers/export',
      providesTags: ['Customer'],
    }),

    getCustomerCount: builder.query({
      query: () => '/api/customers/count',
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

    // Report endpoints
    getReports: builder.query({
      query: (params) => ({
        url: '/api/reports',
        params,
      }),
      providesTags: ['Report'],
    }),

    generateReport: builder.mutation({
      query: (reportParams) => ({
        url: '/api/reports/generate',
        method: 'POST',
        body: reportParams,
      }),
      invalidatesTags: ['Report'],
    }),

    // Dashboard endpoints
    getDashboardStats: builder.query({
      query: () => '/api/dashboard/stats',
      providesTags: ['Report'],
    }),

    getBalanceInfo: builder.query({
      query: () => '/api/dashboard/balance',
      providesTags: ['Report'],
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
  
  // User hooks
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  
  // Product hooks
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  
  // Category hooks
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  
  // Order hooks
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  
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
  
  // Report hooks
  useGetReportsQuery,
  useGenerateReportMutation,
  
  // Dashboard hooks
  useGetDashboardStatsQuery,
  useGetBalanceInfoQuery,
  
  // File upload hooks
  useUploadFileMutation,
  
  // Search hooks
  useSearchProductsQuery,
  useSearchOrdersQuery,
} = apiSlice;
