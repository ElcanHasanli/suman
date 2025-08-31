import React, { useState, useMemo } from 'react';
import { useOrders } from '../../contexts/OrdersContext';
import { 
  Calendar, 
  DollarSign, 
  Package, 
  Users, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Truck,
  BarChart3,
  Search,
  Filter,
  Download,
  Phone,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function DashboardContent() {
  const { customers: ctxCustomers, getOrdersForDate } = useOrders();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderSearch, setOrderSearch] = useState('');

  const customers = ctxCustomers && ctxCustomers.length > 0 ? ctxCustomers : [
    { id: 1, firstName: 'Əli', lastName: 'Məmmədov', phone: '+994501234567', pricePerBidon: 5 },
    { id: 2, firstName: 'Ayşə', lastName: 'Həsənova', phone: '+994551234567', pricePerBidon: 6 },
    { id: 3, firstName: 'Vüsal', lastName: 'Əliyev', phone: '+994701234567', pricePerBidon: 5 }
  ];

  const dailyOrders = useMemo(() => getOrdersForDate(selectedDate), [getOrdersForDate, selectedDate]);

  const testCouriers = {
    1: { name: 'Əli Məmmədov', phone: '+994501234567' },
    2: { name: 'Nicat Həsənov', phone: '+994551234567' }
  };

  // Seçilmiş tarixə görə sifarişlər artıq dailyOrders-dadır

  // Tamamlanmış sifarişlər
  const completedOrders = dailyOrders.filter(order => order.completed);
  
  // Gözləyən sifarişlər
  const pendingOrders = dailyOrders.filter(order => !order.completed);

  // Günlük gəlir hesabla
  const dailyRevenue = useMemo(() => {
    return completedOrders.reduce((total, order) => {
      const customer = customers.find(c => c.id === order.customerId);
      const pricePerBidon = customer?.pricePerBidon || 5;
      return total + (order.bidonOrdered * pricePerBidon);
    }, 0);
  }, [completedOrders]);

  // Kuryer performansı
  const courierPerformance = useMemo(() => {
    const courierStats = {};
    
    dailyOrders.forEach(order => {
      const courierId = order.courierId;
      if (!courierStats[courierId]) {
        courierStats[courierId] = {
          totalOrders: 0,
          completedOrders: 0,
          totalBidons: 0,
          totalRevenue: 0
        };
      }
      
      courierStats[courierId].totalOrders++;
      courierStats[courierId].totalBidons += order.bidonOrdered;
      
      if (order.completed) {
        courierStats[courierId].completedOrders++;
        const customer = customers.find(c => c.id === order.customerId);
        const pricePerBidon = customer?.pricePerBidon || 5;
        courierStats[courierId].totalRevenue += order.bidonOrdered * pricePerBidon;
      }
    });
    
    return courierStats;
  }, [dailyOrders]);

  // Müştəri məlumatını gətir
  const getCustomer = (id) => customers.find(c => c.id === id) || { firstName: 'Naməlum', lastName: 'Müştəri' };

  // Kuryer məlumatını gətir
  const getCourier = (id) => testCouriers[id] || { name: 'Naməlum Kuryer', phone: 'N/A' };

  // Tarix formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      day: 'numeric',
      month: 'short'
    });
  };

  // Vaxt formatla
  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('az-AZ', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = dailyOrders.filter(order => {
    const statusMatch = (
      filterStatus === 'all' ||
      (filterStatus === 'completed' && order.completed) ||
      (filterStatus === 'pending' && !order.completed)
    );

    if (!statusMatch) return false;

    if (!orderSearch) return true;

    const customer = getCustomer(order.customerId);
    const courier = getCourier(order.courierId);
    const haystack = [
      `#${order.id}`,
      `${customer.firstName} ${customer.lastName}`,
      courier.name,
      order.date,
      String(order.bidonOrdered)
    ].join(' ').toLowerCase();
    return haystack.includes(orderSearch.toLowerCase());
  });

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Formal Header Card (aligned with CustomerData) */}
      <div style={{ padding: '1rem' }}>
        <div style={{
          background: 'white',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
          border: '1px solid #f1f5f9',
          padding: '1.25rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%' }}>
              <div style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <BarChart3 size={24} color="white" />
              </div>
              <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', margin: '0 0 4px 0' }}>Günlük Proseslər</h1>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Seçilmiş tarix üçün sifarişlərin idarəsi</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                    outline: 'none',
                  }}
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    padding: '0.6rem 0.75rem',
                    border: '2px solid #e5e7eb',
                    borderRadius: '0.75rem',
                    fontSize: '0.95rem',
                    background: '#f9fafb',
                    color: '#374151',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">Bütün Sifarişlər</option>
                  <option value="completed">Tamamlanmış</option>
                  <option value="pending">Gözləyən</option>
                </select>
              </div>
            </div>

            <div style={{ position: 'relative', width: '100%', maxWidth: '600px' }}>
              <Search size={18} color="#6b7280" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Sifariş axtar... (ID, müştəri, kuryer, tarix, bidon)"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '1rem',
                  background: '#f9fafb',
                  transition: 'all 0.3s ease',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div style={{ padding: '1rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
        

         

         
        </div>

        {/* Courier Performance */}
        {Object.keys(courierPerformance).length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ 
              fontSize: '1.1rem', 
              fontWeight: '600', 
              color: '#374151', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              paddingLeft: '0.25rem'
            }}>
              <Truck size={20} style={{ color: '#0ea5e9' }} />
              Kuryer Performansı
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(courierPerformance).map(([courierId, stats]) => {
                const courier = getCourier(parseInt(courierId));
                const completionRate = stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;
                
                return (
                  <div key={courierId} style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: '700'
                      }}>
                        {courier.name.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: '#374151' }}>
                          {courier.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Phone size={12} />
                          {courier.phone}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr', 
                      gap: '1rem',
                      textAlign: 'center'
                    }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0ea5e9' }}>
                          {stats.completedOrders}/{stats.totalOrders}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Tamamlandı</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#10b981' }}>
                          {completionRate}%
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Uğur</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#8b5cf6' }}>
                          {stats.totalRevenue}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>AZN</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Orders List */}
        <div>
          <h2 style={{ 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            color: '#374151', 
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            paddingLeft: '0.25rem'
          }}>
            <Package size={20} style={{ color: '#0ea5e9' }} />
            Günlük Sifarişlər ({filteredOrders.length})
          </h2>

          {/* Desktop Table View (formal like CustomerData) */}
          {typeof window !== 'undefined' && window.innerWidth >= 768 && (
            <div style={{ background: 'white', borderRadius: '1rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)', border: '1px solid #f1f5f9', marginBottom: '1.5rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)', padding: '1.5rem' }}>
                <h3 style={{ color: 'white', margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>Sifariş Siyahısı</h3>
                <p style={{ color: '#d1d5db', margin: 0, fontSize: '0.875rem' }}>
                  {orderSearch ? `"${orderSearch}" axtarışı üçün nəticələr` : 'Bütün sifarişlər'}
                </p>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>ID</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Müştəri</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Kuryer</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Bidon</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Məbləğ</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Metod</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 'bold', color: '#1f2937', borderBottom: '2px solid #3b82f6' }}>Vaxt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '1.25rem', textAlign: 'center', color: '#6b7280' }}>
                          Nəticə tapılmadı
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map(order => {
                        const customer = getCustomer(order.customerId);
                        const courier = getCourier(order.courierId);
                        const orderAmount = order.bidonOrdered * (customer.pricePerBidon || 5);
                        return (
                          <tr key={order.id} style={{ background: '#fff' }}>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>#{order.id}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{customer.firstName} {customer.lastName}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{courier.name}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{order.bidonOrdered}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#16a34a', fontWeight: 700 }}>{orderAmount} AZN</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{order.completed && order.paymentMethod ? (order.paymentMethod === 'credit' ? 'Nəsiyə' : order.paymentMethod === 'card' ? 'Kart' : 'Nağd') : '—'}</td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                              <span style={{
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                background: order.completed ? '#d1fae5' : '#fef3c7',
                                color: order.completed ? '#065f46' : '#92400e',
                                border: `1px solid ${order.completed ? '#a7f3d0' : '#fde68a'}`
                              }}>
                                {order.completed ? 'Hazır' : 'Gözləyir'}
                              </span>
                            </td>
                            <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{order.completed ? formatTime(order.completedAt) : '—'}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Mobile Cards */}
          {filteredOrders.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem 1.5rem', 
              color: '#6b7280',
              background: 'white',
              borderRadius: '16px',
              border: '2px dashed #cbd5e1'
            }}>
              <Package size={48} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                Sifariş Yoxdur
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                {formatDate(selectedDate)} tarixində seçilmiş filtrdə sifariş yoxdur
              </p>
            </div>
          ) : (
            <div style={{ display: (typeof window !== 'undefined' && window.innerWidth >= 768) ? 'none' : 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredOrders.map(order => {
                const customer = getCustomer(order.customerId);
                const courier = getCourier(order.courierId);
                const orderAmount = order.bidonOrdered * (customer.pricePerBidon || 5);
                const isExpanded = expandedOrder === order.id;
                
                return (
                  <div key={order.id} style={{
                    background: 'white',
                    borderRadius: '16px',
                    border: `2px solid ${order.completed ? '#d1fae5' : '#fef3c7'}`,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    {/* Order Header */}
                    <div 
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      style={{
                        padding: '1.25rem',
                        cursor: 'pointer',
                        background: order.completed ? '#f0fdf4' : '#fffbeb',
                        borderBottom: isExpanded ? '1px solid #e5e7eb' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: '#374151' }}>
                            #{order.id} - {customer.firstName} {customer.lastName}
                          </h3>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                            Kuryer: {courier.name}
                          </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            background: order.completed ? '#d1fae5' : '#fef3c7',
                            color: order.completed ? '#065f46' : '#92400e',
                            border: `1px solid ${order.completed ? '#a7f3d0' : '#fde68a'}`
                          }}>
                            {order.completed ? 'Hazır' : 'Gözləyir'}
                          </div>
                          {isExpanded ? <ChevronUp size={20} color="#6b7280" /> : <ChevronDown size={20} color="#6b7280" />}
                        </div>
                      </div>

                      {/* Quick Stats */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr 1fr', 
                        gap: '1rem',
                        textAlign: 'center'
                      }}>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#3b82f6' }}>
                            {order.bidonOrdered}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>bidon</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#10b981' }}>
                            {orderAmount}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>AZN</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#f59e0b' }}>
                            {order.completed ? formatTime(order.completedAt) : 'N/A'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>vaxt</div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div style={{ padding: '1.25rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {/* Customer Details */}
                          <div style={{ 
                            padding: '1rem',
                            background: '#f8fafc',
                            borderRadius: '12px'
                          }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#374151' }}>
                              Müştəri Məlumatları
                            </h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                              <Phone size={14} style={{ color: '#6b7280' }} />
                              <span style={{ fontSize: '0.85rem', color: '#374151' }}>{customer.phone}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                              Bidon qiyməti: {customer.pricePerBidon || 5} AZN
                            </div>
                          </div>

                          {/* Order Details */}
                          <div style={{ 
                            padding: '1rem',
                            background: '#f8fafc',
                            borderRadius: '12px'
                          }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#374151' }}>
                              Sifariş Detalları
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem' }}>
                              <div>
                                <span style={{ color: '#6b7280' }}>Sifariş edilən: </span>
                                <span style={{ fontWeight: '600', color: '#374151' }}>{order.bidonOrdered}</span>
                              </div>
                              <div>
                                <span style={{ color: '#6b7280' }}>Qaytarılan: </span>
                                <span style={{ fontWeight: '600', color: '#374151' }}>{order.bidonReturned}</span>
                              </div>
                              <div>
                                <span style={{ color: '#6b7280' }}>Kuryer götürdü: </span>
                                <span style={{ fontWeight: '600', color: '#374151' }}>{order.bidonTakenByCourier}</span>
                              </div>
                              
                            </div>
                            
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #e5e7eb' }}>
                              <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Ödəniş: </span>
                              <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                                {order.paymentMethod === 'credit' ? 'Nəsiyə' : 
                                 order.paymentMethod === 'card' ? 'Kart' : 'Nağd'}
                              </span>
                            </div>
                          </div>

                          {/* Courier Notes */}
                          {order.courierNotes && (
                            <div style={{ 
                              padding: '1rem',
                              background: '#fffbeb',
                              borderRadius: '12px',
                              border: '1px solid #fde68a'
                            }}>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#92400e' }}>
                                Kuryer Qeydi
                              </h4>
                              <p style={{ fontSize: '0.85rem', margin: 0, color: '#78350f', fontStyle: 'italic' }}>
                                "{order.courierNotes}"
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}