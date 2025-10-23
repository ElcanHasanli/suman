import { useState, useContext } from 'react';
import { Plus, Package, Users, User, Phone, MapPin, DollarSign, Calendar, Droplets, Search, X, Edit, Trash2, Menu, CheckCircle, Clock } from 'lucide-react';
import { useOrders } from '../../contexts/OrdersContext';

function CustomerPanel() {
  const { getOrdersForDate, addOrderForDate, customers: ctxCustomers } = useOrders();
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  // Customers from context (fallback to minimal demo if empty)
  const customers = ctxCustomers && ctxCustomers.length > 0 ? ctxCustomers : [
    { id: 1, firstName: 'Əli', lastName: 'Məmmədov', phone: '+994501234567', address: 'Yasamal rayonu', pricePerBidon: 5 },
    { id: 2, firstName: 'Ayşə', lastName: 'Həsənova', phone: '+994551234567', address: 'Nizami rayonu', pricePerBidon: 6 }
  ];

  const ordersForDate = getOrdersForDate(selectedDate);

  const testCouriers = [
    { id: 1, name: 'Əli Məmmədov', phone: '+994501234567', vehicle: 'Motosiklet' },
    { id: 2, name: 'Nicat Həsənov', phone: '+994551234567', vehicle: 'Avtomobil' }
  ];

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

  const getCustomer = (id) => customers.find(c => c.id === Number(id));
  const getCourier = (id) => testCouriers.find(c => c.id === Number(id));

  const filteredCustomers = customers.filter(customer => {
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const phone = customer.phone ? customer.phone.toLowerCase() : '';
    const address = customer.address ? customer.address.toLowerCase() : '';
    const searchTerm = customerSearch.toLowerCase();
    
    return fullName.includes(searchTerm) || phone.includes(searchTerm) || address.includes(searchTerm);
  });

  const filteredCouriers = testCouriers.filter(courier => {
    const name = courier.name.toLowerCase();
    const phone = courier.phone ? courier.phone.toLowerCase() : '';
    const vehicle = courier.vehicle ? courier.vehicle.toLowerCase() : '';
    const searchTerm = courierSearch.toLowerCase();
    
    return name.includes(searchTerm) || phone.includes(searchTerm) || vehicle.includes(searchTerm);
  });

  const filteredOrders = ordersForDate.filter(order => {
    const customer = getCustomer(order.customerId);
    const courier = getCourier(order.courierId);
    const customerName = customer ? `${customer.firstName} ${customer.lastName}`.toLowerCase() : '';
    const courierName = courier ? courier.name.toLowerCase() : '';
    
    const matchesSearch = orderSearchTerm === '' || 
      customerName.includes(orderSearchTerm.toLowerCase()) ||
      courierName.includes(orderSearchTerm.toLowerCase()) ||
      order.date.includes(orderSearchTerm) ||
      order.bidonOrdered.toString().includes(orderSearchTerm);
    
    const matchesStatus = orderStatusFilter === 'all' || 
      (orderStatusFilter === 'completed' && order.completed) ||
      (orderStatusFilter === 'pending' && !order.completed);
    
    return matchesSearch && matchesStatus;
  });

  const groupedOrders = filteredOrders.reduce((acc, order) => {
    if (!acc[order.date]) acc[order.date] = [];
    acc[order.date].push(order);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedOrders).sort((a, b) => new Date(b) - new Date(a));

  // Stats derived from filtered orders
  const completedOrders = filteredOrders.filter(order => order.completed);
  const pendingOrders = filteredOrders.filter(order => !order.completed);
  const totalRevenue = completedOrders.reduce((total, order) => {
    const customer = getCustomer(order.customerId);
    const pricePerBidon = customer?.pricePerBidon ?? 5;
    return total + (order.bidonOrdered * pricePerBidon);
  }, 0);

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

    // Persist new order to selected date in context
    addOrderForDate(selectedDate, {
      customerId: Number(customerId),
      courierId: Number(courierId),
      bidonOrdered: Number(bidonOrdered),
      paymentMethod: '', // Kuryer tərəfindən doldurulacaq
      completed: false
    });

    setNewOrder({ customerId: '', date: '', bidonOrdered: '', courierId: '' });
    setSelectedCustomerName('');
    setSelectedCourierName('');
    setCustomerSearch('');
    setCourierSearch('');
    setShowOrderModal(false);
    setEditingOrder(null);
    alert('Sifariş uğurla əlavə edildi!');
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
      {/* Mobile Header */}
      <div style={{ 
        background: '#ffffff',
        color: '#111827',
        padding: '1rem',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid #e5e7eb'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: '#f3f4f6', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Package size={20} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: '#111827' }}>Sifarişlər</h1>
            <p style={{ fontSize: '0.875rem', margin: 0, color: '#6b7280' }}>Sifariş idarəsi</p>
          </div>
        </div>
      </div>
      {/* Date Picker for viewing orders by date */}
      <div style={{ padding: '1rem', paddingTop: '0.75rem' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '10px', 
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

      {/* Add Order Button */}
      <div style={{ padding: '1rem' }}>
        <button
          onClick={openOrderModal}
          style={{
            width: '100%',
            padding: '1rem',
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1rem',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
        >
          <Plus size={20} />
          Yeni Sifariş
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
              borderRadius: '12px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)'
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
                  fontSize: '1.125rem', 
                  fontWeight: 700, 
                  color: '#111827', 
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
              {customers.length === 0 ? (
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
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {/* Müştəri Seçimi */}
                  <div style={{ position: 'relative' }}>
                    <label style={{ 
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      display: 'flex',
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
                                <div style={{ fontWeight: '600', color: '#374151', marginBottom: '0.25rem' }}>
                                  {customer.firstName} {customer.lastName}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                  {customer.phone}
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
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      display: 'flex',
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
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      display: 'flex',
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
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      display: 'flex',
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
                                  {courier.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                  {courier.vehicle}
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
                      display: 'block', 
                      marginBottom: '0.5rem', 
                      fontWeight: '600', 
                      color: '#374151', 
                      fontSize: '0.9rem',
                      display: 'flex',
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
                disabled={customers.length === 0}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                  color: 'white',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: customers.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: customers.length === 0 ? 0.6 : 1,
                  boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <Plus size={20} />
                {editingOrder ? 'Sifarişi Yenilə' : 'Sifarişi Yarat'}
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
                  background: '#f1f5f9',
                  color: '#0f172a',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  border: '1px solid #e5e7eb'
                }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Package size={16} />
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>ÜMUMİ</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {filteredOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>sifariş</div>
          </div>

                <div style={{
                  background: '#eef2ff',
                  color: '#0f172a',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  border: '1px solid #e5e7eb'
                }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle size={16} />
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>HAZIR</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {completedOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>sifariş</div>
          </div>

                <div style={{
                  background: '#fff7ed',
                  color: '#0f172a',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  border: '1px solid #e5e7eb'
                }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Clock size={16} />
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>GÖZLƏYƏN</span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {pendingOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>sifariş</div>
          </div>

                <div style={{
                  background: '#f5f3ff',
                  color: '#0f172a',
                  padding: '1rem',
                  borderRadius: '10px',
                  textAlign: 'center',
                  boxShadow: 'none',
                  border: '1px solid #e5e7eb'
                }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <DollarSign size={16} />
                    <span style={{ fontSize: '0.75rem', color: '#475569' }}>GƏLİR</span>
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
          
          <select
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
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
          >
            <option value="all">Bütün Sifarişlər</option>
            <option value="pending">Gözləyən</option>
            <option value="completed">Tamamlanmış</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div style={{ padding: '0 1rem 2rem' }}>
        {/* Desktop Table View (CustomerData table style) */}
        {typeof window !== 'undefined' && window.innerWidth >= 768 && filteredOrders.length > 0 && (
          <div style={{ background: 'white', borderRadius: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', marginBottom: '1rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#111827', margin: 0 }}>Sifariş Siyahısı</h2>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Bütün sifariş məlumatları</p>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Tarix</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Müştəri</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Kuryer</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Bidon</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Məbləğ</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Ödəniş</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>Əməliyyat</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDates.map(date => (
                    groupedOrders[date].map((order) => {
                      const customer = getCustomer(order.customerId);
                      const courier = getCourier(order.courierId);
                      const amount = (order.bidonOrdered || 0) * (customer?.pricePerBidon ?? 5);
                      return (
                        <tr key={order.id}>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{date}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{customer ? `${customer.firstName} ${customer.lastName}` : 'Naməlum'}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{courier ? courier.name : '—'}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>{order.bidonOrdered}</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', color: '#16a34a', fontWeight: 700 }}>{amount} AZN</td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                            {order.completed && order.paymentMethod ? (order.paymentMethod === 'cash' ? 'Nağd' : order.paymentMethod === 'card' ? 'Kart' : order.paymentMethod === 'credit' ? 'Nəsiyə' : '—') : '—'}
                          </td>
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
                              {order.completed ? 'Tamamlandı' : 'Gözləyir'}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button
                                onClick={() => alert('Redaktə funksiyası')}
                                style={{ background: '#3b82f6', color: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '500' }}
                              >
                                Redaktə
                              </button>
                              <button
                                onClick={() => { if (confirm('Bu sifarişi silmək istədiyinizə əminsiniz?')) { alert('Sifariş silindi'); } }}
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
        {sortedDates.length > 0 ? (
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
                const customer = getCustomer(order.customerId);
                const courier = getCourier(order.courierId);
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
                          {customer ? `${customer.firstName} ${customer.lastName}` : 'Naməlum Müştəri'}
                        </h4>
                        <p style={{ 
                          margin: '0.25rem 0 0 0', 
                          fontSize: '0.85rem', 
                          color: '#6b7280' 
                        }}>
                          Kuryer: {courier ? courier.name : 'Təyin olunmayıb'}
                        </p>
                      </div>
                      
                      <div style={{ 
                        padding: '0.4rem 0.8rem', 
                        borderRadius: '20px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        background: order.completed ? '#d1fae5' : '#fef3c7',
                        color: order.completed ? '#065f46' : '#92400e',
                        border: `1px solid ${order.completed ? '#a7f3d0' : '#fde68a'}`,
                        whiteSpace: 'nowrap'
                      }}>
                        {order.completed ? 'Tamamlandı' : 'Gözləyir'}
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
                            {order.bidonOrdered}
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
                            {order.bidonOrdered * (customer?.pricePerBidon ?? 5)} AZN
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Customer Info */}
                    {customer && (
                      <div style={{ 
                        padding: '0.75rem',
                        background: '#fafafa',
                        borderRadius: '8px',
                        marginBottom: '1rem'
                      }}>
                        {customer.phone && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginBottom: '0.5rem'
                          }}>
                            <Phone size={14} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                              {customer.phone}
                            </span>
                          </div>
                        )}
                        {customer.address && (
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem' 
                          }}>
                            <MapPin size={14} style={{ color: '#6b7280' }} />
                            <span style={{ fontSize: '0.85rem', color: '#374151' }}>
                              {customer.address}
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
                        onClick={() => alert('Redaktə funksiyası')}
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
                        onClick={() => {
                          if (confirm('Bu sifarişi silmək istədiyinizə əminsiniz?')) {
                            alert('Sifariş silindi');
                          }
                        }}
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
        ) : (
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
        )}
      </div>
    </div>
  );
}

export default CustomerPanel;