import React, { useState } from 'react';
import { Plus, Minus, Users, User, MapPin, Phone, DollarSign, Search, Download, Edit, Trash2 } from 'lucide-react';
import { 
  useGetCustomersQuery, 
  useCreateCustomerMutation, 
  useUpdateCustomerMutation, 
  useDeleteCustomerMutation,
  useSearchCustomerByPhoneQuery,
  useSearchCustomerByNameSurnameQuery,
  useExportCustomersQuery,
  useGetCustomerCountQuery
} from '../../services/apiSlice';
import { useAuth } from '../../contexts/AuthContext';

function CustomerData() {
  const { token, isAuthenticated } = useAuth();
  const [editMode, setEditMode] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('general'); // general, phone, name
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    pricePerBidon: '',
  });

  // API hooks
  const { data: customers = [], isLoading, error, refetch } = useGetCustomersQuery();
  const { data: customerCount = 0 } = useGetCustomerCountQuery();
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();
  
  // Search hooks
  const { data: phoneSearchResults = [] } = useSearchCustomerByPhoneQuery(searchTerm, {
    skip: searchType !== 'phone' || !searchTerm
  });
  const { data: nameSearchResults = [] } = useSearchCustomerByNameSurnameQuery(
    { name: searchTerm.split(' ')[0], surname: searchTerm.split(' ')[1] || '' },
    { skip: searchType !== 'name' || !searchTerm }
  );

  // Export functionality
  const { data: exportData } = useExportCustomersQuery(undefined, {
    skip: true // Only fetch when needed
  });

  const handleEditCustomer = (customer) => {
    setShowForm(true);
    setEditMode(customer.id);
    setFormData({
      firstName: customer.firstName || '',
      lastName: customer.lastName || '',
      address: customer.address || '',
      phone: customer.phone || '',
      pricePerBidon: customer.pricePerBidon || '',
    });
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Bu müştərini silmək istədiyinizə əminsiniz?")) {
      try {
        await deleteCustomer(id).unwrap();
        // Success message could be added here
      } catch (error) {
        alert('Müştəri silinərkən xəta baş verdi: ' + error.message);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      // Auto-detect search type
      if (/^\d+$/.test(e.target.value)) {
        setSearchType('phone');
      } else if (e.target.value.includes(' ')) {
        setSearchType('name');
      } else {
        setSearchType('general');
      }
    }
  };

  const handleSubmit = async (e) => {
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

    try {
      if (editMode) {
        // Update customer
        await updateCustomer({ id: editMode, firstName, lastName, address, phone, pricePerBidon: price }).unwrap();
        setEditMode(null);
      } else {
        // Create new customer
        await createCustomer({ firstName, lastName, address, phone, pricePerBidon: price }).unwrap();
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        pricePerBidon: '',
      });
      setShowForm(false);
      
      // Refetch customers
      refetch();
    } catch (error) {
      alert('Xəta baş verdi: ' + error.message);
    }
  };

  const handleExportCustomers = async () => {
    try {
      const response = await fetch('/api/customers/export', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'customers.xlsx';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      alert('Export xətası: ' + error.message);
    }
  };

  // Filtered customers based on search
  const getFilteredCustomers = () => {
    if (!searchTerm) return customers;

    switch (searchType) {
      case 'phone':
        return phoneSearchResults.length > 0 ? phoneSearchResults : customers.filter(c => 
          c.phone && c.phone.includes(searchTerm)
        );
      case 'name':
        return nameSearchResults.length > 0 ? nameSearchResults : customers.filter(c => {
          const fullName = `${c.firstName || ''} ${c.lastName || ''}`.toLowerCase();
          return fullName.includes(searchTerm.toLowerCase());
        });
      default:
        return customers.filter(customer => {
          const search = searchTerm.toLowerCase().trim();
          const fullName = `${customer.firstName || ""} ${customer.lastName || ""}`.toLowerCase();
          return (
            fullName.includes(search) ||
            (customer.firstName && customer.firstName.toLowerCase().includes(search)) ||
            (customer.lastName && customer.lastName.toLowerCase().includes(search)) ||
            (customer.phone && customer.phone.toLowerCase().includes(search)) ||
            (customer.address && customer.address.toLowerCase().includes(search)) ||
            (customer.pricePerBidon && customer.pricePerBidon.toString().includes(search))
          );
        });
    }
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
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
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
    exportButton: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
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
    actionButtons: {
      display: 'flex',
      gap: '8px',
      flexWrap: 'wrap'
    },
    editButton: {
      background: '#3b82f6',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    deleteButton: {
      background: '#ef4444',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
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
    },
    loadingState: {
      textAlign: 'center',
      padding: '64px 24px'
    },
    spinner: {
      border: '4px solid #f3f4f6',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      animation: 'spin 1s linear infinite',
      margin: '0 auto 16px'
    },
    errorState: {
      textAlign: 'center',
      padding: '64px 24px',
      color: '#ef4444'
    },
          retryButton: {
        background: '#3b82f6',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer',
        marginTop: '16px'
      }
    };

  const filteredCustomers = getFilteredCustomers();

  // Authentication check - daha yumşaq yoxlama
  if (!token) {
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
  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.loadingState}>
            <div style={styles.spinner}></div>
            <p>Müştəri məlumatları yüklənir...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.maxWidth}>
          <div style={styles.errorState}>
            <p>Xəta baş verdi: {error.message}</p>
            <button onClick={() => refetch()} style={styles.retryButton}>
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
              <p style={styles.statsText}>Cəmi Müştəri: {customerCount}</p>
            </div>
          </div>

          <div style={styles.buttonGroup}>
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
            >
              {showForm ? <Minus size={20} /> : <Plus size={20} />}
              <span>{showForm ? 'Formu Bağla' : 'Yeni Müştəri Əlavə Et'}</span>
            </button>

            <button
              onClick={handleExportCustomers}
              style={styles.exportButton}
              disabled={customers.length === 0}
            >
              <Download size={20} />
              <span>Excel Export</span>
            </button>
          </div>
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
              />
            </div>
            {searchTerm && (
              <div style={styles.searchResults}>
                {filteredCustomers.length} müştəri tapıldı
                {searchType !== 'general' && (
                  <span style={{ marginLeft: '8px', color: '#3b82f6' }}>
                    ({searchType === 'phone' ? 'Telefon' : 'Ad/Soyad'} axtarışı)
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Form Section */}
        {showForm && (
          <form style={styles.formCard} onSubmit={handleSubmit}>
            <div style={styles.formHeader}>
              <h2 style={styles.formTitle}>
                {editMode ? 'Müştəri Redaktə Et' : 'Yeni Müştəri Əlavə Et'}
              </h2>
              <p style={styles.formSubtitle}>
                {editMode ? 'Müştəri məlumatlarını yeniləyin' : 'Müştəri məlumatlarını daxil edin'}
              </p>
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
                  required
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
                  required
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
                required
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
                  required
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
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              style={styles.submitButton}
              disabled={isCreating || isUpdating}
            >
              {isCreating || isUpdating ? 'Yüklənir...' : (editMode ? 'Müştərini Yenilə' : 'Müştəri Əlavə Et')}
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
                {filteredCustomers.map((customer, index) => (
                  <tr
                    key={customer.id}
                    style={index % 2 === 0 ? styles.evenRow : styles.oddRow}
                  >
                    <td style={styles.td}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{customer.firstName}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ fontWeight: '600', color: '#1f2937' }}>{customer.lastName}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#374151' }}>{customer.address}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#2563eb', fontWeight: '500' }}>{customer.phone}</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.priceBadge}>
                        {customer.pricePerBidon} AZN
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleEditCustomer(customer)}
                          style={styles.editButton}
                          title="Redaktə et"
                        >
                          <Edit size={14} />
                          Redaktə
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(customer.id)}
                          style={styles.deleteButton}
                          disabled={isDeleting}
                          title="Sil"
                        >
                          <Trash2 size={14} />
                          Sil
                        </button>
                      </div>
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

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CustomerData;