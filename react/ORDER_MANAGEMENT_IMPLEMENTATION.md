# Order Management Implementation

Bu sənəd, React tətbiqində sifariş idarəetməsi funksionallığının tam implementasiyasını izah edir.

## API Endpoints

### Order Controller Endpoints

#### 1. Create Order
- **Endpoint**: `POST /orders/add`
- **Description**: Yeni sifariş yaradır
- **Request Body**:
```json
{
  "carboyCount": 0,
  "courierId": 0,
  "customerId": 0,
  "orderDate": "2025-09-02",
  "orderTime": "string"
}
```
- **Response**:
```json
{
  "customerAddress": "string",
  "customerName": "string",
  "customerSurname": "string",
  "customerPhoneNumber": "string",
  "totalPrice": 0,
  "totalCarboyCount": 0,
  "orderDate": "2025-09-02"
}
```

#### 2. Update Order
- **Endpoint**: `PATCH /orders/update/{id}`
- **Description**: Mövcud sifarişi yeniləyir
- **Request Body**:
```json
{
  "carboyCount": 0
}
```
- **Response**: Yenilənmiş sifariş məlumatları

#### 3. Get Order by ID
- **Endpoint**: `GET /orders/{id}`
- **Description**: ID-yə görə sifariş məlumatlarını qaytarır
- **Response**: Sifariş məlumatları

#### 4. Get All Orders
- **Endpoint**: `GET /orders/all`
- **Description**: Bütün sifarişləri qaytarır
- **Response**:
```json
[
  {
    "id": 0,
    "customerFullName": "string",
    "customerPhoneNumber": "string",
    "customerAddress": "string",
    "orderDate": "2025-09-02",
    "price": 0,
    "carboyCount": 0,
    "courierFullName": "string",
    "orderStatus": "PENDING"
  }
]
```

#### 5. Get Order Count
- **Endpoint**: `GET /orders/count`
- **Description**: Sifarişlərin ümumi sayını qaytarır
- **Response**: Sifariş sayı (integer)

#### 6. Delete Order
- **Endpoint**: `DELETE /orders/delete/{id}`
- **Description**: Sifarişi silir
- **Response**: 204 No Content

### Customer Controller Endpoints

#### 1. Add Customer
- **Endpoint**: `POST /customers/add`
- **Description**: Yeni müştəri əlavə edir

#### 2. Update Customer
- **Endpoint**: `PATCH /customers/update/{id}`
- **Description**: Müştəri məlumatlarını yeniləyir

#### 3. Get Customer by ID
- **Endpoint**: `GET /customers/{id}`
- **Description**: ID-yə görə müştəri məlumatlarını qaytarır

#### 4. Search Customer by Phone
- **Endpoint**: `GET /customers/search-by-phone`
- **Description**: Telefon nömrəsinə görə müştəri axtarır

#### 5. Search Customer by Name/Surname
- **Endpoint**: `GET /customers/search-by-name-surname`
- **Description**: Ad və soyada görə müştəri axtarır

#### 6. Get Customer Count
- **Endpoint**: `GET /customers/count`
- **Description**: Müştərilərin ümumi sayını qaytarır

#### 7. Get All Customers
- **Endpoint**: `GET /customers/all`
- **Description**: Bütün müştəriləri qaytarır

#### 8. Delete Customer
- **Endpoint**: `DELETE /customers/delete/{id}`
- **Description**: Müştərini silir

#### 9. Customer Loan Endpoints
- **Endpoint**: `GET /customers/loan/carboy/count`
- **Description**: Müştərilərin borc bidon sayını qaytarır

- **Endpoint**: `GET /customers/carboy/loans`
- **Description**: Müştərilərin bidon borclarını qaytarır

#### 10. Export Customers
- **Endpoint**: `GET /customers/export`
- **Description**: Müştəri məlumatlarını Excel formatında export edir

### Courier Controller Endpoints

#### 1. Get Courier by ID
- **Endpoint**: `GET /couriers/{id}`
- **Description**: ID-yə görə kuryer məlumatlarını qaytarır

#### 2. Get All Couriers
- **Endpoint**: `GET /couriers/all`
- **Description**: Bütün kuryerləri qaytarır

### User Controller Endpoints

#### 1. Register User
- **Endpoint**: `POST /users/register`
- **Description**: Yeni istifadəçi qeydiyyatı

#### 2. Login User
- **Endpoint**: `POST /users/login`
- **Description**: İstifadəçi girişi

#### 3. Get User by ID
- **Endpoint**: `GET /users/{id}`
- **Description**: ID-yə görə istifadəçi məlumatlarını qaytarır

## React Implementation

### API Slice (apiSlice.js)

RTK Query istifadə edərək bütün API endpoint-ləri üçün hooks yaradılmışdır:

```javascript
// Order hooks
useGetOrdersQuery()           // Bütün sifarişləri alır
useGetOrderByIdQuery(id)      // ID-yə görə sifariş alır
useCreateOrderMutation()      // Yeni sifariş yaradır
useUpdateOrderMutation()      // Sifariş yeniləyir
useDeleteOrderMutation()      // Sifariş silir
useGetOrderCountQuery()       // Sifariş sayını alır

// Customer hooks
useGetCustomersQuery()        // Bütün müştəriləri alır
useGetCustomerByIdQuery(id)   // ID-yə görə müştəri alır
useCreateCustomerMutation()   // Yeni müştəri yaradır
useUpdateCustomerMutation()   // Müştəri yeniləyir
useDeleteCustomerMutation()   // Müştəri silir
useGetCustomerCountQuery()    // Müştəri sayını alır

// Courier hooks
useGetCouriersQuery()         // Bütün kuryerləri alır
useGetCourierByIdQuery(id)    // ID-yə görə kuryer alır
```

### CustomerPanel Component

#### Əsas Funksionallıqlar:

1. **Sifariş Yaratma**:
   - Müştəri seçimi (dropdown ilə axtarış)
   - Kuryer seçimi (dropdown ilə axtarış)
   - Bidon sayı daxil etmə
   - Tarix seçimi
   - Avtomatik məbləğ hesablama

2. **Sifariş Redaktə**:
   - Mövcud sifarişi yeniləmə
   - Bidon sayını dəyişdirmə

3. **Sifariş Silmə**:
   - Təsdiq ilə sifariş silmə

4. **Müştəri Silmə**:
   - Təsdiq ilə müştəri silmə
   - Əlaqəli sifarişləri də yeniləmə

5. **Axtarış və Filtrləmə**:
   - Sifariş axtarışı
   - Status filtri (Gözləyən/Tamamlanmış)
   - Tarix filtri

6. **Statistikalar**:
   - Ümumi sifariş sayı
   - Tamamlanmış sifariş sayı
   - Gözləyən sifariş sayı
   - Ümumi gəlir

#### Data Management:

```javascript
// RTK Query hooks
const { data: backendOrders = [], isLoading: isLoadingOrders, refetch: refetchOrders } = useGetOrdersQuery();
const { data: backendCustomers = [], isLoading: isLoadingCustomers, refetch: refetchCustomers } = useGetCustomersQuery();
const { data: backendCouriers = [], isLoading: isLoadingCouriers, refetch: refetchCouriers } = useGetCouriersQuery();

// Mutation hooks
const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();
const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();
const [deleteCustomer, { isLoading: isDeletingCustomer }] = useDeleteCustomerMutation();
```

#### Order Creation Process:

```javascript
const handleAddOrder = async () => {
  const backendOrderData = {
    customerId: Number(customerId),
    courierId: Number(courierId),
    carboyCount: Number(bidonOrdered),
  };

  if (editingOrder) {
    await updateOrder({ id: editingOrder.id, ...backendOrderData }).unwrap();
  } else {
    await createOrder(backendOrderData).unwrap();
  }

  await refetchOrders();
  // UI reset
};
```

## Error Handling

Bütün API çağırışları üçün error handling implementasiyası:

```javascript
try {
  await createOrder(orderData).unwrap();
  alert('Sifariş uğurla əlavə edildi!');
} catch (error) {
  console.error('Error saving order:', error);
  
  if (error.data && error.data.message) {
    alert(`Backend xətası: ${error.data.message}`);
  } else if (error.status) {
    alert(`HTTP xətası: ${error.status}`);
  } else {
    alert('Sifariş yadda saxlanılarkən xəta baş verdi.');
  }
}
```

## Loading States

Bütün async əməliyyatlar üçün loading state-ləri:

```javascript
// Loading indicators
{isLoadingOrders && <Loader2 className="animate-spin" />}
{isCreatingOrder && 'Yaradılır...'}
{isUpdatingOrder && 'Yenilənir...'}
{isDeletingOrder && 'Silinir...'}
```

## Data Synchronization

- RTK Query avtomatik cache management
- `refetch()` funksiyası ilə manual yeniləmə
- Optimistic updates üçün `invalidatesTags`

## UI Features

1. **Responsive Design**: Mobile və desktop üçün fərqli görünüşlər
2. **Real-time Updates**: Sifariş əlavə edildikdə dərhal UI yenilənir
3. **Search Functionality**: Müştəri və kuryer axtarışı
4. **Status Indicators**: Sifariş statusları (Gözləyir/Tamamlandı)
5. **Statistics Dashboard**: Real-time statistikalar
6. **Modal Dialogs**: Sifariş əlavə etmə və redaktə üçün modal-lar

## Backend Integration

Bütün endpoint-lər Swagger dokumentasiyasına uyğun implementasiya edilmişdir:

- Base URL: `http://62.171.154.6:9090`
- Content-Type: `application/json`
- Error responses: 401, 403, 404, 409, 500
- Success responses: 200, 204

## Future Enhancements

1. **Real-time Notifications**: WebSocket ilə real-time bildirişlər
2. **Bulk Operations**: Çoxlu sifariş əməliyyatları
3. **Advanced Filtering**: Tarix aralığı, məbləğ filtri
4. **Export Functionality**: Sifariş məlumatlarını export etmə
5. **Print Functionality**: Sifariş çap etmə
6. **Audit Trail**: Sifariş dəyişikliklərinin izlənməsi

