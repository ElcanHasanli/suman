import React, { useState } from 'react';
import { Plus, Users, User, MapPin, Phone, DollarSign, Search, Download, Edit, Trash2, RotateCcw, Archive } from 'lucide-react';
import { toast } from 'react-toastify';
import CustomerModal from '../../components/CustomerModal';
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import AnimatedInput from '../../components/AnimatedInput';
import { 
  useGetCustomersQuery, 
  useCreateCustomerMutation, 
  useUpdateCustomerMutation, 
  useDeleteCustomerMutation,
  // useRestoreCustomerMutation, // Backend-də mövcud deyil
  // useGetDeletedCustomersQuery, // Backend-də mövcud deyil
  useSearchCustomerByPhoneQuery,
  useSearchCustomerByNameSurnameQuery,
  useExportCustomersQuery,
  useGetCustomerCountQuery
} from '../../services/apiSlice';
import { useAuth } from '../../contexts/AuthContext';

function CustomerData() {
  const { isAuthenticated } = useAuth();
  const [editMode, setEditMode] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('general'); // general, phone, name
  const [activeTab, setActiveTab] = useState('active'); // Yalnız active tab
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    pricePerBidon: '',
    activeBidonCount: '',
    debtAmount: ''
  });

  // API hooks - indi aktiv
  const { data: customers = [], isLoading, error, refetch } = useGetCustomersQuery();
  // const { data: deletedCustomers = [], isLoading: isLoadingDeleted, error: deletedError, refetch: refetchDeleted } = useGetDeletedCustomersQuery(); // Backend-də mövcud deyil
  const { data: customerCount = 0 } = useGetCustomerCountQuery();
  
  // Check if error is 404 (no customers) or actual error
  const isNoCustomersError = error && error.status === 404;
  const hasActualError = error && error.status !== 404;
  
  // Use actual customers if available, otherwise empty array
  const displayCustomers = customers || [];
  const displayDeletedCustomers = []; // Deleted customers API is not available yet
  const [createCustomer, { isLoading: isCreating }] = useCreateCustomerMutation();
  const [updateCustomer, { isLoading: isUpdating }] = useUpdateCustomerMutation();
  const [deleteCustomer, { isLoading: isDeleting }] = useDeleteCustomerMutation();
  // const [restoreCustomer, { isLoading: isRestoring }] = useRestoreCustomerMutation(); // Backend-də mövcud deyil
  
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
    setModalOpen(true);
    setEditMode(customer.id);
    setFormData({
      firstName: customer.name || customer.firstName || '',
      lastName: customer.surname || customer.lastName || '',
      address: customer.address || '',
      phone: customer.phoneNumber || customer.phone || '',
      pricePerBidon: customer.price || customer.pricePerBidon || '',
      activeBidonCount: customer.activeBidonCount || customer.activeBidon || customer.bidonRemaining || 0,
      debtAmount: customer.debtAmount || customer.debt || 0
    });
  };

  const handleDeleteCustomer = (id) => {
    const customer = displayCustomers.find(c => c.id === id);
    if (customer) {
      setCustomerToDelete(customer);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    try {
      // Use existing DELETE endpoint which does soft delete
      await deleteCustomer(customerToDelete.id).unwrap();
      refetch();
      toast.success('Müştəri arxivə göndərildi!');
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Müştəri silinərkən xəta baş verdi: ' + (error.data?.message || error.message));
    }
  };

  // const handleRestoreCustomer = async (id) => {
  //   try {
  //     await restoreCustomer(id).unwrap();
  //     refetch();
  //     refetchDeleted();
  //     toast.success('Müştəri bərpa edildi!');
  //   } catch (error) {
  //     console.error('Restore error:', error);
  //     toast.error('Müştəri bərpa edilərkən xəta baş verdi: ' + (error.data?.message || error.message));
  //   }
  // };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCustomerToDelete(null);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
    setEditMode(null);
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      pricePerBidon: '',
      activeBidonCount: '',
      debtAmount: ''
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditMode(null);
    setFormData({
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      pricePerBidon: '',
      activeBidonCount: '',
      debtAmount: ''
    });
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
    let { firstName, lastName, address, phone, pricePerBidon, activeBidonCount, debtAmount } = formData;

    firstName = firstName.trim();
    lastName = lastName.trim();
    address = address.trim();
    phone = phone.trim();
    pricePerBidon = pricePerBidon.toString().trim();
    activeBidonCount = (activeBidonCount ?? '').toString().trim();
    debtAmount = (debtAmount ?? '').toString().trim();

    if (!firstName || !lastName || !address || !phone || !pricePerBidon) {
      toast.warning('Zəhmət olmasa bütün sahələri doldurun!');
      return;
    }

    const price = Number(pricePerBidon);
    const activeBidons = activeBidonCount === '' ? 0 : Number(activeBidonCount);
    const debt = debtAmount === '' ? 0 : Number(debtAmount);
    if (isNaN(price) || price <= 0) {
      toast.warning('Qiymət düzgün daxil edilməyib!');
      return;
    }
    if (isNaN(activeBidons) || activeBidons < 0) {
      toast.warning('Aktiv bidon sayı düzgün deyil!');
      return;
    }
    if (isNaN(debt) || debt < 0) {
      toast.warning('Borc məbləği düzgün deyil!');
      return;
    }

    if (!/^\+?\d{9,14}$/.test(phone)) {
      toast.warning('Zəhmət olmasa düzgün telefon nömrəsi daxil edin!');
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
        price: price,
        activeBidonCount: activeBidons,
        debtAmount: debt
      };

      if (editMode) {
        // Update customer
        await updateCustomer({
          id: editMode,
          ...customerData
        }).unwrap();
        toast.success('Müştəri məlumatları uğurla yeniləndi!');
      } else {
        // Create new customer
        await createCustomer(customerData).unwrap();
        toast.success('Yeni müştəri uğurla əlavə edildi!');
      }

      // Reset form and close modal
      setFormData({
        firstName: '',
        lastName: '',
        address: '',
        phone: '',
        pricePerBidon: '',
        activeBidonCount: '',
        debtAmount: ''
      });
      setModalOpen(false);
      setEditMode(null);
      refetch();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Xəta baş verdi: ' + (error.data?.message || error.message));
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
        toast.success('Müştəri siyahısı uğurla export edildi!');
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Export error:', error);
              toast.error('Export xətası: ' + error.message);
    } finally {
      setExportTrigger(false);
    }
  };

  // Filtered customers based on search and active tab
  const getFilteredCustomers = () => {
    const currentCustomers = activeTab === 'active' ? displayCustomers : displayDeletedCustomers;
    
    if (!searchTerm) return currentCustomers;

    // Əgər search type phone və ya name-dirsə, API search istifadə et
    if (searchType === 'phone' && phoneSearchResults.length > 0) {
      return phoneSearchResults;
    }
    
    if (searchType === 'name' && nameSearchResults.length > 0) {
      return nameSearchResults;
    }

    // Əks halda local filter istifadə et
    return currentCustomers.filter(customer => {
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
      background: '#f8fafc',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '@media (minWidth: 768px)': {
        padding: '1.5rem'
      },
        '@media (maxWidth: 767px)': {
        padding: '0.75rem'
      }
    },
    maxWidth: {
      maxWidth: '1400px',
      margin: '0 auto',
      width: '100%',
      '@media (maxWidth: 767px)': {
        padding: '0 0.25rem'
      }
    },
    headerCard: {
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '1rem',
      marginBottom: '1rem',
      '@media (minWidth: 768px)': {
        borderRadius: '1.25rem',
        padding: '2rem',
        marginBottom: '2rem'
      },
        '@media (maxWidth: 767px)': {
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
      '@media (minWidth: 768px)': {
        flexDirection: 'row',
        alignItems: 'center',
        gap: '1rem'
      },
      '@media (maxWidth: 767px)': {
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
      '@media (minWidth: 768px)': {
        gap: '1rem',
        width: 'auto'
      },
      '@media (maxWidth: 767px)': {
        gap: '0.5rem',
        flex: 1
      }
    },
    iconBox: {
      background: '#e5e7eb',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '@media (minWidth: 768px)': {
        padding: '0.75rem'
      },
      '@media (maxWidth: 767px)': {
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
      fontSize: '1.25rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 4px 0',
      '@media (minWidth: 768px)': {
        fontSize: '2rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '1rem',
        margin: '0 0 1px 0',
        lineHeight: '1.2'
      }
    },
    subtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '0.875rem',
      '@media (minWidth: 768px)': {
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '0.625rem',
        lineHeight: '1.2'
      }
    },
    statsBox: {
      background: '#f8fafc',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      alignSelf: 'flex-start',
      '@media (minWidth: 768px)': {
        padding: '0.75rem 1.5rem'
      },
      '@media (maxWidth: 767px)': {
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
      '@media (minWidth: 768px)': {
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '0.75rem',
        lineHeight: '1.2'
      }
    },
    buttonGroup: {
      display: 'flex',
      gap: '0.75rem',
      flexDirection: 'row',
      width: '100%',
      flexWrap: 'wrap',
      alignItems: 'center',
      '@media (minWidth: 640px)': {
        flexDirection: 'row',
        width: 'auto',
        flexWrap: 'nowrap'
      },
      '@media (maxWidth: 767px)': {
        gap: '0.5rem',
        flexDirection: 'row',
        width: 'auto',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }
    },
    addButton: {
      background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      color: '#ffffff',
      padding: '0.75rem 1.25rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem',
      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      '@media (minWidth: 640px)': {
        padding: '0.875rem 1.5rem',
        fontSize: '0.9375rem',
        gap: '0.625rem'
      },
      '@media (maxWidth: 767px)': {
        padding: '0.625rem 1rem',
        fontSize: '0.8125rem',
        borderRadius: '0.5rem',
        gap: '0.375rem'
      },
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(37, 99, 235, 0.35)'
      },
      '&:active': {
        transform: 'translateY(0)'
      }
    },
    exportButton: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#ffffff',
      padding: '0.75rem 1.25rem',
      borderRadius: '0.75rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.875rem',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      '@media (minWidth: 640px)': {
        padding: '0.875rem 1.5rem',
        fontSize: '0.9375rem',
        gap: '0.625rem'
      },
      '@media (maxWidth: 767px)': {
        padding: '0.625rem 1rem',
        fontSize: '0.8125rem',
        borderRadius: '0.5rem',
        gap: '0.375rem'
      },
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 16px rgba(16, 185, 129, 0.35)'
      },
      '&:active': {
        transform: 'translateY(0)'
      },
      '&:disabled': {
        background: '#9ca3af',
        cursor: 'not-allowed',
        boxShadow: 'none',
        transform: 'none',
        opacity: 0.6
      }
    },
    searchCard: {
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '1rem',
      marginBottom: '1rem',
      '@media (minWidth: 768px)': {
        borderRadius: '1.25rem',
        padding: '1.5rem',
        marginBottom: '2rem'
      },
      '@media (maxWidth: 767px)': {
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
      padding: '0.75rem 0.75rem 0.75rem 2.5rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      background: '#f9fafb',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      '@media (maxWidth: 767px)': {
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
      '@media (maxWidth: 767px)': {
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
      borderRadius: '10px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      padding: '1rem',
      marginBottom: '1rem',
      '@media (minWidth: 768px)': {
        borderRadius: '1.25rem',
        padding: '2rem',
        marginBottom: '2rem'
      },
      '@media (maxWidth: 767px)': {
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '0.75rem'
      }
    },
    formHeader: {
      background: '#f8fafc',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
      '@media (maxWidth: 767px)': {
        padding: '1rem',
        marginBottom: '1rem',
        borderRadius: '0.5rem'
      }
    },
    formTitle: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 8px 0',
      '@media (minWidth: 768px)': {
        fontSize: '1.5rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '1.125rem',
        margin: '0 0 4px 0'
      }
    },
    formSubtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '0.875rem',
      '@media (minWidth: 768px)': {
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '0.75rem'
      }
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '1.5rem',
      marginBottom: '1.5rem',
      '@media (minWidth: 768px)': {
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      },
      '@media (maxWidth: 767px)': {
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
      '@media (minWidth: 768px)': {
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '0.8rem'
      }
    },
    input: {
      width: '100%',
      padding: '0.75rem 0.75rem',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      fontSize: '1rem',
      background: '#f9fafb',
      transition: 'all 0.3s ease',
      boxSizing: 'border-box',
      '@media (maxWidth: 767px)': {
        padding: '0.75rem 0.75rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem'
      }
    },
    submitButton: {
      width: '100%',
      background: '#10b981',
      color: '#ffffff',
      padding: '0.875rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      '@media (maxWidth: 767px)': {
        padding: '0.875rem 1.5rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem'
      }
    },
    tableCard: {
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      '@media (minWidth: 768px)': {
        borderRadius: '1.25rem'
      },
      '@media (maxWidth: 767px)': {
        borderRadius: '0.75rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }
    },
    tableHeader: {
      background: '#f8fafc',
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      '@media (maxWidth: 767px)': {
        padding: '1rem'
      }
    },
    tableTitle: {
      fontSize: '1.125rem',
      fontWeight: 700,
      color: '#111827',
      margin: '0 0 4px 0',
      '@media (minWidth: 768px)': {
        fontSize: '1.5rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '1.125rem',
        margin: '0 0 2px 0'
      }
    },
    tableSubtitle: {
      color: '#6b7280',
      margin: 0,
      fontSize: '0.875rem',
      '@media (minWidth: 768px)': {
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
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
      '@media (maxWidth: 767px)': {
        minWidth: '500px'
      }
    },
    tableHeadRow: {
      background: '#f8fafc'
    },
    th: {
      padding: '0.75rem 1rem',
      textAlign: 'left',
      fontWeight: 600,
      color: '#374151',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '0.875rem',
      '@media (minWidth: 768px)': {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
        padding: '0.75rem 0.5rem',
        fontSize: '0.8rem'
      }
    },
    thContent: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      '@media (maxWidth: 767px)': {
        gap: '0.25rem'
      }
    },
    td: {
      padding: '0.75rem 1rem',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '0.875rem',
      '@media (minWidth: 768px)': {
        padding: '1rem 1.5rem',
        fontSize: '1rem'
      },
      '@media (maxWidth: 767px)': {
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
      background: '#eef2ff',
      color: '#1e40af',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.375rem',
      fontWeight: 600,
      fontSize: '0.75rem',
      '@media (minWidth: 768px)': {
        fontSize: '0.875rem'
      },
          '@media (maxWidth: 767px)': {
        fontSize: '0.7rem',
        padding: '0.2rem 0.6rem',
        borderRadius: '0.75rem'
      }
    },
    actionButtons: {
      display: 'flex',
      gap: '0.5rem',
      flexDirection: 'column',
      '@media (minWidth: 640px)': {
        flexDirection: 'row'
      },
      '@media (maxWidth: 767px)': {
        gap: '0.375rem'
      }
    },
    editButton: {
      background: '#2563eb',
      color: '#ffffff',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'background 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      '@media (minWidth: 768px)': {
        fontSize: '0.875rem',
        padding: '0.375rem 0.75rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '0.7rem',
        padding: '0.375rem 0.5rem',
        borderRadius: '0.375rem'
      }
    },
    deleteButton: {
      background: '#ef4444',
      color: '#ffffff',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'background 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      '@media (minWidth: 768px)': {
        fontSize: '0.875rem',
        padding: '0.375rem 0.75rem'
      },
      '@media (maxWidth: 767px)': {
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
      '@media (minWidth: 768px)': {
        fontSize: '1.25rem'
      }
    },
    emptyText: {
      color: '#9ca3af',
      margin: 0,
      fontSize: '0.875rem',
      '@media (minWidth: 768px)': {
        fontSize: '1rem'
      }
    },
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem',
      minHeight: '400px'
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
    },
    tabContainer: {
      display: 'flex',
      background: '#f8fafc',
      borderRadius: '0.75rem',
      padding: '0.25rem',
      marginBottom: '1.5rem',
      border: '1px solid #e5e7eb'
    },
    tabButton: {
      flex: 1,
      padding: '0.75rem 1rem',
      borderRadius: '0.5rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: '600',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    activeTab: {
      background: '#2563eb',
      color: 'white',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
    },
    inactiveTab: {
      color: '#6b7280'
    },
    restoreButton: {
      background: '#10b981',
      color: '#ffffff',
      padding: '0.5rem 0.75rem',
      borderRadius: '0.375rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'background 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem',
      '@media (minWidth: 768px)': {
        fontSize: '0.875rem',
        padding: '0.375rem 0.75rem'
      },
      '@media (maxWidth: 767px)': {
        fontSize: '0.7rem',
        padding: '0.375rem 0.5rem',
        borderRadius: '0.375rem'
      }
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
          <LoadingSpinner size="large" color="#3b82f6" />
        </div>
        </div>
      </div>
    );
  }

  // Error state - only show for actual errors, not for 404 (no customers)
  if (hasActualError) {
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
        <div key={customer.id} style={{
          ...styles.mobileCard,
          border: '1px solid #f1f5f9'
        }}>
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
              title="Arxivlə"
            >
              <Archive size={18} />
              <span style={{ marginLeft: '0.5rem' }}>Arxivlə</span>
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
                <p style={styles.subtitle}>
                  {(displayCustomers.length === 0 || isNoCustomersError) 
                    ? 'İlk müştərinizi əlavə edərək başlayın' 
                    : 'Müştəri məlumatlarını idarə edin'
                  }
                </p>
              </div>
            </div>
            <div style={styles.statsBox}>
              <p style={styles.statsText}>
                Aktiv: {isNoCustomersError ? 0 : displayCustomers.length} | 
                Arxivlənmiş: {displayDeletedCustomers.length}
              </p>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={handleOpenModal}
              className="customer-action-btn customer-add-btn"
              style={{
                ...styles.addButton,
              }}
            >
              <Plus size={18} />
              <span>Müştəri Əlavə Et</span>
            </button>

            <button
              onClick={handleExportCustomers}
              className="customer-action-btn customer-export-btn"
              style={styles.exportButton}
              disabled={displayCustomers.length === 0 || isNoCustomersError}
            >
              <Download size={18} />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div style={styles.tabContainer}>
          <button
            onClick={() => setActiveTab('active')}
            style={{
              ...styles.tabButton,
              ...(activeTab === 'active' ? styles.activeTab : styles.inactiveTab)
            }}
          >
            <Users size={16} />
            Aktiv Müştərilər ({displayCustomers.length})
          </button>
        </div>

        {/* Search Section */}
        {(displayCustomers.length > 0 && !isNoCustomersError) && (
          <div style={styles.searchCard}>
            <div style={styles.searchContainer}>
              <div style={styles.searchIcon}>
                                 <Search size={window.innerWidth < 768 ? 18 : 20} color="#6b7280" />
              </div>
              <AnimatedInput
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

        {/* Customer Modal */}
        <CustomerModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          formData={formData}
          onChange={handleChange}
          editMode={editMode}
          isCreating={isCreating}
          isUpdating={isUpdating}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          customerName={customerToDelete ? `${customerToDelete.name || customerToDelete.firstName} ${customerToDelete.surname || customerToDelete.lastName}` : ''}
          isLoading={isDeleting}
        />

        {/* Table/Cards Section */}
        {(displayCustomers.length > 0 && !isNoCustomersError) && (
          <div style={styles.tableCard}>
            <div style={styles.tableHeader}>
              <h2 style={styles.tableTitle}>
                Aktiv Müştərilər
              </h2>
              <p style={styles.tableSubtitle}>
                {searchTerm ? `"${searchTerm}" axtarışı üçün nəticələr` : 'Aktiv müştəri məlumatları'}
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
                          Aktiv Bidon
                        </div>
                      </th>
                      <th style={styles.th}>
                        <div style={styles.thContent}>
                          Borc (AZN)
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
                        style={{
                          ...(index % 2 === 0 ? styles.evenRow : styles.oddRow)
                        }}
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
                          <span style={{
                            ...styles.priceBadge,
                            background: '#eef2ff',
                            color: '#1e40af',
                            border: '1px solid #c7d2fe'
                          }}>
                            {customer.price || customer.pricePerBidon} {customer.currency || 'AZN'}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span>
                            {customer.activeBidonCount || customer.activeBidon || customer.bidonRemaining || 0}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={{ color: (customer.debtAmount || customer.debt || 0) > 0 ? '#dc2626' : '#16a34a', fontWeight: '600' }}>
                            {(customer.debtAmount || customer.debt || 0)}
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
                              title="Arxivlə"
                            >
                              <Archive size={14} />
                              <span style={{ display: window.innerWidth < 640 ? 'none' : 'inline' }}>
                                Arxivlə
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
          </div>
        )}

        {/* Empty State for No Customers */}
        {activeTab === 'active' && (displayCustomers.length === 0 || isNoCustomersError) && (
          <div style={styles.emptyState}>
            <Users size={64} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
            <h3 style={styles.emptyTitle}>Hələ müştəri yoxdur</h3>
            <p style={styles.emptyText}>İlk müştərinizi əlavə etmək üçün yuxarıdakı düyməni basın</p>
          </div>
        )}

      </div>

      <style>{`
        /* Hover effects for buttons */
        .customer-action-btn:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .customer-add-btn:hover:not(:disabled) {
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.35) !important;
        }
        
        .customer-export-btn:hover:not(:disabled) {
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35) !important;
        }
        
        .customer-action-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        
        .customer-action-btn:disabled {
          cursor: not-allowed !important;
          opacity: 0.6 !important;
        }
        
        input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }


        
        /* Mobile optimizations */
          @media (maxWidth: 767px) {
          .table-wrapper {
            display: none;
          }
        }
        
        @media (minWidth: 768px) {
          .mobile-cards {
            display: none;
          }
        }
        
        /* Responsive text sizing */
          @media (maxWidth: 480px) {
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