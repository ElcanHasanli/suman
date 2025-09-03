import { useState, useContext, useEffect } from 'react';
import { Plus, Package, Users, User, Phone, MapPin, DollarSign, Calendar, Droplets, Search, X, Edit, Trash2, Menu, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';
import { 
  useCreateOrderMutation, 
  useUpdateOrderMutation, 
  useDeleteOrderMutation, 
  useGetOrderByIdQuery,
  useGetOrdersQuery,
  useGetCustomersQuery,
  useGetCouriersQuery,
  useDeleteCustomerMutation
} from '../../services/apiSlice';

function CustomerPanel() {
  const { getOrdersForDate, addOrderForDate, removeOrderForDate, customers: ctxCustomers, ordersByDate } = useOrders();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  
  // Local state for deleted customers and orders
  const [deletedCustomerIds, setDeletedCustomerIds] = useState(new Set());
  const [deletedOrderIds, setDeletedOrderIds] = useState(new Set());
  
  // API hooks for order management
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: isUpdatingOrder }] = useUpdateOrderMutation();
  const [deleteOrder, { isLoading: isDeletingOrder }] = useDeleteOrderMutation();
  const [deleteCustomer, { isLoading: isDeletingCustomer }] = useDeleteCustomerMutation();
  
  // RTK Query hooks for data fetching
  const { data: backendOrders = [], isLoading: isLoadingOrders, refetch: refetchOrders } = useGetOrdersQuery();
  const { data: backendCustomers = [], isLoading: isLoadingCustomers, refetch: refetchCustomers } = useGetCustomersQuery();
  const { data: backendCouriers = [], isLoading: isLoadingCouriers, refetch: refetchCouriers } = useGetCouriersQuery();
  
  // Combine context customers with backend customers
  // Backend müştərilərinin field adlarını düzəlt
  const normalizedBackendCustomers = backendCustomers.map(customer => {
    // Backend customer structure-ını yoxla və düzəlt
    if (customer.firstName && customer.lastName) {
      // Artıq düzgün format
      return customer;
    } else if (customer.name) {
      // Backend-də name field var, surname də var
      const normalized = {
        id: `backend_${customer.id}`, // Unique ID üçün prefix əlavə et
        originalId: customer.id, // Orijinal ID-ni saxla
        firstName: customer.name || '',
        lastName: customer.surname || '', // surname field-ını istifadə et
        phone: customer.phone || customer.phoneNumber || '',
        address: customer.address || '',
        pricePerBidon: customer.pricePerBidon || 5,
        isDeleted: customer.status === 0 || customer.isDeleted || customer.deleted || false
      };
      return normalized;
    } else if (customer.fullName) {
      // Backend-də fullName field var
      const nameParts = customer.fullName.split(' ');
      const normalized = {
        id: `backend_${customer.id}`, // Unique ID üçün prefix əlavə et
        originalId: customer.id, // Orijinal ID-ni saxla
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: customer.phone || customer.phoneNumber || '',
        address: customer.address || '',
        pricePerBidon: customer.pricePerBidon || 5
      };
      return normalized;
    } else {
      // Naməlum format, default values
      const normalized = {
        id: `backend_${customer.id}`, // Unique ID üçün prefix əlavə et
        originalId: customer.id, // Orijinal ID-ni saxla
        firstName: customer.firstName || customer.name || customer.fullName || 'Naməlum',
        lastName: customer.lastName || customer.surname || '',
        phone: customer.phone || customer.phoneNumber || '',
        address: customer.address || '',
        pricePerBidon: customer.pricePerBidon || 5
      };
      return normalized;
    }
  });
  
  const customers = [...(ctxCustomers || []), ...normalizedBackendCustomers];
  
  // Fallback demo customers if no customers exist
  const allCustomers = customers.length > 0 ? customers : [
    { id: 1, firstName: 'Əli', lastName: 'Məmmədov', phone: '+994501234567', address: 'Yasamal rayonu', pricePerBidon: 5, isDeleted: false },
    { id: 2, firstName: 'Ayşə', lastName: 'Həsənova', phone: '+994551234567', address: 'Nizami rayonu', pricePerBidon: 6, isDeleted: false }
  ];
  
  // Use allCustomers for customer operations
  const customersForOperations = allCustomers;

  // Use only backend couriers - no static fallbacks
  const allCouriers = backendCouriers;

  const getCustomer = (id) => {
    // Əvvəlcə customersForOperations-də ara
    let customer = customersForOperations.find(c => c.id === Number(id));
    
    // Əgər tapılmadısa, backend müştərilərində ara (originalId ilə)
    if (!customer) {
      customer = customersForOperations.find(c => c.originalId === Number(id));
    }
    
    // Əgər hələ də tapılmadısa, backend müştərilərində ara (id ilə)
    if (!customer) {
      customer = customersForOperations.find(c => c.id === `backend_${id}`);
    }
    
    // Əgər hələ də tapılmadısa, string id ilə ara
    if (!customer) {
      customer = customersForOperations.find(c => c.id === id);
    }
    
    // Backend müştəriləri üçün field adlarını düzəlt
    if (customer && (customer.name || customer.surname)) {
      customer = {
        ...customer,
        firstName: customer.firstName || customer.name || '',
        lastName: customer.lastName || customer.surname || ''
      };
    }
    
    return customer;
  };
  
  const getCourier = (id) => {
    // Əvvəlcə backend kuryerlərində ara
    let courier = allCouriers.find(c => c.id === Number(id));
    
    // Əgər tapılmadısa, fallback kuryerlərdə ara
    if (!courier) {
      courier = allCouriers.find(c => c.id === id);
    }
    
    return courier;
  };

  // Tarix formatını düzəldən helper funksiya
  const normalizeDate = (dateString) => {
    if (!dateString) return '';
    
    // Əgər backend tarix / ilə ayrılmışdırsa (dd/MM/yyyy)
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    // Əgər backend tarix - ilə ayrılmışdırsa (yyyy-MM-dd)
    if (dateString.includes('-')) {
      return dateString;
    }
    
    return dateString;
  };

  // Backend artıq customerFullName və courierFullName qaytarır, 
  // əlavə məlumat əlavə etməyə ehtiyac yoxdur
  const enrichedBackendOrders = backendOrders.map(order => {
    return {
      ...order,
      normalizedOrderDate: normalizeDate(order.orderDate) // Normalized tarix əlavə et
    };
  });
  
  // Yalnız backend sifarişləri istifadə et
  const allOrders = enrichedBackendOrders;
  const ordersForDate = allOrders.filter(order => {
    // Normalized tarix ilə müqayisə et
    const orderDate = order.normalizedOrderDate;
    return orderDate === selectedDate;
  });

  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    date: '',
    bidonOrdered: '',
    courierId: '',
  });

  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');
  const [courierSearch, setCourierSearch] = useState('');
  const [showCourierDropdown, setShowCourierDropdown] = useState(false);
  const [selectedCourierName, setSelectedCourierName] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('active'); // all, active, deleted - default active

  // Delete customer function
  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('Bu müştərini silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      // Backend müştəri ID-sini tap
      let backendCustomerId = customerId;
      
      // Əgər frontend ID formatındadırsa (backend_123), backend ID-ni çıxar
      if (typeof customerId === 'string' && customerId.startsWith('backend_')) {
        backendCustomerId = customerId.replace('backend_', '');
      }
      
      // Əgər originalId varsa, onu istifadə et
      const customer = customersForOperations.find(c => c.id === customerId);
      if (customer && customer.originalId) {
        backendCustomerId = customer.originalId;
      }

      console.log('Deleting customer with ID:', customerId, 'Backend ID:', backendCustomerId);

      const result = await deleteCustomer(backendCustomerId).unwrap();
      
      // Backend response-unu idarə et
      if (result && result.success) {
        // Müştəri siyahılarını yenilə
        await refetchCustomers();
        await refetchOrders(); // Sifarişləri də yenilə
        
        alert(result.message);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Müştəri silinərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
  };

  // Load data on component mount
  useEffect(() => {
    // RTK Query automatically handles data fetching
    // No need for manual fetch calls
  }, []);

  const filteredCustomers = customersForOperations.filter(customer => {
    // Boş və undefined müştəriləri filtrlə
    if (!customer || !customer.firstName || !customer.lastName) {
      return false;
    }
    
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const phone = customer.phone ? customer.phone.toLowerCase() : '';
    const address = customer.address ? customer.address.toLowerCase() : '';
    const searchTerm = customerSearch.toLowerCase();
    
    // Status filter - default olaraq yalnız aktiv müştəriləri göstər
    if (customerStatusFilter === 'active' && customer.isDeleted) return false;
    if (customerStatusFilter === 'deleted' && !customer.isDeleted) return false;
    
    return fullName.includes(searchTerm) || phone.includes(searchTerm) || address.includes(searchTerm);
  });

  const filteredCouriers = allCouriers.filter(courier => {
    // Backend kuryer məlumatları üçün fərqli field adları
    const name = (courier.name || courier.fullName || (courier.firstName + ' ' + courier.lastName) || '').toLowerCase();
    const phone = courier.phone ? courier.phone.toLowerCase() : '';
    const vehicle = courier.vehicle ? courier.vehicle.toLowerCase() : '';
    const searchTerm = courierSearch.toLowerCase();
    
    return name.includes(searchTerm) || phone.includes(searchTerm) || vehicle.includes(searchTerm);
  });

  const filteredOrders = ordersForDate.filter(order => {
    let customer, courier, customerName, courierName, bidonCount, orderDate, isCompleted;
    
    if (order.customerFullName && order.customerFullName !== 'undefined undefined') {
      // Backend order with valid customerFullName
      customerName = order.customerFullName.toLowerCase();
      courierName = order.courierFullName?.toLowerCase() || '';
      bidonCount = order.carboyCount || 0;
      orderDate = order.orderDate || '';
      isCompleted = order.orderStatus !== 'PENDING';
    } else {
      // Backend order without customerFullName or local order
      customer = getCustomer(order.customerId);
      courier = getCourier(order.courierId);
      customerName = customer ? `${customer.firstName} ${customer.lastName}`.toLowerCase() : '';
      courierName = courier ? courier.name.toLowerCase() : '';
      
      if (order.price && order.carboyCount) {
        // Backend order
        bidonCount = order.carboyCount || 0;
        orderDate = order.orderDate || '';
        isCompleted = order.orderStatus !== 'PENDING';
      } else {
        // Local order
        bidonCount = order.bidonOrdered || 0;
        orderDate = order.date || '';
        isCompleted = order.completed || false;
      }
    }
    
    const matchesSearch = orderSearchTerm === '' || 
      customerName.includes(orderSearchTerm.toLowerCase()) ||
      courierName.includes(orderSearchTerm.toLowerCase()) ||
      orderDate.includes(orderSearchTerm) ||
      bidonCount.toString().includes(orderSearchTerm);
    
    const matchesStatus = orderStatusFilter === 'all' || 
      (orderStatusFilter === 'completed' && isCompleted) ||
      (orderStatusFilter === 'pending' && !isCompleted);
    
    return matchesSearch && matchesStatus;
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    const orderDate = order.orderDate || order.date; // Handle both backend and local orders
    if (!acc[orderDate]) acc[orderDate] = [];
    acc[orderDate].push(order);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

  // Stats derived from filtered orders
  const completedOrders = filteredOrders.filter(order => {
    if (order.orderStatus) {
      return order.orderStatus !== 'PENDING'; // Backend order
    }
    return order.completed; // Local order
  });
  
  const pendingOrders = filteredOrders.filter(order => {
    if (order.orderStatus) {
      return order.orderStatus === 'PENDING'; // Backend order
    }
    return !order.completed; // Local order
  });
  
  const totalRevenue = completedOrders.reduce((total, order) => {
    if (order.price) {
      return total + order.price; // Backend order - price is already calculated
    } else {
      const customer = getCustomer(order.customerId);
      const pricePerBidon = customer?.pricePerBidon ?? 5;
      return total + (order.bidonOrdered * pricePerBidon); // Local order
    }
  }, 0);

  const handleCustomerSelect = (customer) => {
    // Backend müştəriləri üçün orijinal ID-ni istifadə et
    const customerId = customer.originalId || customer.id;
    
    setNewOrder(prev => ({ ...prev, customerId: customerId }));
    const customerName = `${customer.firstName} ${customer.lastName}`;
    setSelectedCustomerName(customerName);
    setCustomerSearch('');
    setShowCustomerDropdown(false);
  };

  const handleCourierSelect = (courier) => {
    setNewOrder(prev => ({ ...prev, courierId: courier.id }));
    // Backend kuryer məlumatları üçün fərqli field adları
    const courierName = courier.name || courier.fullName || courier.firstName + ' ' + courier.lastName || 'Naməlum Kuryer';
    setSelectedCourierName(courierName);
    setCourierSearch('');
    setShowCourierDropdown(false);
  };

  const clearCustomerSelection = () => {
    setNewOrder(prev => ({ ...prev, customerId: '' }));
    setSelectedCustomerName('');
    setCustomerSearch('');
    setShowCustomerDropdown(false);
  };

  const clearCourierSelection = () => {
    setNewOrder(prev => ({ ...prev, courierId: '' }));
    setSelectedCourierName('');
    setCourierSearch('');
    setShowCourierDropdown(false);
  };

  const handleAddOrder = async () => {
    const { customerId, date, bidonOrdered, courierId } = newOrder;

    if (!customerId || !date || !bidonOrdered || !courierId) {
      alert('Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    try {
      // Backend Swagger-ə uyğun data structure  
      // orderDate field-ını düzgün formatda göndər (dd/MM/yyyy)
      const formatDateForBackend = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };

      // Real vaxtı formatla (HH:mm) - backend Swagger-ə uyğun
      const formatTimeForBackend = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
      };

      const backendOrderData = {
        customerId: Number(customerId),
        courierId: Number(courierId),
        carboyCount: Number(bidonOrdered), // bidonOrdered əvəzinə carboyCount
        orderDate: formatDateForBackend(date), // Seçilən tarixi düzgün formatda göndər
        orderTime: formatTimeForBackend() // Real vaxtı əlavə et
      };
      


      if (editingOrder) {
        // Update existing order
        await updateOrder({ id: editingOrder.id, ...backendOrderData }).unwrap();
        alert('Sifariş uğurla yeniləndi!');
      } else {
        // Create new order - tamamilə backend-də yaradılır
        const result = await createOrder(backendOrderData).unwrap();
        alert('Sifariş uğurla əlavə edildi!');
      }

      // Refresh orders from backend
      await refetchOrders();

      setNewOrder({ customerId: '', date: '', bidonOrdered: '', courierId: '' });
      setSelectedCustomerName('');
      setSelectedCourierName('');
      setCustomerSearch('');
      setCourierSearch('');
      setShowOrderModal(false);
      setEditingOrder(null);
    } catch (error) {
      console.error('Error saving order:', error);
      
      // Backend error response-u göstər
      if (error.data && error.data.message) {
        console.error('Backend error message:', error.data.message);
        alert(`Backend xətası: ${error.data.message}`);
      } else if (error.status) {
        console.error('HTTP status:', error.status);
        alert(`HTTP xətası: ${error.status}`);
      } else {
        alert('Sifariş yadda saxlanılarkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      }
    }
  };

  const openOrderModal = () => {
    setShowOrderModal(true);
    setNewOrder({ customerId: '', date: '', bidonOrdered: '', courierId: '' });
    setSelectedCustomerName('');
    setSelectedCourierName('');
    setCustomerSearch('');
    setCourierSearch('');
    setEditingOrder(null);
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setNewOrder({ customerId: '', date: '', bidonOrdered: '', courierId: '' });
    setSelectedCustomerName('');
    setSelectedCourierName('');
    setCustomerSearch('');
    setCourierSearch('');
    setEditingOrder(null);
  };

  // Order management functions
  const handleUpdateOrder = async (orderId, updates) => {
    try {
      // Backend üçün field adlarını düzəlt
      const backendUpdates = {
        carboyCount: updates.bidonOrdered || updates.carboyCount
        // orderDate və orderTime göndərməyək
      };
      
      await updateOrder({ id: orderId, ...backendUpdates }).unwrap();
      await refetchOrders();
      alert('Sifariş uğurla yeniləndi!');
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Sifariş yenilənərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Bu sifarişi silmək istədiyinizə əminsiniz?')) {
      return;
    }

    try {
      // Bütün sifarişlər backend-dən gəlməlidir
      console.log('Deleting order from backend with ID:', orderId);
      const result = await deleteOrder(orderId).unwrap();
      await refetchOrders();
      
      // Optimistic update - UI-da dərhal status-u dəyişdir
      if (result && result.success) {
        // Local state-də silinmiş sifariş ID-sini əlavə et
        setDeletedOrderIds(prev => new Set([...prev, orderId]));
        
        alert(result.message);
      } else {
        alert('Sifariş uğurla ləğv edildi!');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      
      // Daha detallı xəta mesajı
      if (error.status === 404) {
        alert('Sifariş tapılmadı! Bu sifariş artıq silinib və ya mövcud deyil.');
      } else if (error.status === 401) {
        alert('Giriş tələb olunur! Zəhmət olmasa yenidən giriş edin.');
      } else if (error.status === 403) {
        alert('Bu əməliyyat üçün icazəniz yoxdur!');
      } else {
        alert(`Sifariş silinərkən xəta baş verdi (${error.status}). Zəhmət olmasa yenidən cəhd edin.`);
      }
    }
  };

  const openEditOrderModal = (order) => {
    // Backend tarix formatını frontend formatına çevir
    const formatDateForFrontend = (backendDate) => {
      if (!backendDate) return '';
      
      // Əgər backend tarix / ilə ayrılmışdırsa (dd/MM/yyyy)
      if (backendDate.includes('/')) {
        const [day, month, year] = backendDate.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      
      // Əgər backend tarix - ilə ayrılmışdırsa (yyyy-MM-dd)
      if (backendDate.includes('-')) {
        return backendDate;
      }
      
      return backendDate;
    };

    setEditingOrder(order);
    setNewOrder({
      customerId: order.customerId,
      date: formatDateForFrontend(order.orderDate || order.date),
      bidonOrdered: order.carboyCount || order.bidonOrdered, // Backend carboyCount field-ını istifadə et
      courierId: order.courierId,
    });
    setSelectedCustomerName(() => {
      const customer = getCustomer(order.customerId);
      return customer ? `${customer.firstName} ${customer.lastName}` : '';
    });
    setSelectedCourierName(() => {
      const courier = getCourier(order.courierId);
      return courier ? courier.name : '';
    });
    setShowOrderModal(true);
  };

  // Sifarişi tamamla funksionallığı bu paneldən çıxarıldı (kuryer panelində olacaq)

  const selectedCustomer = newOrder.customerId ? getCustomer(newOrder.customerId) : null;
  const selectedCourier = newOrder.courierId ? getCourier(newOrder.courierId) : null;
  const bidonPrice = selectedCustomer?.pricePerBidon ?? 5;
  const totalAmount = newOrder.bidonOrdered ? Number(newOrder.bidonOrdered) * bidonPrice : 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
        `}
      </style>


      {/* Backend API Status Messages */}
     
      
      {isLoadingCouriers && (
        <div style={{
          background: '#3b82f6',
          border: '1px solid #60a5fa',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
        🔄 Kuryerlər yüklənir... Zəhmət olmasa gözləyin.
        </div>
      )}
      
      {!isLoadingCouriers && backendCouriers.length === 0 && (
        <div style={{
          background: '#ef4444',
          border: '1px solid #fca5a5',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
        ❌ Kuryerlər yüklənmədi! Sifariş əlavə etmək üçün kuryerlər lazımdır.
        </div>
      )}

      {/* Mobile Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', 
        color: 'white',
        padding: '1rem',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Package size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Sifarişlər</h1>
            <p style={{ fontSize: '0.8rem', margin: 0, opacity: 0.9 }}>Sifariş idarəsi</p>
          </div>
        </div>
      </div>
      {/* Date Picker for viewing orders by date */}
      <div style={{ padding: '1rem', paddingTop: '0.75rem' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          padding: '0.75rem 1rem',
          border: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontWeight: 600 }}>
            <Calendar size={16} />
            Tarix seçin
          </div>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '0.6rem 0.75rem',
              border: '2px solid #e5e7eb',
              borderRadius: '0.75rem',
              fontSize: '0.95rem',
              background: '#f9fafb',
              color: '#374151',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Add Order Button and Refresh */}
      <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={openOrderModal}
          disabled={isLoadingCouriers || backendCouriers.length === 0}
          style={{
            flex: 1,
            padding: '1rem',
            background: isLoadingCouriers || backendCouriers.length === 0 
              ? '#9ca3af' 
              : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: isLoadingCouriers || backendCouriers.length === 0 ? 'not-allowed' : 'pointer',
            boxShadow: isLoadingCouriers || backendCouriers.length === 0 
              ? 'none' 
              : '0 4px 12px rgba(22,163,74,0.3)',
            opacity: isLoadingCouriers || backendCouriers.length === 0 ? 0.6 : 1
          }}
                      title={isLoadingCouriers ? 'Kuryerlər yüklənir...' : backendCouriers.length === 0 ? 'Kuryerlər yüklənmədi! Sifariş əlavə etmək üçün kuryerlər lazımdır.' : 'Yeni sifariş əlavə et'}
        >
          <Plus size={20} />
          {isLoadingCouriers ? 'Kuryerlər Yüklənir...' : backendCouriers.length === 0 ? 'Kuryerlər Yoxdur' : 'Yeni Sifariş'}
        </button>
        
        <button
          onClick={() => {
            refetchOrders();
            refetchCustomers();
          }}
          disabled={isLoadingOrders || isLoadingCustomers}
          style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: isLoadingOrders ? 'not-allowed' : 'pointer',
            opacity: isLoadingOrders ? 0.6 : 1,
            boxShadow: '0 4px 12px rgba(59,130,246,0.3)'
          }}
        >
          {isLoadingOrders || isLoadingCustomers ? <Loader2 size={20} className="animate-spin" /> : <Package size={20} />}
          {isLoadingOrders || isLoadingCustomers ? 'Yenilənir...' : 'Yenilə'}
        </button>
      </div>

      {/* Order Modal */}
      {showOrderModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.5rem 1.5rem 1rem 1.5rem',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '700', 
                color: '#1f2937', 
                margin: 0
              }}>
                {editingOrder ? 'Sifarişi Redaktə Et' : 'Yeni Sifariş Əlavə Et'}
              </h3>
              <button
                onClick={closeOrderModal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f3f4f6'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '1.5rem' }}>
              {customersForOperations.length === 0 ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#64748b',
                  border: '2px dashed #cbd5e1',
                  borderRadius: '12px'
                }}>
                  <Users size={48} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Müştəri Yoxdur
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Sifariş əlavə etmək üçün əvvəlcə müştəri əlavə edin
                  </p>
                </div>
              ) : isLoadingCouriers ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#3b82f6',
                  border: '2px dashed #60a5fa',
                  borderRadius: '12px',
                  background: '#eff6ff'
                }}>
                  <Loader2 size={48} className="animate-spin" style={{ marginBottom: '1rem', color: '#60a5fa' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Kuryerlər Yüklənir...
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Zəhmət olmasa gözləyin
                  </p>
                </div>
              ) : backendCouriers.length === 0 ? (
                <div style={{ 
                  padding: '2rem', 
                  textAlign: 'center', 
                  color: '#dc2626',
                  border: '2px dashed #fca5a5',
                  borderRadius: '12px',
                  background: '#fef2f2'
                }}>
                  <Package size={48} style={{ marginBottom: '1rem', color: '#fca5a5' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Kuryerlər Yüklənir...
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.9rem' }}>
                    Kuryerlər yüklənəndə sifariş əlavə edə biləcəksiniz
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Müştəri Seçimi */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ 
                      display: 'flex',
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <User size={16} />
                      Müştəri
                    </label>
                    
                    {selectedCustomerName ? (
                      <div style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #16a34a',
                        borderRadius: '12px',
                        background: '#f0fdf4',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{ fontWeight: '500' }}>{selectedCustomerName}</span>
                        <button
                          onClick={clearCustomerSelection}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ position: 'relative' }}>
                          <Search size={16} style={{ 
                            position: 'absolute', 
                            left: '1rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: '#6b7280' 
                          }} />
                          <input
                            type="text"
                            placeholder="Müştəri axtarın..."
                            value={customerSearch}
                            onChange={(e) => setCustomerSearch(e.target.value)}
                            onFocus={() => setShowCustomerDropdown(true)}
                            style={{
                              width: '100%',
                              padding: '1rem 1rem 1rem 2.5rem',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '1rem',
                              background: 'white',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                            onBlur={e => {
                              setTimeout(() => setShowCustomerDropdown(false), 200);
                            }}
                          />
                        </div>
                        
                        {showCustomerDropdown && filteredCustomers.length > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            marginTop: '0.5rem',
                          }}>
                            {filteredCustomers.map(customer => (
                              <div
                                key={customer.id}
                                onClick={() => handleCustomerSelect(customer)}
                                style={{
                                  padding: '1rem',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f3f4f6',
                                  transition: 'background-color 0.2s ease',
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <div style={{ 
                                  display: 'flex', 
                                  justifyContent: 'space-between', 
                                  alignItems: 'center',
                                  width: '100%'
                                }}>
                                  <div>
                                    <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                      {customer.firstName} {customer.lastName}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                      {customer.phone}
                                    </div>
                                    <div style={{ marginTop: '0.25rem' }}>
                                      <span style={{
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '600',
                                        background: customer.isDeleted ? '#fee2e2' : '#d1fae5',
                                        color: customer.isDeleted ? '#dc2626' : '#065f46',
                                        border: `1px solid ${customer.isDeleted ? '#fca5a5' : '#a7f3d0'}`
                                      }}>
                                        {customer.isDeleted ? 'Silindi' : 'Aktiv'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Tarix */}
                  <div>
                    <label style={{ 
                      display: 'flex',
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Calendar size={16} />
                      Sifariş Tarixi
                    </label>
                    <input
                      type="date"
                      value={newOrder.date}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, date: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'white',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Bidon Sayı */}
                  <div>
                    <label style={{ 
                      display: 'flex',
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <Droplets size={16} />
                      Bidon Sayı
                    </label>
                    <input
                      type="number"
                      value={newOrder.bidonOrdered}
                      onChange={(e) => setNewOrder(prev => ({ ...prev, bidonOrdered: e.target.value }))}
                      placeholder="Bidon sayını daxil edin"
                      min="1"
                      style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        background: 'white',
                        outline: 'none',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Kuryer Seçimi */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ 
                      display: 'flex',
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <User size={16} />
                      Kuryer
                    </label>
                    
                    {selectedCourierName ? (
                      <div style={{
                        width: '100%',
                        padding: '1rem',
                        border: '2px solid #f59e0b',
                        borderRadius: '12px',
                        background: '#fffbeb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        <span style={{ fontWeight: '500' }}>{selectedCourierName}</span>
                        <button
                          onClick={clearCourierSelection}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#dc2626',
                            padding: '0.25rem',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div style={{ position: 'relative' }}>
                          <Search size={16} style={{ 
                            position: 'absolute', 
                            left: '1rem', 
                            top: '50%', 
                            transform: 'translateY(-50%)', 
                            color: '#6b7280' 
                          }} />
                          <input
                            type="text"
                            placeholder="Kuryer axtarın..."
                            value={courierSearch}
                            onChange={(e) => setCourierSearch(e.target.value)}
                            onFocus={() => setShowCourierDropdown(true)}
                            style={{
                              width: '100%',
                              padding: '1rem 1rem 1rem 2.5rem',
                              border: '2px solid #e5e7eb',
                              borderRadius: '12px',
                              fontSize: '1rem',
                              background: 'white',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                            onBlur={e => {
                              setTimeout(() => setShowCourierDropdown(false), 200);
                            }}
                          />
                        </div>
                        
                        {showCourierDropdown && filteredCouriers.length > 0 && (
                          <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            zIndex: 1000,
                            background: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            marginTop: '0.5rem',
                          }}>
                            {filteredCouriers.map(courier => (
                              <div
                                key={courier.id}
                                onClick={() => handleCourierSelect(courier)}
                                style={{
                                  padding: '1rem',
                                  cursor: 'pointer',
                                  borderBottom: '1px solid #f3f4f6',
                                  transition: 'background-color 0.2s ease',
                                }}
                                onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                                onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                  {courier.name || courier.fullName || 'Naməlum Kuryer'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                  {courier.vehicle || courier.phone || 'Məlumat yoxdur'}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Məbləğ Göstərilməsi */}
                  <div>
                    <label style={{ 
                      display: 'flex',
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <DollarSign size={16} />
                      Hesablanmış Məbləğ
                    </label>
                    <div style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      background: '#f0fdf4',
                      color: '#16a34a',
                      fontWeight: '700',
                      textAlign: 'center',
                      boxSizing: 'border-box'
                    }}>
                      {totalAmount > 0 ? `${totalAmount} AZN` : 'Məbləğ hesablanacaq'}
                    </div>
                  </div>

                  {/* Məlumat Preview */}
                  {(selectedCustomer || selectedCourier) && (
                    <div style={{ 
                      background: '#f8fafc', 
                      borderRadius: '12px', 
                      padding: '1rem',
                      border: '1px solid #e2e8f0' 
                    }}>
                      {selectedCustomer && totalAmount > 0 && (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: selectedCourier ? '0.75rem' : 0
                        }}>
                          <span style={{ fontWeight: '600', color: '#374151' }}>Məbləğ:</span>
                          <span style={{ color: '#16a34a', fontWeight: '700', fontSize: '1.1rem' }}>
                            {totalAmount} AZN
                          </span>
                        </div>
                      )}
                      {selectedCustomer && (
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {bidonPrice} AZN/bidon
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.5rem 1.5rem 1.5rem',
              borderTop: '1px solid #e5e7eb',
              display: 'flex',
              gap: '1rem'
            }}>
              <button
                onClick={closeOrderModal}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
              >
                Ləğv Et
              </button>
              <button
                onClick={handleAddOrder}
                disabled={customersForOperations.length === 0 || isCreatingOrder || isUpdatingOrder}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: (customersForOperations.length === 0 || isCreatingOrder || isUpdatingOrder) ? 'not-allowed' : 'pointer',
                  opacity: (customersForOperations.length === 0 || isCreatingOrder || isUpdatingOrder) ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                {(isCreatingOrder || isUpdatingOrder) ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Plus size={20} />
                )}
                {isCreatingOrder ? 'Yaradılır...' : isUpdatingOrder ? 'Yenilənir...' : (editingOrder ? 'Sifarişi Yenilə' : 'Sifarişi Yarat')}
              </button>
            </div>
          </div>
        </div>
      )}

      

      {/* Statistics (moved from Daily Process) */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Package size={16} />
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>ÜMUMİ</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {filteredOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>sifariş</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} />
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>HAZIR</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {completedOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>sifariş</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={16} />
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>GÖZLƏYƏN</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {pendingOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>sifariş</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            padding: '1.25rem',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <DollarSign size={16} />
              <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>GƏLİR</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {totalRevenue}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>AZN</div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ padding: '0 1rem 1rem' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          padding: '1rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: '1rem', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6b7280' 
              }} />
              <input
                type="text"
                placeholder="Axtarış..."
                value={orderSearchTerm}
                onChange={(e) => setOrderSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 2.5rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'white',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
              style={{
                flex: 1,
                padding: '1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'white',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              <option value="all">Bütün Sifarişlər</option>
              <option value="pending">Gözləyən</option>
              <option value="completed">Tamamlanmış</option>
            </select>
            
            <button
              onClick={() => {
                refetchOrders();
                refetchCustomers();
              }}
              disabled={isLoadingOrders || isLoadingCustomers}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: isLoadingOrders ? 'not-allowed' : 'pointer',
                opacity: isLoadingOrders ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isLoadingOrders || isLoadingCustomers ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ padding: '0 1rem 2rem' }}>
        {/* Loading State */}
        {isLoadingOrders && (
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '3rem 1.5rem',
            textAlign: 'center', 
            color: '#64748b',
            border: '2px dashed #cbd5e1',
            marginBottom: '1rem'
          }}>
            <Loader2 size={48} className="animate-spin" style={{ marginBottom: '1rem', color: '#94a3b8' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              Sifarişlər yüklənir...
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Zəhmət olmasa gözləyin
            </p>
          </div>
        )}
        
        {/* Desktop Table View (CustomerData table style) */}
        {!isLoadingOrders && typeof window !== 'undefined' && window.innerWidth >= 768 && filteredOrders.length > 0 && (
          <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9', marginBottom: '1rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', margin: 0 }}>Sifariş Siyahısı</h2>
              <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.875rem' }}>Bütün sifariş məlumatları</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Tarix</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Vaxt</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Müştəri</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Kuryer</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Bidon</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Məbləğ</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Ödəniş</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Əməliyyat</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDates.map(date => (
                    groupedOrders[date].map((order) => {
                      // Backend sifarişləri üçün məlumatları birbaşa istifadə et
                      const customerFullName = order.customerFullName || 'Naməlum Müştəri';
                      const courierFullName = order.courierFullName || 'Təyin olunmayıb';
                      const amount = order.price || 0;
                      const bidonCount = order.carboyCount || 0;
                      
                      // Status məntiqini düzəld - kuryer tərəfindən idarə edilir
                      const getStatusInfo = (orderStatus, orderId) => {
                        // Əgər local state-də silinmişdirsə
                        if (deletedOrderIds.has(orderId)) {
                          return { text: 'Ləğv edildi', color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5' };
                        }
                        
                        switch (orderStatus) {
                          case 'PENDING':
                            return { text: 'Gözləyir', color: '#92400e', bgColor: '#fef3c7', borderColor: '#fde68a' };
                          case 'COMPLETED':
                            return { text: 'Tamamlandı', color: '#065f46', bgColor: '#d1fae5', borderColor: '#a7f3d0' };
                          case 'REJECTED':
                            return { text: 'Ləğv edildi', color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5' };
                          case 'IN_PROGRESS':
                            return { text: 'Çatdırılır', color: '#1d4ed8', bgColor: '#dbeafe', borderColor: '#93c5fd' };
                          case 'DELETED':
                            return { text: 'Ləğv edildi', color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5' };
                          default:
                            return { text: 'Gözləyir', color: '#92400e', bgColor: '#fef3c7', borderColor: '#fde68a' };
                        }
                      };
                      
                      const statusInfo = getStatusInfo(order.orderStatus, order.id);
                      
                      return (
                        <tr key={order.id}>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{date}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', fontSize: '0.875rem', color: '#6b7280' }}>
                            {order.orderTime || '—'}
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{customerFullName}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{courierFullName}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{bidonCount}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#16a34a', fontWeight: 700 }}>{amount} AZN</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                            {order.paymentMethod ? (order.paymentMethod === 'cash' ? 'Nağd' : order.paymentMethod === 'card' ? 'Kart' : order.paymentMethod === 'credit' ? 'Nəsiyə' : '—') : '—'}
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: statusInfo.bgColor,
                              color: statusInfo.color,
                              border: `1px solid ${statusInfo.borderColor}`
                            }}>
                              {statusInfo.text}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => openEditOrderModal(order)}
                                style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
                              >
                                Redaktə
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                style={{ background: '#ef4444', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
                              >
                                Sil
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Mobile Card View (default) */}
        {!isLoadingOrders && sortedDates.length > 0 ? (
          sortedDates.map(date => (
            <div key={date} style={{ marginBottom: '1rem', display: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 'none' : 'block' }}>
              {/* Date Header */}
              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '12px 12px 0 0',
                border: '1px solid #e5e7eb',
                borderBottom: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
              }}>
                <h3 style={{ 
                  margin: 0, 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: '#64748b',
                  textAlign: 'center'
                }}>
                  {date}
                </h3>
              </div>

              {/* Orders for this date */}
              {groupedOrders[date].map((order, index) => {
                // Backend sifarişləri üçün məlumatları birbaşa istifadə et
                const customerFullName = order.customerFullName || 'Naməlum Müştəri';
                const courierFullName = order.courierFullName || 'Təyin olunmayıb';
                const bidonCount = order.carboyCount || 0;
                const amount = order.price || 0;
                
                // Status məntiqini düzəld - kuryer tərəfindən idarə edilir
                const getStatusInfo = (orderStatus) => {
                  switch (orderStatus) {
                    case 'PENDING':
                      return { text: 'Gözləyir', color: '#92400e', bgColor: '#fef3c7', borderColor: '#fde68a' };
                    case 'COMPLETED':
                      return { text: 'Tamamlandı', color: '#065f46', bgColor: '#d1fae5', borderColor: '#a7f3d0' };
                    case 'REJECTED':
                      return { text: 'Ləğv edildi', color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5' };
                    case 'IN_PROGRESS':
                      return { text: 'Çatdırılır', color: '#1d4ed8', bgColor: '#dbeafe', borderColor: '#93c5fd' };
                    default:
                      return { text: 'Gözləyir', color: '#92400e', bgColor: '#fef3c7', borderColor: '#fde68a' };
                  }
                };
                
                const statusInfo = getStatusInfo(order.orderStatus);
                
                const isLast = index === groupedOrders[date].length - 1;
                
                return (
                  <div
                    key={order.id}
                    style={{
                      background: 'white',
                      padding: '1.25rem',
                      borderLeft: '1px solid #e5e7eb',
                      borderRight: '1px solid #e5e7eb',
                      borderBottom: isLast ? '1px solid #e5e7eb' : '1px solid #f3f4f6',
                      borderRadius: isLast ? '0 0 12px 12px' : '0',
                      boxShadow: isLast ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                    }}
                  >
                    {/* Customer Name and Status */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '1rem'
                    }}>
                      <div>
                        <h4 style={{ 
                          margin: 0, 
                          fontSize: '1.1rem', 
                          fontWeight: '600', 
                          color: '#1f2937'
                        }}>
                          {customerFullName}
                        </h4>
                        <p style={{ 
                          margin: '0.25rem 0 0 0', 
                          fontSize: '0.85rem', 
                          color: '#6b7280' 
                        }}>
                          Kuryer: {courierFullName}
                        </p>
                        <p style={{ 
                          margin: '0.25rem 0 0 0', 
                          fontSize: '0.8rem', 
                          color: '#9ca3af' 
                        }}>
                          Vaxt: {order.orderTime || '—'}
                        </p>
                      </div>
                      
                                              <div style={{ 
                          padding: '0.4rem 0.8rem', 
                          borderRadius: '20px', 
                          fontSize: '0.75rem', 
                          fontWeight: '600',
                          background: statusInfo.bgColor,
                          color: statusInfo.color,
                          border: `1px solid ${statusInfo.borderColor}`,
                          whiteSpace: 'nowrap'
                        }}>
                          {statusInfo.text}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '1rem',
                      marginBottom: '1rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: '#f8fafc',
                        borderRadius: '8px'
                      }}>
                        <Droplets size={16} style={{ color: '#3b82f6' }} />
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Bidon</div>
                                                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#374151' }}>
                          {bidonCount}
                        </div>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: '#f0fdf4',
                        borderRadius: '8px'
                      }}>
                        <DollarSign size={16} style={{ color: '#16a34a' }} />
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Məbləğ</div>
                                                  <div style={{ fontSize: '1rem', fontWeight: '600', color: '#16a34a' }}>
                          {amount} AZN
                        </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {/* Customer Info */}
                    {order.customerPhoneNumber && (
                      <div style={{ 
                        padding: '0.75rem',
                        background: '#fafafa',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        {order.customerPhoneNumber && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <Phone size={14} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                              {order.customerPhoneNumber}
                            </span>
                          </div>
                        )}
                        {order.customerAddress && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem' 
                          }}>
                            <MapPin size={14} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                              {order.customerAddress}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div style={{ 
                      display: 'flex', 
                      gap: '0.75rem',
                      justifyContent: 'center'
                    }}>
                      <button
                        onClick={() => openEditOrderModal(order)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: '#3b82f6',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Edit size={16} />
                        Redaktə
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <Trash2 size={16} />
                        Sil
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        ) : !isLoadingOrders ? (
          <div style={{ 
            background: 'white',
            borderRadius: '16px',
            padding: '3rem 1.5rem',
            textAlign: 'center', 
            color: '#64748b',
            border: '2px dashed #cbd5e1'
          }}>
            <Package size={48} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
              Heç bir sifariş yoxdur
            </h3>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Yeni sifariş əlavə etməklə başlayın
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CustomerPanel;