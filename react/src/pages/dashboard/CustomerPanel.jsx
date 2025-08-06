import { useState, useContext } from 'react';
import { Plus, Package, Users, User, Phone, MapPin, DollarSign, Calendar, Droplets, Search, X } from 'lucide-react';
import { OrdersContext } from '../../contexts/OrdersContext';

function CustomerPanel() {
  const { orders = [], setOrders, customers = [], couriers = [] } = useContext(OrdersContext);

  // Test kuryer məlumatları - əgər OrdersContext-dən kuryer gəlmirsə
  const testCouriers = [
    { id: 1, name: 'Əli Məmmədov', phone: '+994501234567', vehicle: 'Motosiklet' },
    { id: 2, name: 'Nicat Həsənov', phone: '+994551234567', vehicle: 'Avtomobil' }
  ];

  // Kuryerləri context-dən və ya test məlumatlarından götür
  const availableCouriers = couriers.length > 0 ? couriers : testCouriers;

  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newOrder, setNewOrder] = useState({
    customerId: '',
    date: '',
    bidonOrdered: '',
    courierId: '',
  });

  // Müştəri axtarışı üçün state-lər
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [selectedCustomerName, setSelectedCustomerName] = useState('');

  // Kuryer axtarışı üçün state-lər
  const [courierSearch, setCourierSearch] = useState('');
  const [showCourierDropdown, setShowCourierDropdown] = useState(false);
  const [selectedCourierName, setSelectedCourierName] = useState('');

  const addOrder = (newOrderData) => {
    const newId = orders.length ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    const orderWithId = { ...newOrderData, id: newId };
    setOrders(prev => [...prev, orderWithId]);
  };

  const getCustomer = (id) => customers.find(c => c.id === Number(id));
  const getCourier = (id) => availableCouriers.find(c => c.id === Number(id));

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.date]) acc[order.date] = [];
    acc[order.date].push(order);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

  const handleOrderInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({ ...prev, [name]: value }));
  };

  // Müştəri axtarışı
  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const phone = customer.phone ? customer.phone.toLowerCase() : '';
    const address = customer.address ? customer.address.toLowerCase() : '';
    const searchTerm = customerSearch.toLowerCase();
    
    return fullName.includes(searchTerm) || 
           phone.includes(searchTerm) || 
           address.includes(searchTerm);
  });

  // Kuryer axtarışı
  const filteredCouriers = availableCouriers.filter(courier => {
    const name = courier.name.toLowerCase();
    const phone = courier.phone ? courier.phone.toLowerCase() : '';
    const vehicle = courier.vehicle ? courier.vehicle.toLowerCase() : '';
    const searchTerm = courierSearch.toLowerCase();
    
    return name.includes(searchTerm) || 
           phone.includes(searchTerm) || 
           vehicle.includes(searchTerm);
  });

  const handleCustomerSelect = (customer) => {
    setNewOrder(prev => ({ ...prev, customerId: customer.id }));
    setSelectedCustomerName(`${customer.firstName} ${customer.lastName}`);
    setCustomerSearch('');
    setShowCustomerDropdown(false);
  };

  const handleCourierSelect = (courier) => {
    setNewOrder(prev => ({ ...prev, courierId: courier.id }));
    setSelectedCourierName(courier.name);
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

  const handleAddOrder = () => {
    const { customerId, date, bidonOrdered, courierId } = newOrder;

    if (!customerId || !date || !bidonOrdered || !courierId) {
      alert('Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    addOrder({
      customerId: Number(customerId),
      date,
      bidonOrdered: Number(bidonOrdered),
      courierId: Number(courierId),
      bidonReturned: 0,
      bidonTakenByCourier: 0,
      bidonRemaining: 0,
      paymentMethod: null,
      completed: false,
    });

    setNewOrder({ customerId: '', date: '', bidonOrdered: '', courierId: '' });
    setSelectedCustomerName('');
    setSelectedCourierName('');
    setCustomerSearch('');
    setCourierSearch('');
    setShowOrderForm(false);
  };

  const selectedCustomer = newOrder.customerId ? getCustomer(newOrder.customerId) : null;
  const selectedCourier = newOrder.courierId ? getCourier(newOrder.courierId) : null;
  const bidonPrice = selectedCustomer?.pricePerBidon ?? 5;
  const totalAmount = newOrder.bidonOrdered ? Number(newOrder.bidonOrdered) * bidonPrice : 0;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', background: 'white', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)', color: 'white', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '50%', opacity: 0.3 }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
            <div style={{ width: '64px', height: '64px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', border: '1px solid rgba(255, 255, 255, 0.3)' }}>
              <Package size={32} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Sifarişlər Paneli</h1>
              <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>Müştəri sifarişlərini peşəkar şəkildə idarə edin</p>
            </div>
          </div>

          <button
            onClick={() => setShowOrderForm(!showOrderForm)}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#0284c7',
              fontWeight: '700',
              border: 'none',
              borderRadius: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.3s ease',
              position: 'relative',
              zIndex: 1,
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.2)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
            }}
          >
            <Plus size={24} /> Yeni Sifariş Əlavə Et
          </button>
        </div>

        <div style={{ padding: '2.5rem' }}>
          {/* Order Form */}
          {showOrderForm && (
            <div style={{ marginBottom: '3rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0' }}>
              {customers.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: 'white', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
                  <Users size={64} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#475569' }}>Müştəri Yoxdur</h3>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}>Sifariş əlavə etmək üçün əvvəlcə müştəri əlavə edin</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Müştəri Seçimi - Axtarış ilə */}
                    <div style={{ position: 'relative' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Müştəri Seçin
                      </label>
                      
                      {selectedCustomerName ? (
                        <div style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #16a34a',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: '#f0fdf4',
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>{selectedCustomerName}</span>
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
                            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                            <input
                              type="text"
                              placeholder="Müştəri adı, telefon və ya ünvan ilə axtarın..."
                              value={customerSearch}
                              onChange={(e) => setCustomerSearch(e.target.value)}
                              onFocus={() => setShowCustomerDropdown(true)}
                              style={{
                                width: '80%',
                                padding: '1rem 1rem 1rem 2.5rem',
                                border: '2px solid #e5e7eb',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                background: 'white',
                                color: '#374151',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                              }}
                              // onFocus={e => (e.currentTarget.style.borderColor = '#0284c7')}
                              onBlur={e => {
                                setTimeout(() => setShowCustomerDropdown(false), 200);
                                e.currentTarget.style.borderColor = '#e5e7eb';
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
                              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
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
                                  <div style={{ fontWeight: '600', color: '#374151' }}>
                                    {customer.firstName} {customer.lastName}
                                  </div>
                                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                    {customer.phone && <span>📞 {customer.phone}</span>}
                                    {customer.address && <span style={{ marginLeft: '0.5rem' }}>📍 {customer.address}</span>}
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
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        <Calendar size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Sifariş Tarixi
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={newOrder.date}
                        onChange={handleOrderInputChange}
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'white',
                          color: '#374151',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#0284c7')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                    </div>

                    {/* Bidon Sayı */}
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        <Droplets size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Bidon Sayı
                      </label>
                      <input
                        type="number"
                        name="bidonOrdered"
                        value={newOrder.bidonOrdered}
                        onChange={handleOrderInputChange}
                        placeholder="Bidon sayını daxil edin"
                        min="1"
                        style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #e5e7eb',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: 'white',
                          color: '#374151',
                          outline: 'none',
                          transition: 'border-color 0.3s ease',
                        }}
                        onFocus={e => (e.currentTarget.style.borderColor = '#0284c7')}
                        onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                      />
                    </div>

                    {/* Kuryer Seçimi - Axtarış ilə */}
                    <div style={{ position: 'relative' }}>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151', fontSize: '0.9rem' }}>
                        <User size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
                        Kuryer Seçin
                      </label>
                      
                      {selectedCourierName ? (
                        <div style={{
                          width: '100%',
                          padding: '1rem',
                          border: '2px solid #f59e0b',
                          borderRadius: '12px',
                          fontSize: '1rem',
                          background: '#fffbeb',
                          color: '#374151',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}>
                          <span>{selectedCourierName}</span>
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
                            <Search size={16} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                            <input
                              type="text"
                              placeholder="Kuryer adı, telefon və ya nəqliyyat ilə axtarın..."
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
                                color: '#374151',
                                outline: 'none',
                                transition: 'border-color 0.3s ease',
                              }}
                              // onFocus={e => (e.currentTarget.style.borderColor = '#0284c7')}
                              onBlur={e => {
                                setTimeout(() => setShowCourierDropdown(false), 200);
                                e.currentTarget.style.borderColor = '#e5e7eb';
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
                              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
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
                                  <div style={{ fontWeight: '600', color: '#374151' }}>
                                    {courier.name}
                                  </div>
                                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                    {courier.phone && <span>📞 {courier.phone}</span>}
                                    {courier.vehicle && <span style={{ marginLeft: '0.5rem' }}>🚗 {courier.vehicle}</span>}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Müştəri və Kuryer Məlumatları Preview */}
                  {(selectedCustomer || selectedCourier) && (
                    <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
                      {selectedCustomer && (
                        <>
                          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} style={{ color: '#0284c7' }} />
                            Müştəri Məlumatları
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <User size={16} style={{ color: '#6b7280' }} />
                              <span style={{ fontWeight: '600', color: '#374151' }}>Ad Soyad:</span>
                              <span style={{ color: '#6b7280' }}>
                                {selectedCustomer.firstName} {selectedCustomer.lastName}
                              </span>
                            </div>

                            {selectedCustomer.phone && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} style={{ color: '#6b7280' }} />
                                <span style={{ fontWeight: '600', color: '#374151' }}>Telefon:</span>
                                <span style={{ color: '#6b7280' }}>{selectedCustomer.phone}</span>
                              </div>
                            )}

                            {selectedCustomer.address && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MapPin size={16} style={{ color: '#6b7280' }} />
                                <span style={{ fontWeight: '600', color: '#374151' }}>Ünvan:</span>
                                <span style={{ color: '#6b7280' }}>{selectedCustomer.address}</span>
                              </div>
                            )}

                            {totalAmount > 0 && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DollarSign size={16} style={{ color: '#16a34a' }} />
                                <span style={{ fontWeight: '600', color: '#374151' }}>Məbləğ:</span>
                                <span style={{ color: '#16a34a', fontWeight: '700' }}>
                                  {totalAmount} AZN ({bidonPrice} AZN/bidon)
                                </span>
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {selectedCourier && (
                        <>
                          <h4 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <User size={20} style={{ color: '#f59e0b' }} />
                            Kuryer Məlumatları
                          </h4>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <User size={16} style={{ color: '#6b7280' }} />
                              <span style={{ fontWeight: '600', color: '#374151' }}>Ad Soyad:</span>
                              <span style={{ color: '#6b7280' }}>{selectedCourier.name}</span>
                            </div>

                            {selectedCourier.phone && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Phone size={16} style={{ color: '#6b7280' }} />
                                <span style={{ fontWeight: '600', color: '#374151' }}>Telefon:</span>
                                <span style={{ color: '#6b7280' }}>{selectedCourier.phone}</span>
                              </div>
                            )}

                            {selectedCourier.vehicle && (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Package size={16} style={{ color: '#6b7280' }} />
                                <span style={{ fontWeight: '600', color: '#374151' }}>Nəqliyyat:</span>
                                <span style={{ color: '#6b7280' }}>{selectedCourier.vehicle}</span>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddOrder}
                    style={{
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      color: 'white',
                      padding: '1rem 2rem',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '1.1rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseOver={e => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 12px 35px rgba(22, 163, 74, 0.4)';
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(22, 163, 74, 0.3)';
                    }}
                  >
                    <Plus size={20} />
                    Sifarişi Yarat
                  </button>
                </>
              )}
            </div>
          )}

          {/* Sifariş Siyahısı */}
          {sortedDates.length > 0 ? (
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Package size={28} style={{ color: '#0284c7' }} />
                Mövcud Sifarişlər
              </h2>

              {sortedDates.map(date => (
                <div
                  key={date}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    marginBottom: '1.5rem',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '600', color: '#64748b' }}>{date}</h3>
                  </div>

                  {groupedOrders[date].map(order => {
                    const customer = getCustomer(order.customerId);
                    const courier = getCourier(order.courierId);
                    return (
                      <div
                        key={order.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '1.5rem',
                          borderBottom: '1px solid #e5e7eb',
                          alignItems: 'center',
                          gap: '1rem',
                          fontWeight: '700',
                          fontSize: '1rem',
                          color: '#1f2937',
                        }}
                      >
                        <div style={{ flex: '1 1 auto', minWidth: '200px' }}>
                          {customer ? `${customer.firstName} ${customer.lastName}` : 'Naməlum Müştəri'}
                        </div>
                        <div style={{ flex: '1 1 auto', minWidth: '200px', fontWeight: '400', color: '#64748b' }}>
                          Bidon sayı: {order.bidonOrdered}
                        </div>
                        <div style={{ flex: '1 1 auto', minWidth: '200px', fontWeight: '400', color: '#64748b' }}>
                          Kuryer: {courier ? courier.name : 'Təyin olunmayıb'}
                        </div>
                        <div style={{ fontWeight: '700', color: '#16a34a' }}>
                          {order.bidonOrdered * (customer?.pricePerBidon ?? 5)} AZN
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
              <Package size={64} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>Heç bir sifariş yoxdur</h3>
              <p style={{ margin: 0, fontSize: '1.1rem' }}>Yeni sifariş əlavə etməklə başlayın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerPanel;