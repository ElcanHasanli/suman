import { useState, useContext, useMemo } from 'react';
import { Users, DollarSign, Droplets, CreditCard, AlertCircle, CheckCircle, TrendingUp, Calculator } from 'lucide-react';
import { OrdersContext } from '../../contexts/OrdersContext';

function BalancePanel() {
  const { orders = [], customers = [] } = useContext(OrdersContext);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Hər müştəri üçün qalıqları hesabla
const customerBalances = useMemo(() => {
  return customers
    .map(customer => {
      const customerOrders = orders.filter(order => order.customerId === customer.id);

      if (customerOrders.length === 0) return null; // <-- Əgər sifarişi yoxdursa, keç

      let totalBidonOrdered = 0;
      let totalBidonReturned = 0;
      let totalDebt = 0;
      let creditOrders = 0;
      let paidOrders = 0;

      customerOrders.forEach(order => {
        totalBidonOrdered += order.bidonOrdered || 0;
        totalBidonReturned += order.bidonReturned || 0;

        const orderAmount = (order.bidonOrdered || 0) * (customer.pricePerBidon || 5);

        if (order.paymentMethod === 'credit' || order.paymentMethod === null) {
          totalDebt += orderAmount;
          creditOrders++;
        } else {
          paidOrders++;
        }
      });

      const activeBidonBalance = totalBidonOrdered - totalBidonReturned;

      return {
        customer,
        totalBidonOrdered,
        totalBidonReturned,
        activeBidonBalance,
        totalDebt,
        creditOrders,
        paidOrders,
        totalOrders: customerOrders.length,
        lastOrderDate: customerOrders.length > 0
          ? Math.max(...customerOrders.map(o => new Date(o.date).getTime()))
          : null
      };
    })
    .filter(Boolean); // <-- `null` olanları (yəni sifarişsizləri) sil
}, [customers, orders]);


  // Statistikalar
  const totalStats = useMemo(() => {
    return customerBalances.reduce((acc, balance) => ({
      totalCustomers: acc.totalCustomers + 1,
      totalActiveBidons: acc.totalActiveBidons + balance.activeBidonBalance,
      totalDebt: acc.totalDebt + balance.totalDebt,
      customersWithDebt: acc.customersWithDebt + (balance.totalDebt > 0 ? 1 : 0)
    }), {
      totalCustomers: 0,
      totalActiveBidons: 0,
      totalDebt: 0,
      customersWithDebt: 0
    });
  }, [customerBalances]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
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
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
              <Calculator size={32} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                Qalıqlar Paneli
              </h1>
              <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
                Müştəri balansları və qalıq bidonlarının idarəsi
              </p>
            </div>
          </div>

          {/* Statistikalar */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1.5rem',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Users size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Ümumi Müştəri</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>
                {totalStats.totalCustomers}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <Droplets size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Aktiv Bidonlar</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>
                {totalStats.totalActiveBidons}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <DollarSign size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Ümumi Borc</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>
                {totalStats.totalDebt} AZN
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <AlertCircle size={24} />
                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>Borclu Müştəri</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: '800' }}>
                {totalStats.customersWithDebt}
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '2.5rem' }}>
          {/* Müştəri Balansları */}
          {customerBalances.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
              gap: '2rem' 
            }}>
              {customerBalances.map(balance => (
                <div key={balance.customer.id} style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '2rem',
                  border: balance.totalDebt > 0 ? '2px solid #fbbf24' : '2px solid #e5e7eb',
                  boxShadow: balance.totalDebt > 0 
                    ? '0 10px 30px rgba(251, 191, 36, 0.2)' 
                    : '0 4px 15px rgba(0, 0, 0, 0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  
                  {/* Status Badge */}
                  {balance.totalDebt > 0 ? (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <AlertCircle size={14} />
                      BORCLU
                    </div>
                  ) : (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      <CheckCircle size={14} />
                      TƏMİZ
                    </div>
                  )}

                  {/* Müştəri Məlumatları */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      background: balance.totalDebt > 0 
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem',
                      fontWeight: '800'
                    }}>
                      {balance.customer.firstName.charAt(0)}
                    </div>
                    
                    <div>
                      <h3 style={{ 
                        fontSize: '1.5rem', 
                        fontWeight: '700', 
                        color: '#1f2937', 
                        margin: '0 0 0.25rem 0' 
                      }}>
                        {balance.customer.firstName} {balance.customer.lastName}
                      </h3>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        {balance.customer.phone} • {balance.totalOrders} sifariş
                      </div>
                    </div>
                  </div>

                  {/* Qalıq Məlumatları */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#0ea5e9'
                      }}>
                        <Droplets size={16} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>AKTİV QALİQ</span>
                      </div>
                      <div style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: '800', 
                        color: balance.activeBidonBalance > 0 ? '#dc2626' : '#16a34a' 
                      }}>
                        {balance.activeBidonBalance}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>bidon</div>
                    </div>

                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        gap: '0.5rem',
                        marginBottom: '0.5rem',
                        color: '#f59e0b'
                      }}>
                        <DollarSign size={16} />
                        <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>AKTİV BORC</span>
                      </div>
                      <div style={{ 
                        fontSize: '1.8rem', 
                        fontWeight: '800', 
                        color: balance.totalDebt > 0 ? '#dc2626' : '#16a34a' 
                      }}>
                        {balance.totalDebt}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>AZN</div>
                    </div>
                  </div>

                  {/* Ətraflı Məlumatlar */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '1rem',
                    fontSize: '0.9rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#6b7280' }}>Verilmiş:</span>
                      <span style={{ fontWeight: '600', color: '#374151' }}>
                        {balance.totalBidonOrdered} bidon
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#6b7280' }}>Qaytarılmış:</span>
                      <span style={{ fontWeight: '600', color: '#374151' }}>
                        {balance.totalBidonReturned} bidon
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#6b7280' }}>Nəsiyə:</span>
                      <span style={{ fontWeight: '600', color: '#ef4444' }}>
                        {balance.creditOrders} sifariş
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #f3f4f6'
                    }}>
                      <span style={{ color: '#6b7280' }}>Ödənilmiş:</span>
                      <span style={{ fontWeight: '600', color: '#16a34a' }}>
                        {balance.paidOrders} sifariş
                      </span>
                    </div>
                  </div>

                  {/* Son Sifariş */}
                  {balance.lastOrderDate && (
                    <div style={{
                      marginTop: '1rem',
                      padding: '0.75rem',
                      background: '#f1f5f9',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: '#64748b',
                      textAlign: 'center'
                    }}>
                      Son sifariş: {new Date(balance.lastOrderDate).toLocaleDateString('az-AZ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '4rem 2rem',
              color: '#6b7280',
              background: 'white',
              borderRadius: '16px',
              border: '2px dashed #cbd5e1'
            }}>
              <Users size={64} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#475569' }}>
                Müştəri Yoxdur
              </h3>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>
                Qalıqları görmək üçün əvvəlcə müştəri və sifariş əlavə edin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BalancePanel;