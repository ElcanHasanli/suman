import { useState, useMemo } from 'react';
import { 
    Users, 
    DollarSign, 
    Droplets, 
    CreditCard, 
    AlertCircle, 
    CheckCircle, 
    TrendingUp, 
    Calculator,
    Phone,
    Calendar,
    Eye,
    EyeOff
} from 'lucide-react';

function MobileBalancePanel() {
    const [showDetails, setShowDetails] = useState({});

    // Test məlumatları
    const testOrders = [
        {
            id: 1,
            customerId: 1,
            date: '2024-01-15',
            bidonOrdered: 10,
            bidonReturned: 8,
            paymentMethod: 'cash',
            completed: true
        },
        {
            id: 2,
            customerId: 2,
            date: '2024-01-15',
            bidonOrdered: 15,
            bidonReturned: 0,
            paymentMethod: 'credit',
            completed: false
        },
        {
            id: 3,
            customerId: 3,
            date: '2024-01-15',
            bidonOrdered: 8,
            bidonReturned: 6,
            paymentMethod: 'cash',
            completed: true
        },
        {
            id: 4,
            customerId: 1,
            date: '2024-01-10',
            bidonOrdered: 5,
            bidonReturned: 3,
            paymentMethod: 'credit',
            completed: false
        }
    ];

    const testCustomers = [
        { id: 1, firstName: 'Elcan', lastName: 'Hasanli', phone: '+994505556232', pricePerBidon: 5 },
        { id: 2, firstName: 'Nicat', lastName: 'Məmmədov', phone: '+994551234567', pricePerBidon: 4 },
        { id: 3, firstName: 'Rəşad', lastName: 'Əliyev', phone: '+994701234567', pricePerBidon: 6 }
    ];

    // Hər müştəri üçün qalıqları hesabla
    const customerBalances = useMemo(() => {
        return testCustomers
            .map(customer => {
                const customerOrders = testOrders.filter(order => order.customerId === customer.id);

                if (customerOrders.length === 0) return null;

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
            .filter(Boolean);
    }, []);

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

    const toggleDetails = (customerId) => {
        setShowDetails(prev => ({
            ...prev,
            [customerId]: !prev[customerId]
        }));
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)' }}>
            {/* Header */}
            <div style={{
                background: 'linear-gradient(135deg, #eab308 0%, #d97706 100%)',
                color: 'white',
                padding: '1.5rem 1rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    width: '128px',
                    height: '128px',
                    background: 'white',
                    opacity: 0.1,
                    borderRadius: '50%',
                    marginRight: '-64px',
                    marginTop: '-64px'
                }}></div>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <Calculator size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Qalıqlar Paneli</h1>
                        <p style={{ color: 'rgba(254, 240, 138, 1)', fontSize: '0.875rem', margin: 0 }}>
                            Müştəri balansları və qalıq bidonlar
                        </p>
                    </div>
                </div>

                {/* Statistikalar */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Users size={16} />
                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Müştəri</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalStats.totalCustomers}</div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Droplets size={16} />
                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Aktiv Bidon</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalStats.totalActiveBidons}</div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <DollarSign size={16} />
                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Ümumi Borc</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalStats.totalDebt}₼</div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 255, 255, 0.15)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '12px',
                        padding: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <AlertCircle size={16} />
                            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Borclu</span>
                        </div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalStats.customersWithDebt}</div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '1rem' }}>
                {/* Müştəri Balansları */}
                {customerBalances.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {customerBalances.map(balance => (
                            <div 
                                key={balance.customer.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    padding: '1rem',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                                    borderLeft: `4px solid ${balance.totalDebt > 0 ? '#ef4444' : '#10b981'}`
                                }}
                            >
                                {/* Status Badge */}
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.125rem',
                                            fontWeight: 'bold',
                                            background: balance.totalDebt > 0 
                                                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' 
                                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                        }}>
                                            {balance.customer.firstName.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 style={{
                                                fontWeight: 'bold',
                                                color: '#1f2937',
                                                fontSize: '1.125rem',
                                                margin: 0
                                            }}>
                                                {balance.customer.firstName} {balance.customer.lastName}
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                fontSize: '0.875rem',
                                                color: '#6b7280'
                                            }}>
                                                <Phone size={12} />
                                                {balance.customer.phone}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.25rem',
                                        background: balance.totalDebt > 0 ? '#fef2f2' : '#f0fdf4',
                                        color: balance.totalDebt > 0 ? '#dc2626' : '#16a34a'
                                    }}>
                                        {balance.totalDebt > 0 ? (
                                            <>
                                                <AlertCircle size={12} />
                                                BORCLU
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle size={12} />
                                                TƏMİZ
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Ana Məlumatlar */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '0.75rem',
                                    marginBottom: '1rem'
                                }}>
                                    <div style={{
                                        background: '#eff6ff',
                                        borderRadius: '12px',
                                        padding: '0.75rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.25rem',
                                            marginBottom: '0.5rem',
                                            color: '#2563eb'
                                        }}>
                                            <Droplets size={14} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>AKTİV QALİQ</span>
                                        </div>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: balance.activeBidonBalance > 0 ? '#dc2626' : '#16a34a'
                                        }}>
                                            {balance.activeBidonBalance}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>bidon</div>
                                    </div>

                                    <div style={{
                                        background: '#fefce8',
                                        borderRadius: '12px',
                                        padding: '0.75rem',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.25rem',
                                            marginBottom: '0.5rem',
                                            color: '#ca8a04'
                                        }}>
                                            <DollarSign size={14} />
                                            <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>AKTİV BORC</span>
                                        </div>
                                        <div style={{
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            color: balance.totalDebt > 0 ? '#dc2626' : '#16a34a'
                                        }}>
                                            {balance.totalDebt}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>AZN</div>
                                    </div>
                                </div>

                                {/* Toggle Düyməsi */}
                                <button
                                    onClick={() => toggleDetails(balance.customer.id)}
                                    style={{
                                        width: '100%',
                                        background: '#f3f4f6',
                                        borderRadius: '12px',
                                        padding: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        color: '#374151',
                                        fontWeight: '500',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s ease'
                                    }}
                                    onMouseOver={e => e.currentTarget.style.background = '#e5e7eb'}
                                    onMouseOut={e => e.currentTarget.style.background = '#f3f4f6'}
                                >
                                    {showDetails[balance.customer.id] ? (
                                        <>
                                            <EyeOff size={16} />
                                            Ətraflını Gizlə
                                        </>
                                    ) : (
                                        <>
                                            <Eye size={16} />
                                            Ətraflını Göstər
                                        </>
                                    )}
                                </button>

                                {/* Ətraflı Məlumatlar */}
                                {showDetails[balance.customer.id] && (
                                    <div style={{
                                        marginTop: '1rem',
                                        paddingTop: '1rem',
                                        borderTop: '1px solid #e5e7eb'
                                    }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: '1fr 1fr',
                                            gap: '0.75rem',
                                            fontSize: '0.875rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                padding: '0.5rem 0',
                                                borderBottom: '1px solid #f3f4f6'
                                            }}>
                                                <span style={{ color: '#6b7280' }}>Verilmiş:</span>
                                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
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
                                                <span style={{ fontWeight: '600', color: '#1f2937' }}>
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
                                                <span style={{ fontWeight: '600', color: '#dc2626' }}>
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
                                                marginTop: '0.75rem',
                                                padding: '0.75rem',
                                                background: '#f9fafb',
                                                borderRadius: '12px',
                                                textAlign: 'center'
                                            }}>
                                                <div style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    color: '#6b7280',
                                                    fontSize: '0.875rem'
                                                }}>
                                                    <Calendar size={14} />
                                                    Son sifariş: {new Date(balance.lastOrderDate).toLocaleDateString('az-AZ')}
                                                </div>
                                            </div>
                                        )}

                                        {/* Qiymət Məlumatı */}
                                        <div style={{
                                            marginTop: '0.75rem',
                                            padding: '0.75rem',
                                            background: '#eff6ff',
                                            borderRadius: '12px'
                                        }}>
                                            <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                                                <span style={{ color: '#6b7280' }}>Bidon qiyməti: </span>
                                                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                                                    {balance.customer.pricePerBidon}₼
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '2rem',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                    }}>
                        <Users size={48} style={{ margin: '0 auto 1rem auto', color: '#9ca3af' }} />
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#6b7280', margin: '0 0 0.5rem 0' }}>
                            Müştəri Yoxdur
                        </h3>
                        <p style={{ color: '#9ca3af', margin: 0 }}>
                            Qalıqları görmək üçün əvvəlcə müştəri və sifariş əlavə edin
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MobileBalancePanel;