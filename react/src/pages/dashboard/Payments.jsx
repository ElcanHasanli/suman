import React, { useState, useMemo } from 'react';
import { useOrders } from '../../contexts/OrdersContext';
import {
    DollarSign,
    Calendar,
    Users,
    TrendingUp,
    CreditCard,
    Banknote,
    Download,
    Filter,
    BarChart3,
    PieChart,
    Receipt,
    Wallet
} from 'lucide-react';

export default function Payments() {
    const { orders, customers } = useOrders();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCustomer, setSelectedCustomer] = useState('all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');

    // Test məlumatları - backend hazır olduqda real API-dən gələcək
    const testOrders = [
        {
            id: 1,
            customerId: 1,
            date: '2024-01-15',
            bidonOrdered: 10,
            paymentMethod: 'cash',
            completed: true,
            completedAt: '2024-01-15T14:30:00',
            amount: 50
        },
        {
            id: 2,
            customerId: 2,
            date: '2024-01-15',
            bidonOrdered: 15,
            paymentMethod: 'credit',
            completed: false,
            completedAt: null,
            amount: 75
        },
        {
            id: 3,
            customerId: 3,
            date: '2024-01-15',
            bidonOrdered: 8,
            paymentMethod: 'card',
            completed: true,
            completedAt: '2024-01-15T16:45:00',
            amount: 40
        },
        {
            id: 4,
            customerId: 1,
            date: '2024-01-14',
            bidonOrdered: 12,
            paymentMethod: 'cash',
            completed: true,
            completedAt: '2024-01-14T13:20:00',
            amount: 60
        },
        {
            id: 5,
            customerId: 2,
            date: '2024-01-14',
            bidonOrdered: 20,
            paymentMethod: 'card',
            completed: true,
            completedAt: '2024-01-14T15:10:00',
            amount: 100
        }
    ];

    // Əgər orders boşdursa, test məlumatlarından istifadə edirik
    const displayOrders = orders.length > 0 ? orders : testOrders;

    // Seçilmiş tarixə görə sifarişləri filtrlə
    const dailyOrders = useMemo(() => {
        return displayOrders.filter(order => order.date === selectedDate);
    }, [displayOrders, selectedDate]);

    // Müştəriyə görə filtrlə
    const filteredOrders = useMemo(() => {
        let filtered = dailyOrders;

        if (selectedCustomer !== 'all') {
            filtered = filtered.filter(order => order.customerId === parseInt(selectedCustomer));
        }

        if (paymentMethodFilter !== 'all') {
            filtered = filtered.filter(order => order.paymentMethod === paymentMethodFilter);
        }

        return filtered;
    }, [dailyOrders, selectedCustomer, paymentMethodFilter]);

    // Tamamlanmış sifarişlər (ödəniş edilmiş)
    const completedOrders = filteredOrders.filter(order => order.completed);

    // Gözləyən sifarişlər (ödəniş edilməmiş)
    const pendingOrders = filteredOrders.filter(order => !order.completed);

    // Günlük gəlir hesabla
    const dailyRevenue = useMemo(() => {
        return completedOrders.reduce((total, order) => {
            const customer = customers.find(c => c.id === order.customerId);
            const pricePerBidon = customer?.pricePerBidon || 5;
            return total + (order.bidonOrdered * pricePerBidon);
        }, 0);
    }, [completedOrders, customers]);

    // Günlük borc hesabla
    const dailyDebt = useMemo(() => {
        return pendingOrders.reduce((total, order) => {
            const customer = customers.find(c => c.id === order.customerId);
            const pricePerBidon = customer?.pricePerBidon || 5;
            return total + (order.bidonOrdered * pricePerBidon);
        }, 0);
    }, [pendingOrders, customers]);

    // Ödəniş metodlarına görə bölgü
    const paymentMethodStats = useMemo(() => {
        const stats = { cash: 0, credit: 0, card: 0 };

        completedOrders.forEach(order => {
            const customer = customers.find(c => c.id === order.customerId);
            const pricePerBidon = customer?.pricePerBidon || 5;
            const amount = order.bidonOrdered * pricePerBidon;

            if (order.paymentMethod === 'cash') {
                stats.cash += amount;
            } else if (order.paymentMethod === 'credit') {
                stats.credit += amount;
            } else if (order.paymentMethod === 'card') {
                stats.card += amount;
            }
        });

        return stats;
    }, [completedOrders, customers]);

    // Müştəri məlumatını gətir
    const getCustomer = (id) => customers.find(c => c.id === id) || { firstName: 'Naməlum', lastName: 'Müştəri' };

    // Tarix formatla
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('az-AZ', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Vaxt formatla
    const formatTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const date = new Date(dateTimeString);
        return date.toLocaleTimeString('az-AZ', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Məbləğ formatla
    const formatAmount = (amount) => {
        return `${amount} AZN`;
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
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
                    background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
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
                            <DollarSign size={32} color="white" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: 0, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                                Ödənişlər Paneli
                            </h1>
                            <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
                                {formatDate(selectedDate)} - Günlük gəlir və ödəniş hesabatları
                            </p>
                        </div>
                    </div>

                    {/* Filtrlər */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        <div style={{ position: 'relative' }}>
                            <Calendar size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)' }} />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                style={{
                                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    background: 'rgba(255, 255, 255, 0.9)',
                                    color: '#374151',
                                    outline: 'none',
                                    minWidth: '180px'
                                }}
                            />
                        </div>

                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#374151',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '200px'
                            }}
                        >
                            <option value="all">Bütün Müştərilər</option>
                            {customers.map(customer => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName}
                                </option>
                            ))}
                        </select>

                        <select
                            value={paymentMethodFilter}
                            onChange={(e) => setPaymentMethodFilter(e.target.value)}
                            style={{
                                padding: '0.75rem 1rem',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#374151',
                                outline: 'none',
                                cursor: 'pointer',
                                minWidth: '150px'
                            }}
                        >
                            <option value="all">Bütün Ödənişlər</option>
                            <option value="cash">Nağd</option>
                            <option value="card">Kart</option>
                            <option value="credit">Nəsiyə</option>
                        </select>

                        <button
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(255, 255, 255, 0.9)',
                                color: '#15803d',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 1)'}
                            onMouseOut={e => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'}
                        >
                            <Download size={18} />
                            Hesabat Yüklə
                        </button>
                    </div>
                </div>

                <div style={{ padding: '2.5rem' }}>

                    {/* Günlük Maliyyə Statistikaları */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <TrendingUp size={24} />
                                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>GÜNLÜK GƏLİR</span>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                {formatAmount(dailyRevenue)}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>tamamlanmış sifarişlər</div>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                            color: 'white',
                            padding: '2rem',
                            borderRadius: '20px',
                            textAlign: 'center',
                            boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <CreditCard size={24} />
                                <span style={{ fontSize: '0.9rem', opacity: 0.9 }}>GÜNLÜK BORC</span>
                            </div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                                {formatAmount(dailyDebt)}
                            </div>
                            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>gözləyən sifarişlər</div>
                        </div>



                        
                    </div>

                  

                    {/* Ödəniş Metodlarına Görə Bölgü */}
                    <div style={{ marginBottom: '3rem' }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <PieChart size={24} style={{ color: '#16a34a' }} />
                            Ödəniş Metodlarına Görə Bölgü
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '1.5rem'
                        }}>
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem auto',
                                    color: 'white',
                                    fontSize: '2rem',
                                    fontWeight: '700'
                                }}>
                                    <Banknote size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                                    Nağd Ödənişlər
                                </h3>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', marginBottom: '0.5rem' }}>
                                    {formatAmount(paymentMethodStats.cash)}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                    {completedOrders.filter(o => o.paymentMethod === 'cash').length} sifariş
                                </div>
                            </div>

                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem auto',
                                    color: 'white',
                                    fontSize: '2rem',
                                    fontWeight: '700'
                                }}>
                                    <CreditCard size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                                    Kartla Ödənişlər
                                </h3>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginBottom: '0.5rem' }}>
                                    {formatAmount(paymentMethodStats.card)}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                    {completedOrders.filter(o => o.paymentMethod === 'card').length} sifariş
                                </div>
                            </div>

                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                padding: '2rem',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
                                textAlign: 'center'
                            }}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1rem auto',
                                    color: 'white',
                                    fontSize: '2rem',
                                    fontWeight: '700'
                                }}>
                                    <CreditCard size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                                    Nəsiyə Ödənişlər
                                </h3>
                                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#f59e0b', marginBottom: '0.5rem' }}>
                                    {formatAmount(paymentMethodStats.credit)}
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                    {completedOrders.filter(o => o.paymentMethod === 'credit').length} sifariş
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Günlük Ödənişlər Siyahısı */}
                    <div>
                        <h2 style={{
                            fontSize: '1.8rem',
                            fontWeight: '700',
                            color: '#1f2937',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <Receipt size={24} style={{ color: '#16a34a' }} />
                            Günlük Ödənişlər
                        </h2>

                        {filteredOrders.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#6b7280',
                                background: 'white',
                                borderRadius: '16px',
                                border: '2px dashed #cbd5e1'
                            }}>
                                <Wallet size={64} style={{ marginBottom: '1rem', color: '#94a3b8' }} />
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#475569' }}>
                                    Ödəniş Yoxdur
                                </h3>
                                <p style={{ margin: 0, fontSize: '1.1rem' }}>
                                    {formatDate(selectedDate)} tarixində seçilmiş filtrlərə uyğun ödəniş yoxdur
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #e5e7eb',
                                overflow: 'hidden',
                                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                            }}>
                                <div style={{
                                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                                    padding: '1.5rem',
                                    borderBottom: '1px solid #e5e7eb'
                                }}>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                        gap: '1rem',
                                        fontSize: '0.9rem',
                                        fontWeight: '600',
                                        color: '#64748b'
                                    }}>
                                        <div>Sifariş ID</div>
                                        <div>Müştəri</div>
                                        <div>Bidon</div>
                                        <div>Məbləğ</div>
                                        <div>Ödəniş</div>
                                        <div>Status</div>
                                        <div>Tarix</div>
                                    </div>
                                </div>

                                {filteredOrders.map(order => {
                                    const customer = getCustomer(order.customerId);
                                    const orderAmount = order.bidonOrdered * (customer.pricePerBidon || 5);

                                    return (
                                        <div key={order.id} style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                                            gap: '1rem',
                                            padding: '1.5rem',
                                            borderBottom: '1px solid #f3f4f6',
                                            alignItems: 'center',
                                            fontSize: '0.9rem',
                                            background: order.completed ? '#f0fdf4' : '#fffbeb'
                                        }}>
                                            <div style={{ fontWeight: '600', color: '#374151' }}>
                                                #{order.id}
                                            </div>

                                            <div>
                                                <div style={{ fontWeight: '600', color: '#374151' }}>
                                                    {customer.firstName} {customer.lastName}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                                    {customer.phone}
                                                </div>
                                            </div>

                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontWeight: '600', color: '#374151' }}>
                                                    {order.bidonOrdered}
                                                </div>
                                                <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                                    bidon
                                                </div>
                                            </div>

                                            <div style={{ fontWeight: '700', color: '#16a34a', fontSize: '1.1rem' }}>
                                                {formatAmount(orderAmount)}
                                            </div>

                                            <div>
                                                <div style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    background: order.paymentMethod === 'cash' ? '#dbeafe' :
                                                        order.paymentMethod === 'card' ? '#d1fae5' : '#fef3c7',
                                                    color: order.paymentMethod === 'cash' ? '#1e40af' :
                                                        order.paymentMethod === 'card' ? '#065f46' : '#92400e',
                                                    border: `1px solid ${order.paymentMethod === 'cash' ? '#93c5fd' :
                                                        order.paymentMethod === 'card' ? '#a7f3d0' : '#fde68a'}`,
                                                    textAlign: 'center',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.25rem'
                                                }}>
                                                    {order.paymentMethod === 'cash' ? <Banknote size={12} /> :
                                                        order.paymentMethod === 'card' ? <CreditCard size={12} /> :
                                                            <CreditCard size={12} />}
                                                    {order.paymentMethod === 'cash' ? 'Nağd' :
                                                        order.paymentMethod === 'card' ? 'Kart' :
                                                            'Nəsiyə'}
                                                </div>
                                            </div>

                                            <div>
                                                <div style={{
                                                    padding: '0.25rem 0.75rem',
                                                    borderRadius: '20px',
                                                    fontSize: '0.8rem',
                                                    fontWeight: '600',
                                                    background: order.completed ? '#d1fae5' : '#fef3c7',
                                                    color: order.completed ? '#065f46' : '#92400e',
                                                    border: `1px solid ${order.completed ? '#a7f3d0' : '#fde68a'}`,
                                                    textAlign: 'center'
                                                }}>
                                                    {order.completed ? 'Ödənilib' : 'Gözləyir'}
                                                </div>
                                            </div>

                                            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                                                {order.completed ? formatTime(order.completedAt) : 'N/A'}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
