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
  Filter,
  Download
} from 'lucide-react';

export default function DashboardContent() {
  const { orders, customers } = useOrders();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');

  // Test məlumatları - backend hazır olduqda real API-dən gələcək
  const testOrders = [
    {
      id: 1,
      customerId: 1,
      courierId: 1,
      date: '2024-01-15',
      bidonOrdered: 10,
      bidonReturned: 8,
      bidonTakenByCourier: 2,
      bidonRemaining: 0,
      paymentMethod: 'cash',
      completed: true,
      completedAt: '2024-01-15T14:30:00',
      courierNotes: 'Müştəri evdə idi, sifariş uğurla çatdırıldı'
    },
    {
      id: 2,
      customerId: 2,
      courierId: 2,
      date: '2024-01-15',
      bidonOrdered: 15,
      bidonReturned: 0,
      bidonTakenByCourier: 0,
      bidonRemaining: 15,
      paymentMethod: 'credit',
      completed: false,
      completedAt: null,
      courierNotes: 'Müştəri evdə deyildi, növbəti dəfə çatdırılacaq'
    },
    {
      id: 3,
      customerId: 3,
      courierId: 1,
      date: '2024-01-15',
      bidonOrdered: 8,
      bidonReturned: 6,
      bidonTakenByCourier: 2,
      bidonRemaining: 0,
      paymentMethod: 'cash',
      completed: true,
      completedAt: '2024-01-15T16:45:00',
      courierNotes: 'Sifariş tamamlandı, müştəri məmnun'
    }
  ];

  // Əgər orders boşdursa, test məlumatlarından istifadə edirik
  const displayOrders = orders.length > 0 ? orders : testOrders;

  // Seçilmiş tarixə görə sifarişləri filtrlə
  const dailyOrders = useMemo(() => {
    return displayOrders.filter(order => order.date === selectedDate);
  }, [displayOrders, selectedDate]);

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
  }, [completedOrders, customers]);

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
  }, [dailyOrders, customers]);

  // Müştəri məlumatını gətir
  const getCustomer = (id) => customers.find(c => c.id === id) || { firstName: 'Naməlum', lastName: 'Müştəri' };

  // Kuryer məlumatını gətir (test məlumatları)
  const getCourier = (id) => {
    const testCouriers = {
      1: { name: 'Əli Məmmədov', phone: '+994501234567' },
      2: { name: 'Nicat Həsənov', phone: '+994551234567' }
    };
    return testCouriers[id] || { name: 'Naməlum Kuryer', phone: 'N/A' };
  };

  // Tarix formatla
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('az-AZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', 
      padding: '2rem' 
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          color: 'white',
          padding: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            opacity: 0.3
          }}></div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <BarChart3 size={32} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                Günlük Proseslər
              </h1>
              <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
                {formatDate(selectedDate)} - Günlük sifarişlər və gəlir hesabatı
              </p>
            </div>
          </div>

          {/* Tarix Seçimi və Filtrlər */}
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            alignItems: 'center',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{ position: 'relative' }}>
              <Calendar size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)' }} />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.9)',
                  color: '#374151',
                  outline: 'none',
                  minWidth: '180px'
                }}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                outline: 'none',
                cursor: 'pointer',
                minWidth: '150px'
              }}
            >
              <option value="all">Bütün Sifarişlər</option>
              <option value="completed">Tamamlanmış</option>
              <option value="pending">Gözləyən</option>
            </select>

            <button
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#0284c7',
                border: 'none',
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
            >
              <Download size={18} />
              Hesabat Yüklə
            </button>
          </div>
        </div>

        <div style={{ padding: '2.5rem' }}>
          
          {/* Günlük Statistikalar */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '3rem'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Package size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>ÜMUMİ SİFARİŞ</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {dailyOrders.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>bugün</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <CheckCircle size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>TAMAMLANMIŞ</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {completedOrders.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>sifariş</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Clock size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>GÖZLƏYƏN</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {pendingOrders.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>sifariş</div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '20px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <DollarSign size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>GÜNLÜK GƏLİR</span>
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {dailyRevenue}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>AZN</div>
            </div>
          </div>

          {/* Kuryer Performansı */}
          {Object.keys(courierPerformance).length > 0 && (
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ 
                fontSize: '1.8rem', 
                fontWeight: '700', 
                color: '#1f2937', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Truck size={24} style={{ color: '#0ea5e9' }} />
                Kuryer Performansı
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '1.5rem' 
              }}>
                {Object.entries(courierPerformance).map(([courierId, stats]) => {
                  const courier = getCourier(parseInt(courierId));
                  const completionRate = stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0;
                  
                  return (
                    <div key={courierId} style={{
                      background: 'white',
                      borderRadius: '16px',
                      padding: '1.5rem',
                      border: '1px solid #e5e7eb',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '700'
                        }}>
                          {courier.name.charAt(0)}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: '#1f2937' }}>
                            {courier.name}
                          </h3>
                          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            {courier.phone}
                          </div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '1rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#0ea5e9' }}>
                            {stats.completedOrders}/{stats.totalOrders}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Tamamlanmış</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                            {completionRate}%
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Uğur Dərəcəsi</div>
                        </div>
                      </div>
                      
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '0.9rem',
                        color: '#6b7280'
                      }}>
                        <span>Ümumi bidon: {stats.totalBidons}</span>
                        <span>Gəlir: {stats.totalRevenue} AZN</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Günlük Sifarişlər */}
          <div>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: '700', 
              color: '#1f2937', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Package size={24} style={{ color: '#0ea5e9' }} />
              Günlük Sifarişlər
            </h2>

            {dailyOrders.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: '#6b7280',
                background: 'white',
                borderRadius: '16px',
                border: '2px dashed #cbd5e1'
              }}>
                <Package size={64} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#475569' }}>
                  Sifariş Yoxdur
                </h3>
                <p style={{ margin: 0, fontSize: '1.1rem' }}>
                  {formatDate(selectedDate)} tarixində heç bir sifariş yoxdur
                </p>
              </div>
            ) : (
              <div style={{ 
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', 
                  padding: '1.5rem',
                  borderBottom: '1px solid #e5e7eb'
                }}>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                    gap: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#64748b'
                  }}>
                    <div>Sifariş ID</div>
                    <div>Müştəri</div>
                    <div>Kuryer</div>
                    <div>Bidon</div>
                    <div>Status</div>
                    <div>Ödəniş</div>
                    <div>Tamamlanma</div>
                    <div>Qeydlər</div>
                  </div>
                </div>

                {dailyOrders.map(order => {
                  const customer = getCustomer(order.customerId);
                  const courier = getCourier(order.courierId);
                  const orderAmount = order.bidonOrdered * (customer.pricePerBidon || 5);
                  
                  return (
                    <div key={order.id} style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                      gap: '1rem',
                      padding: '1.5rem',
                      borderBottom: '1px solid #f3f4f6',
                      alignItems: 'center',
                      fontSize: '0.9rem',
                      background: order.completed ? '#f0fdf4' : '#fffbeb'
                    }}>
                      <div style={{ fontWeight: '600', color: '#374151' }}>
                        #{order.id}
                      </div>
                      
                      <div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {customer.phone}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {courier.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {courier.phone}
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {order.bidonOrdered}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          bidon
                        </div>
                      </div>
                      
                      <div>
                        <div style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          background: order.completed ? '#d1fae5' : '#fef3c7',
                          color: order.completed ? '#065f46' : '#92400e',
                          border: `1px solid ${order.completed ? '#a7f3d0' : '#fde68a'}`,
                          textAlign: 'center'
                        }}>
                          {order.completed ? 'Tamamlanmış' : 'Gözləyir'}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ fontWeight: '600', color: '#374151' }}>
                          {orderAmount} AZN
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                          {order.paymentMethod === 'credit' ? 'Nəsiyə' : 'Nağd'}
                        </div>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {order.completed ? formatTime(order.completedAt) : 'N/A'}
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', color: '#6b7280', fontStyle: 'italic' }}>
                        {order.courierNotes || 'Qeyd yoxdur'}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
