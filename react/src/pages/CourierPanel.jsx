import React, { useState, useEffect } from 'react';
import { User, Package, Clock, CheckCircle, MapPin, CreditCard, Banknote, Calendar, LogOut, Eye, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
const KuryerSistemi = () => {
  const [currentUser, setCurrentUser] = useState('kuryer1');
  const [sifarishler, setSifarishler] = useState([]);
  const [tamamlananSifarishler, setTamamlananSifarishler] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    bidonSayi: '',
    mebleg: '',
    odenisNovu: 'nagd'
  });

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

  const completeOrder = () => {
    if (!deliveryData.bidonSayi || !deliveryData.mebleg) {
      alert('Bütün məlumatları doldurun!');
      return;
    }

    const completedOrder = {
      ...selectedOrder,
      status: 'tamamlandı',
      bidonSayi: parseInt(deliveryData.bidonSayi),
      mebleg: parseFloat(deliveryData.mebleg),
      odenisNovu: deliveryData.odenisNovu,
      tamamlanmaTarixi: new Date().toLocaleDateString('az-AZ'),
      tamamlanmaSaati: new Date().toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' })
    };

    setTamamlananSifarishler(prev => [...prev, completedOrder]);
    setSifarishler(prev => prev.filter(order => order.id !== selectedOrder.id));

    setSelectedOrder(null);
    setDeliveryData({ bidonSayi: '', mebleg: '', odenisNovu: 'nagd' });

    alert('Sifariş uğurla tamamlandı!');
  };

  const filteredSifarishler = sifarishler.filter(order => order.kuryer === currentUser);
  const filteredTamamlanan = tamamlananSifarishler.filter(order => order.kuryer === currentUser);

  const theme = {
    bg: darkMode ? '#0f172a' : '#f3f4f6',
    cardBg: darkMode ? '#1e293b' : '#ffffff',
    text: darkMode ? '#f1f5f9' : '#1f2937',
    textSecondary: darkMode ? '#94a3b8' : '#6b7280',
    border: darkMode ? '#334155' : '#e5e7eb',
    headerBg: darkMode ? '#1e40af' : '#3b82f6',
    completedBg: darkMode ? '#064e3b' : '#ecfdf5',
    completedBorder: darkMode ? '#065f46' : '#bbf7d0',
    inputBg: darkMode ? '#334155' : '#ffffff',
    inputBorder: darkMode ? '#475569' : '#d1d5db',
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
          borderRadius: '12px', 
          boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '24px', 
          marginBottom: '24px',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: 'bold', 
                color: theme.text, 
                margin: 0,
                transition: 'color 0.3s ease'
              }}>
                Xoş gəlmisiniz, {kuryerler[currentUser]?.ad}
              </h1>
              <p style={{ 
                color: theme.textSecondary, 
                margin: '4px 0 0 0',
                transition: 'color 0.3s ease'
              }}>
                Kuryer Paneli - {new Date().toLocaleDateString('az-AZ')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  backgroundColor: darkMode ? '#374151' : '#f3f4f6',
                  color: theme.text,
                  padding: '8px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <NavLink to="/login">
              <button
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={16} />
                Çıxış
              </button>
            </NavLink>
            </div>
          </div>
        </div>

        {/* Aktiv sifarişlər */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          borderRadius: '12px', 
          boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '24px', 
          marginBottom: '24px',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: theme.text, 
            marginBottom: '16px',
            transition: 'color 0.3s ease'
          }}>
            Aktiv Sifarişlər
          </h2>
          {filteredSifarishler.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: theme.textSecondary }}>
              <Package size={64} color={theme.textSecondary} style={{ margin: '0 auto 16px auto' }} />
              <p style={{ fontSize: '18px' }}>Aktiv sifariş yoxdur</p>
            </div>
          ) : (
            filteredSifarishler.map((order) => (
              <div key={order.id} style={{ 
                border: `1px solid ${theme.border}`, 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: getStatusColor(order.status).bg,
                        color: getStatusColor(order.status).text,
                        transition: 'all 0.3s ease'
                      }}>
                        {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                      <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                        <p style={{ margin: '0 0 4px 0' }}><strong>Telefon:</strong> {order.telefon}</p>
                        <p style={{ margin: 0 }}><strong>Saat:</strong> {order.saat}</p>
                      </div>
                      <div style={{ fontSize: '14px', color: theme.textSecondary }}>
                        <p style={{ margin: '0 0 4px 0' }}><strong>Ünvan:</strong> {order.unvan}</p>
                        <p style={{ margin: 0 }}><strong>Sifariş:</strong> {order.sifarishMelumat}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    style={{ 
                      backgroundColor: '#3b82f6', 
                      color: 'white', 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      border: 'none', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Eye size={16} />
                    Bax
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bugün tamamlanan sifarişlər */}
        <div style={{ 
          backgroundColor: theme.cardBg, 
          borderRadius: '12px', 
          boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
          padding: '24px', 
          marginBottom: '24px',
          transition: 'all 0.3s ease'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            color: theme.text, 
            marginBottom: '16px',
            transition: 'color 0.3s ease'
          }}>
            Bugün Tamamlanan Sifarişlər
          </h2>
          {filteredTamamlanan.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0', color: theme.textSecondary }}>
              <CheckCircle size={64} color={theme.textSecondary} style={{ margin: '0 auto 16px auto' }} />
              <p style={{ fontSize: '18px' }}>Bugün tamamlanan sifariş yoxdur</p>
            </div>
          ) : (
            filteredTamamlanan.map((order) => (
              <div key={order.id} style={{ 
                border: `1px solid ${theme.completedBorder}`, 
                borderRadius: '8px', 
                padding: '16px', 
                marginBottom: '16px', 
                backgroundColor: theme.completedBg,
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
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
                        padding: '4px 12px', 
                        borderRadius: '9999px', 
                        fontSize: '12px', 
                        fontWeight: '500', 
                        backgroundColor: getStatusColor('tamamlandı').bg, 
                        color: getStatusColor('tamamlandı').text,
                        transition: 'all 0.3s ease'
                      }}>
                        Tamamlandı
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '14px', color: theme.textSecondary }}>
                      <div>
                        <p style={{ margin: '0 0 4px 0' }}><strong>Tamamlanma:</strong> {order.tamamlanmaSaati}</p>
                        <p style={{ margin: 0 }}><strong>Bidon sayı:</strong> {order.bidonSayi}</p>
                      </div>
                      <div>
                        <p style={{ margin: '0 0 4px 0' }}><strong>Məbləğ:</strong> {order.mebleg} ₼</p>
                        <p style={{ margin: 0 }}><strong>Ödəniş:</strong> {order.odenisNovu}</p>
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
                borderTopRightRadius: '12px' 
              }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Sifariş Detalları</h2>
                <p style={{ opacity: 0.9, margin: '4px 0 0 0' }}>ID: #{selectedOrder.id}</p>
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
                      <h3 style={{ fontWeight: '600', fontSize: '18px', marginBottom: '8px', color: theme.text }}>Çatdırılma Məlumatları</h3>
                      <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginBottom: '4px' }}>Bidon sayı</label>
                      <input
                        type="number"
                        min="0"
                        value={deliveryData.bidonSayi}
                        onChange={(e) => setDeliveryData(prev => ({ ...prev, bidonSayi: e.target.value }))}
                        style={{ 
                          width: '100%', 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
                          border: `1px solid ${theme.inputBorder}`, 
                          fontSize: '16px', 
                          outline: 'none',
                          backgroundColor: theme.inputBg,
                          color: theme.text,
                          transition: 'all 0.3s ease'
                        }}
                      />

                      <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginTop: '16px', marginBottom: '4px' }}>Məbləğ (₼)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={deliveryData.mebleg}
                        onChange={(e) => setDeliveryData(prev => ({ ...prev, mebleg: e.target.value }))}
                        style={{ 
                          width: '100%', 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
                          border: `1px solid ${theme.inputBorder}`, 
                          fontSize: '16px', 
                          outline: 'none',
                          backgroundColor: theme.inputBg,
                          color: theme.text,
                          transition: 'all 0.3s ease'
                        }}
                      />

                      <label style={{ fontSize: '14px', fontWeight: '500', color: theme.textSecondary, display: 'block', marginTop: '16px', marginBottom: '4px' }}>Ödəniş növü</label>
                      <select
                        value={deliveryData.odenisNovu}
                        onChange={(e) => setDeliveryData(prev => ({ ...prev, odenisNovu: e.target.value }))}
                        style={{ 
                          width: '100%', 
                          padding: '8px 12px', 
                          borderRadius: '6px', 
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button
                        onClick={() => setSelectedOrder(null)}
                        style={{ 
                          padding: '8px 16px', 
                          borderRadius: '8px', 
                          border: `1px solid ${theme.border}`, 
                          backgroundColor: theme.cardBg, 
                          color: theme.text,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Bağla
                      </button>
                      <button
                        onClick={completeOrder}
                        style={{ 
                          padding: '8px 16px', 
                          borderRadius: '8px', 
                          border: 'none', 
                          backgroundColor: '#10b981', 
                          color: 'white', 
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Tamamla
                      </button>
                    </div>
                  </>
                )}

                {selectedOrder.status === 'tamamlandı' && (
                  <div style={{ marginTop: '24px', textAlign: 'center', color: '#059669' }}>
                    <CheckCircle size={48} />
                    <p style={{ fontSize: '18px', fontWeight: '600', marginTop: '8px' }}>Bu sifariş artıq tamamlanıb.</p>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      style={{ 
                        marginTop: '12px', 
                        padding: '8px 16px', 
                        borderRadius: '8px', 
                        border: 'none', 
                        backgroundColor: '#3b82f6', 
                        color: 'white', 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
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
    </div>
  );
};

export default KuryerSistemi;