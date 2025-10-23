import { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Filter,
  Search,
  Download,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { 
  useGetOrdersQuery,
  useGetCustomersQuery,
  useGetCouriersQuery
} from '../../services/apiSlice';

function DailyProcesses() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  // Only date selection needed for this page
  const [showChooser, setShowChooser] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'payments'

  // API hooks
  const { data: orders = [], isLoading: isLoadingOrders, refetch: refetchOrders } = useGetOrdersQuery();
  const { data: customers = [], isLoading: isLoadingCustomers } = useGetCustomersQuery();
  const { data: couriers = [], isLoading: isLoadingCouriers } = useGetCouriersQuery();

  // Tarix formatını düzəldən helper funksiya
  const normalizeDate = (dateString) => {
    if (!dateString) return '';
    
    if (dateString.includes('/')) {
      const [day, month, year] = dateString.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    
    if (dateString.includes('-')) {
      return dateString;
    }
    
    return dateString;
  };

  // Seçilən tarixə görə sifarişləri filtrlə
  const filteredOrders = orders.filter(order => {
    const orderDate = normalizeDate(order.orderDate);
    return orderDate === selectedDate;
  });

  // Status məntiqini düzəld
  const getStatusInfo = (orderStatus) => {
    switch (orderStatus) {
      case 'PENDING':
        return { text: 'Gözləyir', color: '#92400e', bgColor: '#fef3c7', borderColor: '#fde68a', icon: Clock };
      case 'COMPLETED':
        return { text: 'Tamamlandı', color: '#065f46', bgColor: '#d1fae5', borderColor: '#a7f3d0', icon: CheckCircle };
      case 'REJECTED':
        return { text: 'Ləğv edildi', color: '#dc2626', bgColor: '#fee2e2', borderColor: '#fca5a5', icon: AlertCircle };
      case 'IN_PROGRESS':
        return { text: 'Çatdırılır', color: '#1d4ed8', bgColor: '#dbeafe', borderColor: '#93c5fd', icon: Package };
      default:
        return { text: 'Gözləyir', color: '#92400e', bgColor: '#fef3c7', borderColor: '#fde68a', icon: Clock };
    }
  };

  // Statistika hesabla
  const calculateStats = () => {
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(order => order.orderStatus === 'COMPLETED').length;
    const pendingOrders = filteredOrders.filter(order => order.orderStatus === 'PENDING').length;
    const inProgressOrders = filteredOrders.filter(order => order.orderStatus === 'IN_PROGRESS').length;
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.price || 0), 0);
    const totalCarboyCount = filteredOrders.reduce((sum, order) => sum + (order.carboyCount || 0), 0);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      inProgressOrders,
      totalRevenue,
      totalCarboyCount,
      completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0
    };
  };

  const stats = calculateStats();

  // Ödəniş növlərinə görə bölgü
  const getPaymentBreakdown = () => {
    const paymentTypes = {};
    filteredOrders.forEach(order => {
      const paymentMethod = order.paymentMethod || 'unknown';
      paymentTypes[paymentMethod] = (paymentTypes[paymentMethod] || 0) + (order.price || 0);
    });
    return paymentTypes;
  };

  const paymentBreakdown = getPaymentBreakdown();

  // Kuryer performansı
  const getCourierPerformance = () => {
    const courierStats = {};
    filteredOrders.forEach(order => {
      const courierName = order.courierFullName || 'Naməlum';
      if (!courierStats[courierName]) {
        courierStats[courierName] = {
          totalOrders: 0,
          completedOrders: 0,
          totalRevenue: 0,
          totalCarboyCount: 0
        };
      }
      courierStats[courierName].totalOrders++;
      courierStats[courierName].totalRevenue += order.price || 0;
      courierStats[courierName].totalCarboyCount += order.carboyCount || 0;
      if (order.orderStatus === 'COMPLETED') {
        courierStats[courierName].completedOrders++;
      }
    });
    return courierStats;
  };

  const courierPerformance = getCourierPerformance();

  // Tarix formatını göstərmə üçün
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '2rem 1rem',
        marginBottom: '2rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <BarChart3 size={32} />
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
              Günlük Proseslər və Ödənişlər
            </h1>
          </div>
          <p style={{ fontSize: '1.1rem', margin: 0, opacity: 0.9 }}>
            {formatDisplayDate(selectedDate)} tarixli proseslər və ödəniş tarixçəsi
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        {/* Date Control */}
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '1.5rem',
          marginBottom: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {/* Tarix seçimi */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} style={{ color: '#6b7280' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {/* View chooser */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowChooser(!showChooser)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                {activeTab === 'orders' ? 'Sifarişlər' : 'Ödənişlər'}
              </button>
              {showChooser && (
                <div style={{
                  position: 'absolute',
                  top: '110%',
                  left: 0,
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '0.5rem',
                  zIndex: 10,
                  minWidth: '160px'
                }}>
                  <button
                    onClick={() => { setActiveTab('orders'); setShowChooser(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: activeTab === 'orders' ? '#f1f5f9' : 'transparent',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >Sifarişlər</button>
                  <button
                    onClick={() => { setActiveTab('payments'); setShowChooser(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: activeTab === 'payments' ? '#f1f5f9' : 'transparent',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >Ödənişlər</button>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={() => refetchOrders()}
              style={{
                padding: '0.5rem 1rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem'
              }}
            >
              <RefreshCw size={16} />
              Yenilə
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoadingOrders && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            background: 'white',
            borderRadius: '1rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <RefreshCw size={32} className="animate-spin" style={{ color: '#3b82f6' }} />
            <span style={{ marginLeft: '1rem', fontSize: '1.1rem', color: '#6b7280' }}>
              Məlumatlar yüklənir...
            </span>
          </div>
        )}

        {/* Content: Single detailed list based on chooser */}
        {!isLoadingOrders && (
          <>
            {activeTab === 'orders' && (
              <DetailedView 
                filteredOrders={filteredOrders}
                getStatusInfo={getStatusInfo}
                title={`Günlük Sifarişlər (${filteredOrders.length})`}
              />
            )}
            {activeTab === 'payments' && (
              <DetailedView 
                filteredOrders={filteredOrders.filter(o => !!o.paymentMethod)}
                getStatusInfo={getStatusInfo}
                title={`Günlük Ödənişlər (${filteredOrders.filter(o => !!o.paymentMethod).length})`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Summary View Component
function SummaryView({ stats, paymentBreakdown, courierPerformance, filteredOrders, getStatusInfo }) {
  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Key Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        <StatCard
          title="Ümumi Sifarişlər"
          value={stats.totalOrders}
          icon={Package}
          color="#3b82f6"
          bgColor="#dbeafe"
        />
        <StatCard
          title="Tamamlanmış"
          value={stats.completedOrders}
          icon={CheckCircle}
          color="#16a34a"
          bgColor="#d1fae5"
        />
        <StatCard
          title="Ümumi Gəlir"
          value={`${stats.totalRevenue} AZN`}
          icon={DollarSign}
          color="#059669"
          bgColor="#d1fae5"
        />
        <StatCard
          title="Ümumi Bidon"
          value={stats.totalCarboyCount}
          icon={Package}
          color="#7c3aed"
          bgColor="#ede9fe"
        />
      </div>

      {/* Progress Overview */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
          Proses Təqdimatı
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <ProgressCard
            title="Tamamlama Dərəcəsi"
            percentage={stats.completionRate}
            color="#16a34a"
            bgColor="#d1fae5"
          />
          <ProgressCard
            title="Gözləyən Sifarişlər"
            percentage={stats.totalOrders > 0 ? Math.round((stats.pendingOrders / stats.totalOrders) * 100) : 0}
            color="#f59e0b"
            bgColor="#fef3c7"
          />
          <ProgressCard
            title="Çatdırılan Sifarişlər"
            percentage={stats.totalOrders > 0 ? Math.round((stats.inProgressOrders / stats.totalOrders) * 100) : 0}
            color="#3b82f6"
            bgColor="#dbeafe"
          />
        </div>
      </div>

      {/* Payment Breakdown */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
          Ödəniş Növləri
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {Object.entries(paymentBreakdown).map(([method, amount]) => (
            <div key={method} style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {method === 'cash' ? 'Nağd' : method === 'card' ? 'Kart' : method === 'credit' ? 'Nəsiyə' : 'Naməlum'}
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {amount} AZN
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Courier Performance */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
          Kuryer Performansı
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Object.entries(courierPerformance).map(([courierName, performance]) => (
            <div key={courierName} style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                  {courierName}
                </h4>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '0.25rem',
                  fontSize: '0.8rem',
                  fontWeight: '500'
                }}>
                  {performance.totalOrders > 0 ? Math.round((performance.completedOrders / performance.totalOrders) * 100) : 0}% tamamlandı
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div>Sifariş: {performance.totalOrders}</div>
                <div>Tamamlanmış: {performance.completedOrders}</div>
                <div>Gəlir: {performance.totalRevenue} AZN</div>
                <div>Bidon: {performance.totalCarboyCount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Detailed View Component
function DetailedView({ filteredOrders, getStatusInfo, title = 'Günlük Sifarişlər' }) {
  const filteredAndSearchedOrders = filteredOrders;

  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
        {title}
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>ID</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Müştəri</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Kuryer</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Bidon</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Məbləğ</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Ödəniş</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Vaxt</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSearchedOrders.map((order) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              const StatusIcon = statusInfo.icon;
              
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.9rem' }}>#{order.id}</td>
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: '500', color: '#1f2937' }}>
                        {order.customerFullName || 'Naməlum'}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {order.customerPhoneNumber}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '500', color: '#1f2937' }}>
                      {order.courierFullName || 'Təyin olunmayıb'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {order.carboyCount || 0}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: '600', color: '#059669' }}>
                    {order.price || 0} AZN
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      background: '#f3f4f6',
                      color: '#374151',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem'
                    }}>
                      {order.paymentMethod === 'cash' ? 'Nağd' : 
                       order.paymentMethod === 'card' ? 'Kart' : 
                       order.paymentMethod === 'credit' ? 'Nəsiyə' : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <StatusIcon size={16} style={{ color: statusInfo.color }} />
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        background: statusInfo.bgColor,
                        color: statusInfo.color,
                        borderRadius: '0.25rem',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {statusInfo.text}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    {order.orderDate ? new Date(order.orderDate).toLocaleTimeString('az-AZ', {
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredAndSearchedOrders.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#6b7280'
        }}>
          <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
            Sifariş tapılmadı
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem' }}>
            Seçilən kriteriyalara uyğun sifariş mövcud deyil
          </p>
        </div>
      )}
    </div>
  );
}

// Payments View Component
function PaymentsView({ filteredOrders, paymentBreakdown, getStatusInfo }) {
  const completedOrders = filteredOrders.filter(order => order.orderStatus === 'COMPLETED');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.price || 0), 0);

  return (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {/* Payment Summary */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
          Ödəniş Xülasəsi
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <StatCard
            title="Ümumi Gəlir"
            value={`${totalRevenue} AZN`}
            icon={DollarSign}
            color="#059669"
            bgColor="#d1fae5"
          />
          <StatCard
            title="Tamamlanmış Sifarişlər"
            value={completedOrders.length}
            icon={CheckCircle}
            color="#16a34a"
            bgColor="#d1fae5"
          />
          <StatCard
            title="Orta Sifariş Dəyəri"
            value={completedOrders.length > 0 ? `${Math.round(totalRevenue / completedOrders.length)} AZN` : '0 AZN'}
            icon={TrendingUp}
            color="#7c3aed"
            bgColor="#ede9fe"
          />
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
          Ödəniş Növləri
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {Object.entries(paymentBreakdown).map(([method, amount]) => {
            const percentage = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
            return (
              <div key={method} style={{
                padding: '1.5rem',
                background: '#f8fafc',
                borderRadius: '0.75rem',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0, color: '#1f2937' }}>
                    {method === 'cash' ? 'Nağd Ödəniş' : 
                     method === 'card' ? 'Kart Ödənişi' : 
                     method === 'credit' ? 'Nəsiyə Ödənişi' : 'Naməlum'}
                  </h4>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    background: '#d1fae5',
                    color: '#065f46',
                    borderRadius: '0.25rem',
                    fontSize: '0.8rem',
                    fontWeight: '500'
                  }}>
                    {percentage}%
                  </span>
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#059669' }}>
                  {amount} AZN
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Completed Orders List */}
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '2rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e7eb'
      }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 1.5rem 0', color: '#1f2937' }}>
          Tamamlanmış Sifarişlər ({completedOrders.length})
        </h3>
        
        <div style={{ display: 'grid', gap: '1rem' }}>
          {completedOrders.map((order) => (
            <div key={order.id} style={{
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {order.customerFullName || 'Naməlum Müştəri'}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Kuryer: {order.courierFullName || 'Təyin olunmayıb'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#059669' }}>
                    {order.price || 0} AZN
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    {order.paymentMethod === 'cash' ? 'Nağd' : 
                     order.paymentMethod === 'card' ? 'Kart' : 
                     order.paymentMethod === 'credit' ? 'Nəsiyə' : '—'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {completedOrders.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#6b7280'
          }}>
            <CheckCircle size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>
              Tamamlanmış sifariş yoxdur
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>
              Bu tarixdə tamamlanmış sifariş mövcud deyil
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ title, value, icon: Icon, color, bgColor }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: bgColor,
          borderRadius: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} style={{ color }} />
        </div>
        <div>
          <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>
            {title}
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1f2937' }}>
            {value}
          </div>
        </div>
      </div>
    </div>
  );
}

// Progress Card Component
function ProgressCard({ title, percentage, color, bgColor }) {
  return (
    <div style={{
      padding: '1.5rem',
      background: bgColor,
      borderRadius: '0.75rem',
      border: '1px solid #e5e7eb'
    }}>
      <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
        {title}
      </div>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', color, marginBottom: '0.5rem' }}>
        {percentage}%
      </div>
      <div style={{
        width: '100%',
        height: '8px',
        background: '#e5e7eb',
        borderRadius: '4px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: '4px',
          transition: 'width 0.3s ease'
        }} />
      </div>
    </div>
  );
}

export default DailyProcesses;
