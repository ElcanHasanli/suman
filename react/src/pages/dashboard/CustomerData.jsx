import React, { useState, useContext } from 'react';
import { Plus, Minus, Users, User, MapPin, Phone, DollarSign, Search } from 'lucide-react';
import { OrdersContext } from '../../contexts/OrdersContext';

function CustomerData() {
  const { customers, setCustomers } = useContext(OrdersContext);
  const [editMode, setEditMode] = useState(null); // id ilə saxlanacaq

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    pricePerBidon: '',
  });
  const handleEditCustomer = (customer) => {
    setShowForm(true);
    setEditMode(customer.id);
    setFormData({
      firstName: customer.firstName,
      lastName: customer.lastName,
      address: customer.address,
      phone: customer.phone,
      pricePerBidon: customer.pricePerBidon,
    });
  };

  const handleDeleteCustomer = (id) => {
    if (window.confirm("Bu müştərini silmək istədiyinizə əminsiniz?")) {
      setCustomers(prev => prev.filter(customer => customer.id !== id));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtrlənmiş müştəri siyahısı
 const filteredCustomers = customers.filter(customer => {
  const search = searchTerm.toLowerCase().trim();
  const searchNumber = search.replace(/[^0-9.]/g, "");

  const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();

  return (
    fullName.includes(search) ||
    (customer.firstName && customer.firstName.toLowerCase().includes(search)) ||
    (customer.lastName && customer.lastName.toLowerCase().includes(search)) ||
    (customer.phone && customer.phone.toLowerCase().includes(search)) ||
    (customer.address && customer.address.toLowerCase().includes(search)) ||
    (
      searchNumber &&
      customer.pricePerBidon &&
      parseFloat(customer.pricePerBidon) === parseFloat(searchNumber) // tam bərabərlik
    )
  );
});



  const handleSubmit = (e) => {
    e.preventDefault();
    let { firstName, lastName, address, phone, pricePerBidon } = formData;

    firstName = firstName.trim();
    lastName = lastName.trim();
    address = address.trim();
    phone = phone.trim();
    pricePerBidon = pricePerBidon.toString().trim();

    if (!firstName || !lastName || !address || !phone || !pricePerBidon) {
      alert('Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    const price = Number(pricePerBidon);
    if (isNaN(price) || price <= 0) {
      alert('Qiymət düzgün daxil edilməyib!');
      return;
    }

    if (!/^\+?\d{9,14}$/.test(phone)) {
      alert('Zəhmət olmasa düzgün telefon nömrəsi daxil edin!');
      return;
    }

    if (!phone.startsWith('+994')) {
      if (phone.startsWith('0')) {
        phone = '+994' + phone.slice(1);
      } else if (!phone.startsWith('+')) {
        phone = '+994' + phone;
      }
    }

    const isPhoneExists = customers.some(c => c.phone === phone && c.id !== editMode);
    if (isPhoneExists) {
      alert('Bu telefon nömrəsi ilə artıq müştəri mövcuddur!');
      return;
    }

    if (editMode) {
      // Redaktə et
      setCustomers(prev =>
        prev.map(c =>
          c.id === editMode
            ? { ...c, firstName, lastName, address, phone, pricePerBidon: price }
            : c
        )
      );
      setEditMode(null);
    } else {
      // Yeni əlavə et
      const newId = customers.length ? customers[customers.length - 1].id + 1 : 1;
      setCustomers(prev => [...prev, { id: newId, firstName, lastName, address, phone, pricePerBidon: price }]);
    }

    // Form sıfırla
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      pricePerBidon: '',
    });
    setShowForm(false);
  };


  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    maxWidth: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    headerCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      padding: '32px',
      marginBottom: '32px'
    },
    headerFlex: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      flexWrap: 'wrap',
      gap: '16px'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    iconBox: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      padding: '12px',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerText: {
      margin: 0
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0 0 4px 0'
    },
    subtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '16px'
    },
    statsBox: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      padding: '12px 24px',
      borderRadius: '12px',
      border: '1px solid #93c5fd'
    },
    statsText: {
      color: '#1e40af',
      fontWeight: '600',
      margin: 0
    },
    addButton: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    searchCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      padding: '24px',
      marginBottom: '32px'
    },
    searchContainer: {
      position: 'relative',
      maxWidth: '600px'
    },
    searchInput: {
      width: '100%',
      padding: '16px 16px 16px 50px',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      fontSize: '16px',
      background: '#f9fafb',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      left: '16px',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1
    },
    searchResults: {
      marginTop: '16px',
      fontSize: '14px',
      color: '#6b7280'
    },
    formCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      padding: '32px',
      marginBottom: '32px'
    },
    formHeader: {
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    },
    formTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px 0'
    },
    formSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px',
      marginBottom: '24px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      color: '#374151',
      fontWeight: '600',
      gap: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '16px',
      background: '#f9fafb',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box'
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      padding: '16px 32px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '16px',
      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
      transition: 'all 0.3s ease'
    },
    tableCard: {
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden'
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '24px'
    },
    tableTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 4px 0'
    },
    tableSubtitle: {
      color: '#d1d5db',
      margin: 0
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeadRow: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)'
    },
    th: {
      padding: '16px 24px',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#1f2937',
      borderBottom: '2px solid #3b82f6'
    },
    thContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    td: {
      padding: '16px 24px',
      borderBottom: '1px solid #e5e7eb'
    },
    evenRow: {
      background: '#f9fafb'
    },
    oddRow: {
      background: 'white'
    },
    priceBadge: {
      background: '#dcfce7',
      color: '#166534',
      padding: '4px 12px',
      borderRadius: '20px',
      fontWeight: 'bold',
      fontSize: '14px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '64px 24px'
    },
    emptyTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#6b7280',
      margin: '16px 0 8px 0'
    },
    emptyText: {
      color: '#9ca3af',
      margin: 0
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header Section */}
        <div style={styles.headerCard}>
          <div style={styles.headerFlex}>
            <div style={styles.headerLeft}>
              <div style={styles.iconBox}>
                <Users size={32} color="white" />
              </div>
              <div style={styles.headerText}>
                <h1 style={styles.title}>Müştəri İdarəsi</h1>
                <p style={styles.subtitle}>Müştəri məlumatlarını idarə edin</p>
              </div>
            </div>
            <div style={styles.statsBox}>
              <p style={styles.statsText}>Cəmi Müştəri: {customers.length}</p>
            </div>
          </div>
          {/* {() => {
            setShowForm(!showForm);
            setEditMode(null);
            setFormData({ firstName: '', lastName: '', address: '', phone: '', pricePerBidon: '' });
          }} */}

          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              ...styles.addButton,
              background: showForm
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              boxShadow: showForm
                ? '0 10px 25px -5px rgba(220, 38, 38, 0.3)'
                : '0 10px 25px -5px rgba(37, 99, 235, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = showForm
                ? '0 15px 35px -5px rgba(220, 38, 38, 0.4)'
                : '0 15px 35px -5px rgba(37, 99, 235, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = showForm
                ? '0 10px 25px -5px rgba(220, 38, 38, 0.3)'
                : '0 10px 25px -5px rgba(37, 99, 235, 0.3)';
            }}
          >
            {showForm ? <Minus size={20} /> : <Plus size={20} />}
            <span>{showForm ? 'Formu Bağla' : 'Yeni Müştəri Əlavə Et'}</span>
          </button>
        </div>

        {/* Search Section */}
        {customers.length > 0 && (
          <div style={styles.searchCard}>
            <div style={styles.searchContainer}>
              <div style={styles.searchIcon}>
                <Search size={20} color="#6b7280" />
              </div>
              <input
                type="text"
                placeholder="Müştəri axtar... (ad, soyad, ünvan, telefon və ya qiymət)"
                value={searchTerm}
                onChange={handleSearchChange}
                style={styles.searchInput}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.background = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            {searchTerm && (
              <div style={styles.searchResults}>
                {filteredCustomers.length} müştəri tapıldı
              </div>
            )}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <form style={styles.formCard} onSubmit={handleSubmit}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>Yeni Müştəri Əlavə Et</h2>
              <p style={styles.formSubtitle}>Müştəri məlumatlarını daxil edin</p>
            </div>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <User size={16} color="#2563eb" />
                  Ad
                </label>
                <input
                  type="text"
                  name="firstName"
                  placeholder="Müştərinin adını daxil edin"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <User size={16} color="#2563eb" />
                  Soyad
                </label>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Soyadı daxil edin"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <div style={{ ...styles.inputGroup, marginBottom: '24px' }}>
              <label style={styles.label}>
                <MapPin size={16} color="#2563eb" />
                Ünvan
              </label>
              <input
                type="text"
                name="address"
                placeholder="Tam ünvanı daxil edin"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.background = 'white';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#d1d5db';
                  e.target.style.background = '#f9fafb';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={styles.formGrid}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <Phone size={16} color="#2563eb" />
                  Telefon
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="Telefon nömrəsini daxil edin"
                  value={formData.phone}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <DollarSign size={16} color="#2563eb" />
                  Bidon Qiyməti (AZN)
                </label>
                <input
                  type="number"
                  name="pricePerBidon"
                  placeholder="Qiyməti daxil edin"
                  value={formData.pricePerBidon}
                  onChange={handleChange}
                  style={styles.input}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.background = 'white';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.background = '#f9fafb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            <button
              type="submit"

              onClick={handleSubmit}
              style={styles.submitButton}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 35px -5px rgba(5, 150, 105, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 25px -5px rgba(5, 150, 105, 0.3)';
              }}
            >
              Müştəri Əlavə Et
            </button>
            </form>

        )}

        {/* Table Section */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Müştəri Siyahısı</h2>
            <p style={styles.tableSubtitle}>
              {searchTerm ? `"${searchTerm}" axtarışı üçün nəticələr` : 'Bütün müştəri məlumatları'}
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeadRow}>
                  <th style={styles.th}>
                    <div style={styles.thContent}>
                      <User size={16} color="#2563eb" />
                      Ad
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thContent}>
                      <User size={16} color="#2563eb" />
                      Soyad
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thContent}>
                      <MapPin size={16} color="#2563eb" />
                      Ünvan
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thContent}>
                      <Phone size={16} color="#2563eb" />
                      Telefon
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thContent}>
                      <DollarSign size={16} color="#2563eb" />
                      Qiymət (AZN)
                    </div>
                  </th>
                  <th style={styles.th}>
                    <div style={styles.thContent}>
                      Əməliyyat
                    </div>
                  </th>

                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c, index) => (
                  <tr
                    key={c.id}
                    style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                    onMouseEnter={(e) => e.target.parentElement.style.background = '#dbeafe'}
                    onMouseLeave={(e) => e.target.parentElement.style.background = index % 2 === 0 ? '#f9fafb' : 'white'}
                  >
                    <td style={styles.td}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{c.firstName}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{c.lastName}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#374151' }}>{c.address}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#2563eb', fontWeight: '500' }}>{c.phone}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.priceBadge}>
                        {c.pricePerBidon} AZN
                      </span>
                    </td>
                    {/* <td style={styles.td}>
                      <span style={styles.priceBadge}>
                        {c.pricePerBidon} AZN
                      </span>
                    </td> */}
                    <td style={styles.td}>
                      <button
                        onClick={() => handleDeleteCustomer(c.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#dc2626';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#ef4444';
                        }}
                      >
                        Sil
                      </button>
                      <button
                        onClick={() => handleEditCustomer(c)}
                        style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '14px',
                          fontWeight: '500',
                          marginRight: '8px',
                          transition: 'background 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#2563eb';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = '#3b82f6';
                        }}
                      >
                        Redaktə Et
                      </button>

                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCustomers.length === 0 && customers.length > 0 && (
            <div style={styles.emptyState}>
              <Search size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <h3 style={styles.emptyTitle}>Axtarış nəticəsi tapılmadı</h3>
              <p style={styles.emptyText}>"{searchTerm}" axtarışı üçün heç bir müştəri tapılmadı</p>
            </div>
          )}

          {customers.length === 0 && (
            <div style={styles.emptyState}>
              <Users size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <h3 style={styles.emptyTitle}>Hələ müştəri yoxdur</h3>
              <p style={styles.emptyText}>İlk müştərinizi əlavə etmək üçün yuxarıdakı düyməni basın</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerData;