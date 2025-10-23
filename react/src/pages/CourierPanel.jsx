import React, { useState, useEffect } from 'react';
import { User, Package, Clock, CheckCircle, MapPin, CreditCard, Banknote, Calendar, LogOut, Eye, Moon, Sun, Play, Check, AlertCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUpdateOrderStatusMutation, useCompleteOrderByCourierMutation } from '../services/apiSlice';
const KuryerSistemi = () => {
  const [currentUser, setCurrentUser] = useState('kuryer1');
  const [sifarishler, setSifarishler] = useState([]);
  const [tamamlananSifarishler, setTamamlananSifarishler] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    bidonSayi: '',
    mebleg: '',
    odenisNovu: 'nagd',
    bosBidonSayi: '',
    olanBidonSayi: '',
    vermeliBidonSayi: ''
  });
  
  const [updateOrderStatusAPI] = useUpdateOrderStatusMutation();
  const [completeOrderByCourier] = useCompleteOrderByCourierMutation();

  const mockSifarishler = [
    {
      id: 1,
      musteri: 'Əli Məmmədov',
      telefon: '+994501234567',
      unvan: 'Nizami rayonu, Həsən bəy Zərdabi 125',
      sifarishMelumat: '5L su - 3 ədəd',
      kuryer: 'kuryer1',
      status: 'təyin edilib',
      tarix: '2025-06-28',
      saat: '14:30'
    },
    {
      id: 2,
      musteri: 'Leyla Həsənova',
      telefon: '+994559876543',
      unvan: 'Yasamal rayonu, Şərifə Əliyeva 89',
      sifarishMelumat: '19L su - 1 ədəd, 5L su - 2 ədəd',
      kuryer: 'kuryer1',
      status: 'başlanıldı',
      tarix: '2025-06-28',
      saat: '15:00'
    },
    {
      id: 3,
      musteri: 'Rəşad Quliyev',
      telefon: '+994703334455',
      unvan: 'Sabunçu rayonu, Bakıxanov 23',
      sifarishMelumat: '19L su - 2 ədəd',
      kuryer: 'kuryer2',
      status: 'təyin edilib',
      tarix: '2025-06-28',
      saat: '16:15'
    }
  ];

  const kuryerler = {
    kuryer1: { ad: 'Orxan Əliyev', telefon: '+994501111111' },
    kuryer2: { ad: 'Tərlan Həsənov', telefon: '+994502222222' }
  };

  useEffect(() => {
    setSifarishler(mockSifarishler);
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    setSifarishler(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleStartOrder = async (orderId) => {
    try {
      await updateOrderStatusAPI({ orderId, status: 'başlanıldı' }).unwrap();
      updateOrderStatus(orderId, 'başlanıldı');
      toast.success('Sifarişə başladınız!');
    } catch (error) {
      console.error('Status update error:', error);
      toast.error('Status yenilənərkən xəta baş verdi');
    }
  };

  const completeOrder = async () => {
    if (!deliveryData.bidonSayi || !deliveryData.mebleg || !deliveryData.bosBidonSayi || !deliveryData.olanBidonSayi || !deliveryData.vermeliBidonSayi) {
      toast.warning('Zəhmət olmasa bütün məlumatları doldurun!');
      return;
    }

    try {
      const completedOrder = {
        ...selectedOrder,
        status: 'tamamlandı',
        bidonSayi: parseInt(deliveryData.bidonSayi),
        mebleg: parseFloat(deliveryData.mebleg),
        odenisNovu: deliveryData.odenisNovu,
        bosBidonSayi: parseInt(deliveryData.bosBidonSayi),
        olanBidonSayi: parseInt(deliveryData.olanBidonSayi),
        vermeliBidonSayi: parseInt(deliveryData.vermeliBidonSayi),
        tamamlanmaTarixi: new Date().toLocaleDateString('az-AZ'),
        tamamlanmaSaati: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
      };

      await completeOrderByCourier({ orderId: selectedOrder.id, ...completedOrder }).unwrap();
      
      setTamamlananSifarishler(prev => [...prev, completedOrder]);
      setSifarishler(prev => prev.filter(order => order.id !== selectedOrder.id));

      setSelectedOrder(null);
      setDeliveryData({ 
        bidonSayi: '', 
        mebleg: '', 
        odenisNovu: 'nagd',
        bosBidonSayi: '',
        olanBidonSayi: '',
        vermeliBidonSayi: ''
      });

      toast.success('Sifariş uğurla tamamlandı!');
    } catch (error) {
      console.error('Complete order error:', error);
      toast.error('Sifariş tamamlanarkən xəta baş verdi');
    }
  };

  const filteredSifarishler = sifarishler.filter(order => order.kuryer === currentUser);
  const filteredTamamlanan = tamamlananSifarishler.filter(order => order.kuryer === currentUser);

  const theme = {
    bg: darkMode ? '#0f172a' : '#f8fafc',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#111827',
    textSecondary: darkMode ? '#94a3b8' : '#6b7280',
    border: darkMode ? '#334155' : '#e5e7eb',
    headerBg: darkMode ? '#1f2937' : '#ffffff',
    completedBg: darkMode ? '#064e3b' : '#f0fdf4',
    completedBorder: darkMode ? '#065f46' : '#a7f3d0',
    inputBg: darkMode ? '#334155' : '#ffffff',
    inputBorder: darkMode ? '#475569' : '#e5e7eb',
    modalOverlay: darkMode ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.3)'
  };

  const getStatusColor = (status) => {
    if (darkMode) {
      return {
        'təyin edilib': { bg: '#1e3a8a', text: '#bfdbfe' },
        'başlanıldı': { bg: '#a16207', text: '#fef3c7' },
        'tamamlandı': { bg: '#065f46', text: '#d1fae5' }
      }[status];
    } else {
      return {
        'təyin edilib': { bg: '#dbeafe', text: '#1e40af' },
        'başlanıldı': { bg: '#fef3c7', text: '#d97706' },
        'tamamlandı': { bg: '#d1fae5', text: '#065f46' }
      }[status];
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: theme.bg, 
      padding: '16px',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          borderRadius: '16px', 
          boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
          border: `1px solid ${theme.border}`,
          padding: '24px', 
          marginBottom: '24px',
          transition: 'all 0.3s ease',
          background: darkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' 
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}>
                <User size={28} color="white" />
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '26px', 
                  fontWeight: '700', 
                  color: theme.text, 
                  margin: 0,
                  transition: 'color 0.3s ease'
                }}>
                  {kuryerler[currentUser]?.ad}
                </h1>
                <p style={{ 
                  color: theme.textSecondary, 
                  margin: '4px 0 0 0',
                  transition: 'color 0.3s ease',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Calendar size={14} />
                  {new Date().toLocaleDateString('az-AZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="dark-mode-toggle"
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: theme.text,
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid ' + theme.border,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <NavLink to="/login">
                <button
                  className="logout-btn"
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <LogOut size={18} />
                  Çıxış
                </button>
              </NavLink>
            </div>
          </div>
        </div>

        {/* Aktiv sifarişlər */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          borderRadius: '16px', 
          boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
          border: `1px solid ${theme.border}`,
          padding: '24px', 
          marginBottom: '24px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
            }}>
              <Package size={20} color="white" />
            </div>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: theme.text, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Aktiv Sifarişlər
            </h2>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: darkMode ? '#1e3a8a' : '#dbeafe',
              color: darkMode ? '#bfdbfe' : '#1e40af',
              marginLeft: 'auto'
            }}>
              {filteredSifarishler.length}
            </span>
          </div>
          {filteredSifarishler.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: theme.textSecondary }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: darkMode ? '#1e293b' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <Package size={40} color={theme.textSecondary} />
              </div>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>Aktiv sifariş yoxdur</p>
              <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>Yeni sifarişlər burada görünəcək</p>
            </div>
          ) : (
            filteredSifarishler.map((order) => (
              <div key={order.id} className="order-card" style={{ 
                border: `1px solid ${theme.border}`, 
                borderRadius: '12px', 
                padding: '18px', 
                marginBottom: '14px',
                transition: 'all 0.3s ease',
                background: theme.cardBg,
                cursor: 'pointer'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        fontSize: '18px', 
                        color: theme.text, 
                        margin: 0,
                        transition: 'color 0.3s ease'
                      }}>
                        {order.musteri}
                      </h3>
                      <span style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: getStatusColor(order.status).bg,
                        color: getStatusColor(order.status).text,
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                        <p style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Clock size={14} />
                          <strong>Saat:</strong> {order.saat}
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Telefon:</strong> {order.telefon}
                        </p>
                      </div>
                      <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                        <p style={{ margin: '0 0 6px 0' }}>
                          <strong>Ünvan:</strong> {order.unvan}
                        </p>
                        <p style={{ margin: 0 }}>
                          <strong>Sifariş:</strong> {order.sifarishMelumat}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {order.status === 'təyin edilib' && (
                      <button
                        onClick={() => handleStartOrder(order.id)}
                        className="start-order-btn"
                        style={{ 
                          backgroundColor: '#10b981', 
                          color: 'white', 
                          padding: '10px 18px', 
                          borderRadius: '10px', 
                          border: 'none', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          transition: 'all 0.3s ease',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        <Play size={16} />
                        Başla
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="view-order-btn"
                      style={{ 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        padding: '10px 18px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        cursor: 'pointer', 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      <Eye size={16} />
                      Bax
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bugün tamamlanan sifarişlər */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          borderRadius: '16px', 
          boxShadow: darkMode ? '0 4px 6px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.05)',
          border: `1px solid ${theme.border}`,
          padding: '24px', 
          marginBottom: '24px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <CheckCircle size={20} color="white" />
            </div>
            <h2 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: theme.text, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Bugün Tamamlanan Sifarişlər
            </h2>
            <span style={{
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '600',
              backgroundColor: darkMode ? '#065f46' : '#d1fae5',
              color: darkMode ? '#d1fae5' : '#065f46',
              marginLeft: 'auto'
            }}>
              {filteredTamamlanan.length}
            </span>
          </div>
          {filteredTamamlanan.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: theme.textSecondary }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: darkMode ? '#1e293b' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px auto'
              }}>
                <CheckCircle size={40} color={theme.textSecondary} />
              </div>
              <p style={{ fontSize: '18px', fontWeight: '500' }}>Bugün tamamlanan sifariş yoxdur</p>
              <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>Tamamladığınız sifarişlər burada görünəcək</p>
            </div>
          ) : (
            filteredTamamlanan.map((order) => (
              <div key={order.id} className="completed-order-card" style={{ 
                border: `1px solid ${theme.completedBorder}`, 
                borderRadius: '12px', 
                padding: '18px', 
                marginBottom: '14px', 
                backgroundColor: theme.completedBg,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                      <h3 style={{ 
                        fontWeight: '600', 
                        fontSize: '18px', 
                        color: theme.text, 
                        margin: 0,
                        transition: 'color 0.3s ease'
                      }}>
                        {order.musteri}
                      </h3>
                      <span style={{ 
                        padding: '6px 14px', 
                        borderRadius: '20px', 
                        fontSize: '12px', 
                        fontWeight: '600', 
                        backgroundColor: getStatusColor('tamamlandı').bg, 
                        color: getStatusColor('tamamlandı').text,
                        transition: 'all 0.3s ease',
                        whiteSpace: 'nowrap'
                      }}>
                        ✓ Tamamlandı
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px', color: theme.textSecondary }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} />
                        <p style={{ margin: '0 0 4px 0' }}><strong>Tamamlanma:</strong> {order.tamamlanmaSaati}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0' }}><strong>Bidon sayı:</strong> {order.bidonSayi}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Banknote size={14} />
                          <strong>Məbləğ:</strong> {order.mebleg} ₼
                        </p>
                      </div>
                      <div>
                        <p style={{ margin: 0 }}>
                          <CreditCard size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          <strong>Ödəniş:</strong> {order.odenisNovu}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sifariş detalları modalı */}
        {selectedOrder && (
          <div style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            backgroundColor: theme.modalOverlay, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 1000,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              backgroundColor: theme.cardBg, 
              borderRadius: '12px', 
              maxWidth: '800px', 
              width: '90%', 
              maxHeight: '90vh', 
              overflowY: 'auto',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                backgroundColor: theme.headerBg, 
                color: 'white', 
                padding: '24px', 
                borderTopLeftRadius: '12px', 
                borderTopRightRadius: '12px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={20} color="white" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Sifariş Detalları</h2>
                    <p style={{ opacity: 0.9, margin: '4px 0 0 0', fontSize: '14px' }}>ID: #{selectedOrder.id}</p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Müştəri</label>
                    <p style={{ 
                      fontSize: '18px', 
                      fontWeight: '600', 
                      color: theme.text, 
                      margin: '4px 0 16px 0',
                      transition: 'color 0.3s ease'
                    }}>
                      {selectedOrder.musteri}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Telefon</label>
                    <p style={{ 
                      fontSize: '18px', 
                      color: theme.text, 
                      margin: '4px 0 16px 0',
                      transition: 'color 0.3s ease'
                    }}>
                      {selectedOrder.telefon}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Ünvan</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <MapPin size={20} color="#ef4444" />
                    <p style={{ 
                      fontSize: '18px', 
                      color: theme.text, 
                      margin: 0,
                      transition: 'color 0.3s ease'
                    }}>
                      {selectedOrder.unvan}
                    </p>
                  </div>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Sifariş məlumatı</label>
                  <p style={{ 
                    fontSize: '18px', 
                    color: theme.text, 
                    backgroundColor: darkMode ? '#374151' : '#f9fafb', 
                    padding: '12px', 
                    borderRadius: '8px', 
                    margin: '4px 0 0 0',
                    transition: 'all 0.3s ease'
                  }}>
                    {selectedOrder.sifarishMelumat}
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Tarix</label>
                    <p style={{ 
                      fontSize: '18px', 
                      color: theme.text, 
                      margin: '4px 0 0 0',
                      transition: 'color 0.3s ease'
                    }}>
                      {selectedOrder.tarix}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Saat</label>
                    <p style={{ 
                      fontSize: '18px', 
                      color: theme.text, 
                      margin: '4px 0 0 0',
                      transition: 'color 0.3s ease'
                    }}>
                      {selectedOrder.saat}
                    </p>
                  </div>
                  <div>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary }}>Status</label>
                    <p style={{
                      fontSize: '18px', 
                      fontWeight: '600', 
                      margin: '4px 0 0 0', 
                      color: getStatusColor(selectedOrder.status).text,
                      transition: 'color 0.3s ease'
                    }}>
                      {selectedOrder.status}
                    </p>
                  </div>
                </div>

                {selectedOrder.status !== 'tamamlandı' && (
                  <>
                    <div style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '16px', color: theme.text, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Package size={20} />
                        Çatdırılma Məlumatları
                      </h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                        <div>
                          <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                            Nə qədər aldım (ədəd)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={deliveryData.bidonSayi}
                            onChange={(e) => setDeliveryData(prev => ({ ...prev, bidonSayi: e.target.value }))}
                            placeholder="Məsələn: 5"
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${theme.inputBorder}`, 
                              fontSize: '16px', 
                              outline: 'none',
                              backgroundColor: theme.inputBg,
                              color: theme.text,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                            Nə qədər çatdırdım (ədəd)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={deliveryData.olanBidonSayi}
                            onChange={(e) => setDeliveryData(prev => ({ ...prev, olanBidonSayi: e.target.value }))}
                            placeholder="Məsələn: 5"
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${theme.inputBorder}`, 
                              fontSize: '16px', 
                              outline: 'none',
                              backgroundColor: theme.inputBg,
                              color: theme.text,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                            Nə qədər verməli idi (ədəd)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={deliveryData.vermeliBidonSayi}
                            onChange={(e) => setDeliveryData(prev => ({ ...prev, vermeliBidonSayi: e.target.value }))}
                            placeholder="Məsələn: 5"
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${theme.inputBorder}`, 
                              fontSize: '16px', 
                              outline: 'none',
                              backgroundColor: theme.inputBg,
                              color: theme.text,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                            Boş bidon götürdüm (ədəd)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={deliveryData.bosBidonSayi}
                            onChange={(e) => setDeliveryData(prev => ({ ...prev, bosBidonSayi: e.target.value }))}
                            placeholder="Məsələn: 3"
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${theme.inputBorder}`, 
                              fontSize: '16px', 
                              outline: 'none',
                              backgroundColor: theme.inputBg,
                              color: theme.text,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                            Məbləğ (₼)
                          </label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={deliveryData.mebleg}
                            onChange={(e) => setDeliveryData(prev => ({ ...prev, mebleg: e.target.value }))}
                            placeholder="Məsələn: 25.00"
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${theme.inputBorder}`, 
                              fontSize: '16px', 
                              outline: 'none',
                              backgroundColor: theme.inputBg,
                              color: theme.text,
                              transition: 'all 0.3s ease'
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>
                            Ödəniş növü
                          </label>
                          <select
                            value={deliveryData.odenisNovu}
                            onChange={(e) => setDeliveryData(prev => ({ ...prev, odenisNovu: e.target.value }))}
                            style={{ 
                              width: '100%', 
                              padding: '10px 12px', 
                              borderRadius: '8px', 
                              border: `1px solid ${theme.inputBorder}`, 
                              fontSize: '16px', 
                              outline: 'none',
                              backgroundColor: theme.inputBg,
                              color: theme.text,
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <option value="nagd">Nağd</option>
                            <option value="plastik">Plastik</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        className="modal-close-btn"
                        style={{ 
                          padding: '10px 20px', 
                          borderRadius: '10px', 
                          border: `1px solid ${theme.border}`, 
                          backgroundColor: theme.cardBg, 
                          color: theme.text,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontWeight: '600'
                        }}
                      >
                        Bağla
                      </button>
                      <button
                        onClick={completeOrder}
                        className="modal-complete-btn"
                        style={{ 
                          padding: '10px 20px', 
                          borderRadius: '10px', 
                          border: 'none', 
                          backgroundColor: '#10b981', 
                          color: 'white', 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          fontWeight: '600',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        ✓ Tamamla
                      </button>
                    </div>
                  </>
                )}

                {selectedOrder.status === 'tamamlandı' && (
                  <div style={{ marginTop: '24px', textAlign: 'center', color: '#059669' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px auto',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                      <CheckCircle size={40} color="white" />
                    </div>
                    <p style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Bu sifariş artıq tamamlanıb.</p>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="modal-completed-close-btn"
                      style={{ 
                        marginTop: '12px', 
                        padding: '10px 20px', 
                        borderRadius: '10px', 
                        border: 'none', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        fontWeight: '600',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                      }}
                    >
                      Bağla
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Hover effects for buttons */
        .dark-mode-toggle:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4) !important;
        }
        
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .view-order-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4) !important;
        }
        
        .start-order-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4) !important;
        }
        
        .completed-order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        
        .modal-close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .modal-complete-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4) !important;
        }
        
        .modal-completed-close-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4) !important;
        }
        
        /* Input focus effects */
        input:focus,
        select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .order-card {
            padding: 14px !important;
          }
          
          .view-order-btn {
            padding: 8px 14px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default KuryerSistemi;