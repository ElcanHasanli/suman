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
  const { isAuthenticated } = useAuth();
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

  // API hooks - indi aktiv
  const { data: customers = [], isLoading, error, refetch } = useGetCustomersQuery();
  const { data: customerCount = 0 } = useGetCustomerCountQuery();
  
  // Test data - backend hazır olana qədər
  const testCustomers = [
    {
      id: 1,
      name: "Əli",
      surname: "Məmmədov",
      address: "Bakı şəhəri, Nərimanov rayonu",
      phoneNumber: "+994501234567",
      price: 5.50
    },
    {
      id: 2,
      name: "Aysu",
      surname: "Hüseynova",
      address: "Bakı şəhəri, Yasamal rayonu",
      phoneNumber: "+994507654321",
      price: 6.00
    }
  ];
  
  // Əgər customers boşdursa, test data istifadə et
  const displayCustomers = customers.length > 0 ? customers : testCustomers;
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();
  
  // Search hooks - indi aktiv
  const { data: phoneSearchResults = [] } = useSearchCustomerByPhoneQuery(searchTerm, {
    skip: searchType !== 'phone' || !searchTerm
  });
  const { data: nameSearchResults = [] } = useSearchCustomerByNameSurnameQuery(
    { name: searchTerm.split(' ')[0], surname: searchTerm.split(' ')[1] || '' },
    { skip: searchType !== 'name' || !searchTerm }
  );

  // Export functionality
  const [exportTrigger, setExportTrigger] = useState(false);
  const { data: exportData } = useExportCustomersQuery(undefined, {
    skip: !exportTrigger
  });

  const handleEditCustomer = (customer) => {
    setShowForm(true);
    setEditMode(customer.id);
    setFormData({
      firstName: customer.name || customer.firstName || '',
      lastName: customer.surname || customer.lastName || '',
      address: customer.address || '',
      phone: customer.phoneNumber || customer.phone || '',
      pricePerBidon: customer.price || customer.pricePerBidon || '',
    });
  };

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Bu müştərini silmək istədiyinizə əminsiniz?")) {
      try {
        await deleteCustomer(id).unwrap();
        refetch();
        alert('Müştəri uğurla silindi!');
      } catch (error) {
        console.error('Delete error:', error);
        alert('Müştəri silinərkən xəta baş verdi: ' + (error.data?.message || error.message));
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
    } else {
      setSearchType('general');
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
      const customerData = {
        name: firstName,
        surname: lastName,
        address,
        phoneNumber: phone,
        price: price
      };

      if (editMode) {
        // Update customer
        await updateCustomer({
          id: editMode,
          ...customerData
        }).unwrap();
        alert('Müştəri məlumatları uğurla yeniləndi!');
      } else {
        // Create new customer
        await createCustomer(customerData).unwrap();
        alert('Yeni müştəri uğurla əlavə edildi!');
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
      setEditMode(null);
      refetch();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Xəta baş verdi: ' + (error.data?.message || error.message));
    }
  };

  const handleExportCustomers = async () => {
    try {
      setExportTrigger(true);
      
      // Export endpoint-dən birbaşa fayl yükləmə
      const response = await fetch('http://62.171.154.6:9090/customers/export');
      
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
        alert('Müştəri siyahısı uğurla export edildi!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export xətası: ' + error.message);
    } finally {
      setExportTrigger(false);
    }
  };

  // Filtered customers based on search
  const getFilteredCustomers = () => {
    if (!searchTerm) return displayCustomers;

    // Əgər search type phone və ya name-dirsə, API search istifadə et
    if (searchType === 'phone' && phoneSearchResults.length > 0) {
      return phoneSearchResults;
    }
    
    if (searchType === 'name' && nameSearchResults.length > 0) {
      return nameSearchResults;
    }

    // Əks halda local filter istifadə et
    return displayCustomers.filter(customer => {
      const search = searchTerm.toLowerCase().trim();
      const fullName = `${customer.name || customer.firstName || ""} ${customer.surname || customer.lastName || ""}`.toLowerCase();
      return (
        fullName.includes(search) ||
        ((customer.name || customer.firstName) && (customer.name || customer.firstName).toLowerCase().includes(search)) ||
        ((customer.surname || customer.lastName) && (customer.surname || customer.lastName).toLowerCase().includes(search)) ||
        ((customer.phoneNumber || customer.phone) && (customer.phoneNumber || customer.phone).toLowerCase().includes(search)) ||
        (customer.address && customer.address.toLowerCase().includes(search)) ||
        ((customer.price || customer.pricePerBidon) && (customer.price || customer.pricePerBidon).toString().includes(search))
      );
    });
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '@media (min-width: 768px)': {
        padding: '1.5rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.75rem'
      }
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      '@media (max-width: 767px)': {
        padding: '0 0.25rem'
      }
    },
    headerCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      '@media (min-width: 768px)': {
        borderRadius: '1.25rem',
        padding: '2rem',
        marginBottom: '2rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.75rem',
        marginBottom: '0.75rem',
        borderRadius: '0.5rem',
        position: 'sticky',
        top: '0',
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        border: '1px solid #e5e7eb'
      }
    },
    headerFlex: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
      flexDirection: 'column',
      gap: '1rem',
      '@media (min-width: 768px)': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem'
      },
      '@media (max-width: 767px)': {
        marginBottom: '0.75rem',
        gap: '0.5rem',
        flexDirection: 'row',
        alignItems: 'center'
      }
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
      '@media (min-width: 768px)': {
        gap: '1rem',
        width: 'auto'
      },
      '@media (max-width: 767px)': {
        gap: '0.5rem',
        flex: 1
      }
    },
    iconBox: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      padding: '0.75rem',
      borderRadius: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '@media (min-width: 768px)': {
        padding: '0.75rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.375rem',
        borderRadius: '0.375rem',
        minWidth: '2rem',
        minHeight: '2rem'
      }
    },
    headerText: {
      margin: 0,
      flex: 1
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937',
      margin: '0 0 4px 0',
      '@media (min-width: 768px)': {
        fontSize: '2rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '1rem',
        margin: '0 0 1px 0',
        lineHeight: '1.2'
      }
    },
    subtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.625rem',
        lineHeight: '1.2'
      }
    },
    statsBox: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      border: '1px solid #93c5fd',
      alignSelf: 'flex-start',
      '@media (min-width: 768px)': {
        padding: '0.75rem 1.5rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.375rem 0.5rem',
        borderRadius: '0.375rem',
        alignSelf: 'center',
        textAlign: 'center',
        minWidth: 'fit-content'
      }
    },
    statsText: {
      color: '#1e40af',
      fontWeight: '600',
      margin: 0,
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.75rem',
        lineHeight: '1.2'
      }
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      flexDirection: 'column',
      width: '100%',
      '@media (min-width: 640px)': {
        flexDirection: 'row',
        width: 'auto'
      },
      '@media (max-width: 767px)': {
        gap: '0.375rem',
        flexDirection: 'row',
        width: 'auto',
        flexWrap: 'wrap'
      }
    },
    addButton: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: 'white',
      padding: '0.875rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem',
      boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.3)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      '@media (min-width: 640px)': {
        width: 'auto',
        fontSize: '1rem',
        padding: '1rem 2rem',
        gap: '0.75rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        borderRadius: '0.375rem',
        width: 'auto',
        minWidth: 'fit-content'
      }
    },
    exportButton: {
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      padding: '0.875rem 1.5rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem',
      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      '@media (min-width: 640px)': {
        width: 'auto',
        fontSize: '1rem',
        padding: '1rem 1.5rem',
        gap: '0.75rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.5rem 0.75rem',
        fontSize: '0.75rem',
        borderRadius: '0.375rem',
        width: 'auto',
        minWidth: 'fit-content'
      }
    },
    searchCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      '@media (min-width: 768px)': {
        borderRadius: '1.25rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      },
      '@media (max-width: 767px)': {
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '0.75rem'
      }
    },
    searchContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '600px'
    },
    searchInput: {
      width: '100%',
      padding: '1rem 1rem 1rem 3rem',
      border: '2px solid #e5e7eb',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      background: '#f9fafb',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      '@media (max-width: 767px)': {
        padding: '0.875rem 0.875rem 0.875rem 2.5rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem'
      }
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      '@media (max-width: 767px)': {
        left: '0.75rem'
      }
    },
    searchResults: {
      marginTop: '1rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    formCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      padding: '1.25rem',
      marginBottom: '1.5rem',
      '@media (min-width: 768px)': {
        borderRadius: '1.25rem',
        padding: '2rem',
        marginBottom: '2rem'
      },
      '@media (max-width: 767px)': {
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '0.75rem'
      }
    },
    formHeader: {
      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      '@media (max-width: 767px)': {
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '0.5rem'
      }
    },
    formTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 8px 0',
      '@media (min-width: 768px)': {
        fontSize: '1.5rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '1.125rem',
        margin: '0 0 4px 0'
      }
    },
    formSubtitle: {
      color: 'rgba(255, 255, 255, 0.8)',
      margin: 0,
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.75rem'
      }
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
      marginBottom: '1.5rem',
      '@media (min-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      },
      '@media (max-width: 767px)': {
        gap: '1rem',
        marginBottom: '1rem'
      }
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    label: {
      display: 'flex',
      alignItems: 'center',
      color: '#374151',
      fontWeight: '600',
      gap: '0.5rem',
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.8rem'
      }
    },
    input: {
      width: '100%',
      padding: '0.875rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '0.75rem',
      fontSize: '1rem',
      background: '#f9fafb',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      '@media (max-width: 767px)': {
        padding: '0.75rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem'
      }
    },
    submitButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.3)',
      transition: 'all 0.3s ease',
      '@media (max-width: 767px)': {
        padding: '0.875rem 1.5rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem'
      }
    },
    tableCard: {
      background: 'white',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      overflow: 'hidden',
      '@media (min-width: 768px)': {
        borderRadius: '1.25rem'
      },
      '@media (max-width: 767px)': {
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
    tableHeader: {
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
      padding: '1.5rem',
      '@media (max-width: 767px)': {
        padding: '1rem'
      }
    },
    tableTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: 'white',
      margin: '0 0 4px 0',
      '@media (min-width: 768px)': {
        fontSize: '1.5rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '1.125rem',
        margin: '0 0 2px 0'
      }
    },
    tableSubtitle: {
      color: '#d1d5db',
      margin: 0,
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.75rem'
      }
    },
    tableWrapper: {
      overflowX: 'auto',
      maxWidth: '100%'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px',
      '@media (max-width: 767px)': {
        minWidth: '500px'
      }
    },
    tableHeadRow: {
      background: 'linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%)'
    },
    th: {
      padding: '1rem',
      textAlign: 'left',
      fontWeight: 'bold',
      color: '#1f2937',
      borderBottom: '2px solid #3b82f6',
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.75rem 0.5rem',
        fontSize: '0.8rem'
      }
    },
    thContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      '@media (max-width: 767px)': {
        gap: '0.25rem'
      }
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      },
      '@media (max-width: 767px)': {
        padding: '0.75rem 0.5rem',
        fontSize: '0.8rem'
      }
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
      padding: '0.25rem 0.75rem',
      borderRadius: '1rem',
      fontWeight: 'bold',
      fontSize: '0.75rem',
      '@media (min-width: 768px)': {
        fontSize: '0.875rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.7rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '0.75rem'
      }
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexDirection: 'column',
      '@media (min-width: 640px)': {
        flexDirection: 'row'
      },
      '@media (max-width: 767px)': {
        gap: '0.375rem'
      }
    },
    editButton: {
      background: '#3b82f6',
      color: 'white',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      '@media (min-width: 768px)': {
        fontSize: '0.875rem',
        padding: '0.375rem 0.75rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.7rem',
        padding: '0.375rem 0.5rem',
        borderRadius: '0.375rem'
      }
    },
    deleteButton: {
      background: '#ef4444',
      color: 'white',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'background 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      '@media (min-width: 768px)': {
        fontSize: '0.875rem',
        padding: '0.375rem 0.75rem'
      },
      '@media (max-width: 767px)': {
        fontSize: '0.7rem',
        padding: '0.375rem 0.5rem',
        borderRadius: '0.375rem'
      }
    },
    // Mobile cards for better mobile experience
    mobileCard: {
      background: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      border: '1px solid #f1f5f9',
      transition: 'all 0.3s ease'
    },
    mobileCardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #f1f5f9'
    },
    mobileCardName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1f2937',
      lineHeight: '1.4'
    },
    mobileCardInfo: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      marginBottom: '1rem'
    },
    mobileCardRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      fontSize: '1rem',
      lineHeight: '1.5'
    },
    mobileCardActions: {
      display: 'flex',
      gap: '0.75rem',
      marginTop: '1rem',
      paddingTop: '1rem',
      borderTop: '2px solid #f1f5f9'
    },
    emptyState: {
      textAlign: 'center',
      padding: '3rem 1.5rem'
    },
    emptyTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: '#6b7280',
      margin: '1rem 0 0.5rem 0',
      '@media (min-width: 768px)': {
        fontSize: '1.25rem'
      }
    },
    emptyText: {
      color: '#9ca3af',
      margin: 0,
      fontSize: '0.875rem',
      '@media (min-width: 768px)': {
        fontSize: '1rem'
      }
    },
    loadingState: {
      textAlign: 'center',
      padding: '4rem 1.5rem'
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
      padding: '4rem 1.5rem',
      color: '#ef4444'
    },
    retryButton: {
      background: '#3b82f6',
      color: 'white',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      marginTop: '1rem'
    }
  };

  const filteredCustomers = getFilteredCustomers();

  // Check if mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Authentication check
  if (!isAuthenticated) {
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
            <p>Xəta baş verdi: {error.data?.message || error.message}</p>
            <button onClick={() => refetch()} style={styles.retryButton}>
              Yenidən cəhd edin
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mobile customer cards component
  const MobileCustomerCards = ({ customers }) => (
    <div style={{ padding: '0.5rem' }}>
      {customers.map((customer) => (
        <div key={customer.id} style={styles.mobileCard}>
          <div style={styles.mobileCardHeader}>
            <div style={styles.mobileCardName}>
              {customer.name || customer.firstName} {customer.surname || customer.lastName}
            </div>
            <div style={{
              ...styles.priceBadge,
              fontSize: '1rem',
              padding: '0.5rem 1rem',
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              border: '2px solid #22c55e'
            }}>
              {customer.price || customer.pricePerBidon} AZN
            </div>
          </div>
          
          <div style={styles.mobileCardInfo}>
            <div style={styles.mobileCardRow}>
              <div style={{
                background: '#f3f4f6',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '2.5rem'
              }}>
                <MapPin size={20} color="#6b7280" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Ünvan
                </div>
                <div style={{ color: '#374151', fontWeight: '500' }}>
                  {customer.address}
                </div>
              </div>
            </div>
            
            <div style={styles.mobileCardRow}>
              <div style={{
                background: '#f3f4f6',
                padding: '0.5rem',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '2.5rem'
              }}>
                <Phone size={20} color="#6b7280" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                  Telefon
                </div>
                <div style={{ color: '#2563eb', fontWeight: '600', fontSize: '1.125rem' }}>
                  {customer.phoneNumber || customer.phone}
                </div>
              </div>
            </div>
          </div>
          
          <div style={styles.mobileCardActions}>
            <button
              onClick={() => handleEditCustomer(customer)}
              style={{
                ...styles.editButton,
                flex: 1,
                padding: '0.875rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '0.75rem'
              }}
              title="Redaktə et"
            >
              <Edit size={18} />
              <span style={{ marginLeft: '0.5rem' }}>Redaktə Et</span>
            </button>
            <button
              onClick={() => handleDeleteCustomer(customer.id)}
              style={{
                ...styles.deleteButton,
                flex: 1,
                padding: '0.875rem 1rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '0.75rem'
              }}
              disabled={isDeleting}
              title="Sil"
            >
              <Trash2 size={18} />
              <span style={{ marginLeft: '0.5rem' }}>Sil</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        {/* Header Section */}
        <div style={styles.headerCard}>
          <div style={styles.headerFlex}>
            <div style={styles.headerLeft}>
              <div style={styles.iconBox}>
                <Users size={window.innerWidth < 768 ? 20 : 32} color="white" />
              </div>
              <div style={styles.headerText}>
                <h1 style={styles.title}>Müştəri İdarəsi</h1>
                <p style={styles.subtitle}>Müştəri məlumatlarını idarə edin</p>
              </div>
            </div>
            <div style={styles.statsBox}>
              <p style={styles.statsText}>Cəmi Müştəri: {displayCustomers.length}</p>
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
                             {showForm ? <Minus size={16} /> : <Plus size={16} />}
              <span>{showForm ? 'Formu Bağla' : 'Yeni Müştəri Əlavə Et'}</span>
            </button>

            <button
              onClick={handleExportCustomers}
              style={styles.exportButton}
              disabled={displayCustomers.length === 0}
            >
                             <Download size={16} />
              <span>Excel Export</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        {displayCustomers.length > 0 && (
          <div style={styles.searchCard}>
            <div style={styles.searchContainer}>
              <div style={styles.searchIcon}>
                                 <Search size={window.innerWidth < 768 ? 18 : 20} color="#6b7280" />
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

            <div style={{ ...styles.inputGroup, marginBottom: '1.5rem' }}>
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

        {/* Table/Cards Section */}
        <div style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Müştəri Siyahısı</h2>
            <p style={styles.tableSubtitle}>
              {searchTerm ? `"${searchTerm}" axtarışı üçün nəticələr` : 'Bütün müştəri məlumatları'}
            </p>
          </div>

          {/* Mobile View - Cards */}
          {typeof window !== 'undefined' && window.innerWidth < 768 ? (
            <div style={{ padding: '1rem' }}>
              <MobileCustomerCards customers={filteredCustomers} />
            </div>
          ) : (
            /* Desktop View - Table */
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeadRow}>
                    <th style={styles.th}>
                      <div style={styles.thContent}>
                        <User size={window.innerWidth < 768 ? 14 : 16} color="#2563eb" />
                        Ad
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={styles.thContent}>
                        <User size={window.innerWidth < 768 ? 14 : 16} color="#2563eb" />
                        Soyad
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={styles.thContent}>
                        <MapPin size={window.innerWidth < 768 ? 14 : 16} color="#2563eb" />
                        Ünvan
                      </div>
                    </th>
                    <th style={styles.th}>
                      <div style={styles.thContent}>
                        <Phone size={window.innerWidth < 768 ? 14 : 16} color="#2563eb" />
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
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>
                          {customer.name || customer.firstName}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>
                          {customer.surname || customer.lastName}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#374151', wordBreak: 'break-word' }}>
                          {customer.address}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={{ color: '#2563eb', fontWeight: '500' }}>
                          {customer.phoneNumber || customer.phone}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <span style={styles.priceBadge}>
                          {customer.price || customer.pricePerBidon} {customer.currency || 'AZN'}
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
                            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
                              Redaktə
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id)}
                            style={styles.deleteButton}
                            disabled={isDeleting}
                            title="Sil"
                          >
                            <Trash2 size={14} />
                            <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
                              Sil
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty States */}
          {filteredCustomers.length === 0 && displayCustomers.length > 0 && (
            <div style={styles.emptyState}>
              <Search size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
              <h3 style={styles.emptyTitle}>Axtarış nəticəsi tapılmadı</h3>
              <p style={styles.emptyText}>"{searchTerm}" axtarışı üçün heç bir müştəri tapılmadı</p>
            </div>
          )}

          {displayCustomers.length === 0 && (
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
        
        /* Hover effects */
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.2);
        }
        
        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* Mobile optimizations */
        @media (max-width: 767px) {
          .table-wrapper {
            display: none;
          }
        }
        
        @media (min-width: 768px) {
          .mobile-cards {
            display: none;
          }
        }
        
        /* Responsive text sizing */
        @media (max-width: 480px) {
          h1 {
            font-size: 1.25rem !important;
          }
          h2 {
            font-size: 1.125rem !important;
          }
          .container {
            padding: 0.75rem !important;
          }
        }
        
        /* High contrast mode support */
        @media (prefers-contrast: high) {
          .card {
            border: 2px solid #000;
          }
          .button {
            border: 2px solid currentColor;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
        
        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
          .container {
            background: white !important;
            box-shadow: none !important;
          }
          .card {
            break-inside: avoid;
            box-shadow: none !important;
            border: 1px solid #000;
          }
        }
        
        /* Focus visible for accessibility */
        button:focus-visible,
        input:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}

export default CustomerData;