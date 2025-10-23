import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  User, 
  Package, 
  TrendingUp, 
  Calendar, 
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  DollarSign
} from 'lucide-react';
import { useGetOrdersQuery, useGetCouriersQuery } from '../../services/apiSlice';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';

function History() {
  const { isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCourier, setSelectedCourier] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // API hooks
  const { data: orders = [], isLoading: ordersLoading, error: ordersError, refetch: refetchOrders } = useGetOrdersQuery();
  const { data: couriers = [], isLoading: couriersLoading } = useGetCouriersQuery();

  // Filter orders based on selected criteria
  const getFilteredOrders = () => {
    let filtered = orders;

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(order => {
        const orderDate = order.orderDate || order.date;
        return orderDate === selectedDate;
      });
    }

    // Filter by courier
    if (selectedCourier !== 'all') {
      filtered = filtered.filter(order => {
        const courierName = order.courierFullName || order.courierName;
        return courierName && courierName.toLowerCase().includes(selectedCourier.toLowerCase());
      });
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => {
        const status = order.orderStatus || order.status;
        return status === filterStatus;
      });
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order => {
        const customerName = order.customerFullName || order.customerName;
        const customerPhone = order.customerPhoneNumber || order.customerPhone;
        const address = order.customerAddress || order.address;
        
        return (
          customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customerPhone?.includes(searchTerm) ||
          address?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    return filtered.sort((a, b) => {
      // Sort by date (newest first)
      const dateA = new Date(a.orderDate || a.date || 0);
      const dateB = new Date(b.orderDate || b.date || 0);
      return dateB - dateA;
    });
  };

  const filteredOrders = getFilteredOrders();

  // Get courier performance stats
  const getCourierStats = () => {
    const stats = {};
    
    filteredOrders.forEach(order => {
      const courierName = order.courierFullName || order.courierName || 'Naməlum';
      if (!stats[courierName]) {
        stats[courierName] = {
          total: 0,
          completed: 0,
          pending: 0,
          rejected: 0,
          totalAmount: 0
        };
      }
      
      stats[courierName].total++;
      stats[courierName].totalAmount += order.price || order.totalPrice || 0;
      
      const status = order.orderStatus || order.status;
      if (status === 'COMPLETED' || status === 'DELIVERED') {
        stats[courierName].completed++;
      } else if (status === 'PENDING') {
        stats[courierName].pending++;
      } else if (status === 'REJECTED' || status === 'CANCELLED') {
        stats[courierName].rejected++;
      }
    });
    
    return stats;
  };

  const courierStats = getCourierStats();

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'COMPLETED':
      case 'DELIVERED':
        return { icon: CheckCircle, color: '#10b981', text: 'Tamamlandı' };
      case 'PENDING':
        return { icon: Clock, color: '#f59e0b', text: 'Gözləyir' };
      case 'REJECTED':
      case 'CANCELLED':
        return { icon: XCircle, color: '#ef4444', text: 'Rədd edildi' };
      default:
        return { icon: AlertCircle, color: '#6b7280', text: 'Naməlum' };
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%'
    },
    headerCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '2rem',
      marginBottom: '2rem'
    },
    headerFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '2rem'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    iconBox: {
      background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
      padding: '1rem',
      borderRadius: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 4px 0'
    },
    subtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '1rem'
    },
    filtersCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      background: '#f9fafb',
      transition: 'all 0.3s ease'
    },
    select: {
      padding: '0.75rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      background: '#f9fafb',
      transition: 'all 0.3s ease'
    },
    statsCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem'
    },
    statItem: {
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb',
      textAlign: 'center'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 4px 0'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: '#6b7280',
      margin: 0
    },
    courierStatsCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    courierStatsTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 1rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    courierStatsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '1rem'
    },
    courierStatCard: {
      background: '#f8fafc',
      padding: '1rem',
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb'
    },
    courierName: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#111827',
      margin: '0 0 0.5rem 0'
    },
    courierStatsRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '0.25rem',
      fontSize: '0.875rem'
    },
    ordersCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    ordersHeader: {
      background: '#f8fafc',
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb'
    },
    ordersTitle: {
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 4px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    ordersSubtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '0.875rem'
    },
    orderItem: {
      padding: '1.5rem',
      borderBottom: '1px solid #e5e7eb',
      transition: 'background 0.2s ease'
    },
    orderItemHover: {
      background: '#f9fafb'
    },
    orderHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem'
    },
    orderId: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#111827'
    },
    orderStatus: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600
    },
    orderDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1rem'
    },
    orderDetail: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      color: '#374151'
    },
    orderAmount: {
      fontSize: '1.125rem',
      fontWeight: 600,
      color: '#059669',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    emptyState: {
      textAlign: 'center',
      padding: '4rem 1.5rem',
      color: '#6b7280'
    },
    emptyTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      margin: '1rem 0 0.5rem 0'
    },
    emptyText: {
      margin: 0,
      fontSize: '0.875rem'
    },
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      minHeight: '400px'
    },
    errorState: {
      textAlign: 'center',
      padding: '4rem 1.5rem',
      color: '#ef4444'
    },
    retryButton: {
      background: '#3b82f6',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '1rem'
    }
  };

  // Authentication check
  if (!isAuthenticated) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.errorState}>
            <p>Giriş tələb olunur. Zəhmət olmasa yenidən giriş edin.</p>
            <button onClick={() => window.location.href = '/login'} style={styles.retryButton}>
              Giriş səhifəsinə keç
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (ordersLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.loadingState}>
            <LoadingSpinner size="large" color="#3b82f6" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (ordersError) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.errorState}>
            <p>Xəta baş verdi: {ordersError.data?.message || ordersError.message}</p>
            <button onClick={() => refetchOrders()} style={styles.retryButton}>
              Yenidən cəhd edin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.headerCard}>
          <div style={styles.headerFlex}>
            <div style={styles.headerLeft}>
              <div style={styles.iconBox}>
                <Clock size={32} color="white" />
              </div>
              <div>
                <h1 style={styles.title}>Tarixçə və Performans</h1>
                <p style={styles.subtitle}>Gündəlik proseslər və kuryer performansı</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersCard}>
          <div style={styles.filtersGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.label}>
                <Calendar size={16} />
                Tarix
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={styles.input}
              />
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.label}>
                <User size={16} />
                Kuryer
              </label>
              <select
                value={selectedCourier}
                onChange={(e) => setSelectedCourier(e.target.value)}
                style={styles.select}
              >
                <option value="all">Bütün kuryerlər</option>
                {couriers.map(courier => (
                  <option key={courier.id} value={courier.name}>
                    {courier.name} {courier.surname}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.label}>
                <Filter size={16} />
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                style={styles.select}
              >
                <option value="all">Bütün statuslar</option>
                <option value="PENDING">Gözləyir</option>
                <option value="COMPLETED">Tamamlandı</option>
                <option value="REJECTED">Rədd edildi</option>
              </select>
            </div>
            
            <div style={styles.filterGroup}>
              <label style={styles.label}>
                <Search size={16} />
                Axtarış
              </label>
              <input
                type="text"
                placeholder="Müştəri adı, telefon və ya ünvan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={styles.statsCard}>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statValue}>{filteredOrders.length}</div>
              <div style={styles.statLabel}>Ümumi Sifariş</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>
                {filteredOrders.filter(o => (o.orderStatus || o.status) === 'COMPLETED').length}
              </div>
              <div style={styles.statLabel}>Tamamlanan</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>
                {filteredOrders.filter(o => (o.orderStatus || o.status) === 'PENDING').length}
              </div>
              <div style={styles.statLabel}>Gözləyən</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statValue}>
                {filteredOrders.reduce((sum, o) => sum + (o.price || o.totalPrice || 0), 0)} AZN
              </div>
              <div style={styles.statLabel}>Ümumi Məbləğ</div>
            </div>
          </div>
        </div>

        {/* Courier Performance */}
        {Object.keys(courierStats).length > 0 && (
          <div style={styles.courierStatsCard}>
            <h2 style={styles.courierStatsTitle}>
              <TrendingUp size={20} />
              Kuryer Performansı
            </h2>
            <div style={styles.courierStatsGrid}>
              {Object.entries(courierStats).map(([courierName, stats]) => (
                <div key={courierName} style={styles.courierStatCard}>
                  <h3 style={styles.courierName}>{courierName}</h3>
                  <div style={styles.courierStatsRow}>
                    <span>Ümumi:</span>
                    <span>{stats.total}</span>
                  </div>
                  <div style={styles.courierStatsRow}>
                    <span>Tamamlanan:</span>
                    <span style={{ color: '#10b981' }}>{stats.completed}</span>
                  </div>
                  <div style={styles.courierStatsRow}>
                    <span>Gözləyən:</span>
                    <span style={{ color: '#f59e0b' }}>{stats.pending}</span>
                  </div>
                  <div style={styles.courierStatsRow}>
                    <span>Rədd edilən:</span>
                    <span style={{ color: '#ef4444' }}>{stats.rejected}</span>
                  </div>
                  <div style={styles.courierStatsRow}>
                    <span>Ümumi məbləğ:</span>
                    <span style={{ color: '#059669', fontWeight: 600 }}>{stats.totalAmount} AZN</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders History */}
        <div style={styles.ordersCard}>
          <div style={styles.ordersHeader}>
            <h2 style={styles.ordersTitle}>
              <Package size={20} />
              Sifariş Tarixçəsi
            </h2>
            <p style={styles.ordersSubtitle}>
              {selectedDate ? `${selectedDate} tarixi üçün` : 'Bütün tarixlər üçün'} 
              {filteredOrders.length} sifariş tapıldı
            </p>
          </div>

          {filteredOrders.length === 0 ? (
            <div style={styles.emptyState}>
              <Package size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <h3 style={styles.emptyTitle}>Sifariş tapılmadı</h3>
              <p style={styles.emptyText}>
                Seçilmiş filtrlərə uyğun heç bir sifariş tapılmadı
              </p>
            </div>
          ) : (
            filteredOrders.map((order, index) => {
              const statusInfo = getStatusInfo(order.orderStatus || order.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div 
                  key={order.id} 
                  style={{
                    ...styles.orderItem,
                    ...(index % 2 === 0 ? styles.orderItemHover : {})
                  }}
                >
                  <div style={styles.orderHeader}>
                    <div style={styles.orderId}>
                      Sifariş #{order.id}
                    </div>
                    <div style={{
                      ...styles.orderStatus,
                      background: `${statusInfo.color}20`,
                      color: statusInfo.color
                    }}>
                      <StatusIcon size={16} />
                      {statusInfo.text}
                    </div>
                  </div>
                  
                  <div style={styles.orderDetails}>
                    <div style={styles.orderDetail}>
                      <User size={16} color="#6b7280" />
                      <span>{order.customerFullName || order.customerName}</span>
                    </div>
                    <div style={styles.orderDetail}>
                      <Phone size={16} color="#6b7280" />
                      <span>{order.customerPhoneNumber || order.customerPhone}</span>
                    </div>
                    <div style={styles.orderDetail}>
                      <MapPin size={16} color="#6b7280" />
                      <span>{order.customerAddress || order.address}</span>
                    </div>
                    <div style={styles.orderDetail}>
                      <User size={16} color="#6b7280" />
                      <span>Kuryer: {order.courierFullName || order.courierName}</span>
                    </div>
                  </div>
                  
                  <div style={styles.orderAmount}>
                    <DollarSign size={16} />
                    {order.price || order.totalPrice || 0} AZN
                    <span style={{ fontSize: '0.875rem', color: '#6b7280', marginLeft: '0.5rem' }}>
                      ({order.carboyCount || order.bidonCount || 0} bidon)
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default History;


