import React, { useState, useMemo } from 'react';
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
    Wallet,
    ChevronDown,
    Eye,
    Clock
} from 'lucide-react';

export default function Payments() {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedCustomer, setSelectedCustomer] = useState('all');
    const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Test məlumatları
    const customers = [
        { id: 1, firstName: 'Əli', lastName: 'Məmmədov', phone: '+994501234567', pricePerBidon: 5 },
        { id: 2, firstName: 'Leyla', lastName: 'Həsənova', phone: '+994551234567', pricePerBidon: 4.5 },
        { id: 3, firstName: 'Rəşad', lastName: 'Əliyev', phone: '+994701234567', pricePerBidon: 5.5 }
    ];

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
        }
    ];

    // Seçilmiş tarixə görə sifarişləri filtrlə
    const dailyOrders = useMemo(() => {
        return testOrders.filter(order => order.date === selectedDate);
    }, [selectedDate]);

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
            day: 'numeric',
            month: 'short',
            year: 'numeric'
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
        return `${amount}₼`;
    };

    // Debug: Component rendering check
    console.log('Payments component rendering', { selectedDate, filteredOrders, dailyRevenue, dailyDebt });

    // Inline CSS styles for fallback
    const styles = {
        container: {
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            fontFamily: 'Inter, system-ui, sans-serif'
        },
        header: {
            background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
            color: 'white',
            padding: '24px 16px',
            position: 'relative',
            overflow: 'hidden'
        },
        headerContent: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px',
            position: 'relative',
            zIndex: 10
        },
        headerIcon: {
            width: '48px',
            height: '48px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)'
        },
        headerTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            margin: 0
        },
        headerSubtitle: {
            color: '#bbf7d0',
            fontSize: '14px',
            margin: 0
        },
        filterButton: {
            width: '100%',
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            borderRadius: '12px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: 'white',
            fontWeight: '500',
            border: 'none',
            cursor: 'pointer'
        },
        filtersContainer: {
            marginTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            position: 'relative',
            zIndex: 10
        },
        input: {
            width: '100%',
            padding: '12px 16px',
            background: 'white',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500'
        },
        select: {
            width: '100%',
            padding: '12px 16px',
            background: 'white',
            borderRadius: '12px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500'
        },
        content: {
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
        },
        statsGrid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px'
        },
        statCard: {
            padding: '16px',
            borderRadius: '16px',
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        statCardGreen: {
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
        },
        statCardRed: {
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        },
        statIcon: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '8px'
        },
        statLabel: {
            fontSize: '14px',
            opacity: 0.9,
            marginBottom: '4px'
        },
        statValue: {
            fontSize: '24px',
            fontWeight: 'bold'
        },
        section: {
            background: 'white',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        },
        sectionTitle: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        },
        paymentMethodItem: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px',
            borderRadius: '12px',
            marginBottom: '12px'
        },
        paymentMethodIcon: {
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
        },
        paymentMethodInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
        },
        paymentMethodName: {
            fontWeight: '600',
            color: '#1f2937'
        },
        paymentMethodCount: {
            fontSize: '14px',
            color: '#6b7280'
        },
        paymentMethodAmount: {
            fontSize: '20px',
            fontWeight: 'bold'
        },
        orderItem: {
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '12px',
            borderLeft: '4px solid'
        },
        orderItemCompleted: {
            background: '#f0fdf4',
            borderLeftColor: '#22c55e'
        },
        orderItemPending: {
            background: '#fefce8',
            borderLeftColor: '#eab308'
        },
        orderHeader: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '8px'
        },
        orderCustomer: {
            fontWeight: '600',
            color: '#1f2937'
        },
        orderId: {
            fontSize: '14px',
            color: '#6b7280'
        },
        orderAmount: {
            textAlign: 'right'
        },
        orderAmountValue: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#16a34a'
        },
        orderBidonCount: {
            fontSize: '14px',
            color: '#6b7280'
        },
        orderFooter: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        orderTags: {
            display: 'flex',
            gap: '8px'
        },
        tag: {
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '500'
        },
        tagCash: {
            background: '#dbeafe',
            color: '#1e40af'
        },
        tagCard: {
            background: '#dcfce7',
            color: '#166534'
        },
        tagCredit: {
            background: '#fef3c7',
            color: '#92400e'
        },
        tagCompleted: {
            background: '#dcfce7',
            color: '#166534'
        },
        tagPending: {
            background: '#fef3c7',
            color: '#92400e'
        },
        orderTime: {
            fontSize: '12px',
            color: '#9ca3af'
        },
        exportButton: {
            width: '100%',
            background: 'linear-gradient(90deg, #16a34a 0%, #15803d 100%)',
            color: 'white',
            padding: '16px',
            borderRadius: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
        },
        emptyState: {
            textAlign: 'center',
            padding: '32px 16px',
            color: '#6b7280'
        },
        emptyIcon: {
            margin: '0 auto 12px',
            opacity: 0.5
        },
        emptyTitle: {
            fontWeight: '500',
            marginBottom: '4px'
        },
        emptySubtitle: {
            fontSize: '14px'
        }
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerContent}>
                    <div style={styles.headerIcon}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <h1 style={styles.headerTitle}>Ödənişlər</h1>
                        <p style={styles.headerSubtitle}>{formatDate(selectedDate)}</p>
                    </div>
                </div>

                {/* Filter Toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    style={styles.filterButton}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Filter size={18} />
                        Filtrlər
                    </div>
                    <ChevronDown 
                        size={20} 
                        style={{ 
                            transform: showFilters ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                        }} 
                    />
                </button>

                {/* Filters */}
                {showFilters && (
                    <div style={styles.filtersContainer}>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={styles.input}
                        />

                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            style={styles.select}
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
                            style={styles.select}
                        >
                            <option value="all">Bütün Ödənişlər</option>
                            <option value="cash">Nağd</option>
                            <option value="card">Kart</option>
                            <option value="credit">Nəsiyə</option>
                        </select>
                    </div>
                )}
            </div>

            <div style={styles.content}>
                {/* Günlük Statistika */}
                <div style={styles.statsGrid}>
                    <div style={{ ...styles.statCard, ...styles.statCardGreen }}>
                        <div style={styles.statIcon}>
                            <TrendingUp size={20} />
                        </div>
                        <div style={styles.statLabel}>Günlük Gəlir</div>
                        <div style={styles.statValue}>{formatAmount(dailyRevenue)}</div>
                    </div>

                    <div style={{ ...styles.statCard, ...styles.statCardRed }}>
                        <div style={styles.statIcon}>
                            <Clock size={20} />
                        </div>
                        <div style={styles.statLabel}>Gözləyən</div>
                        <div style={styles.statValue}>{formatAmount(dailyDebt)}</div>
                    </div>
                </div>

                {/* Ödəniş Metodları */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        <PieChart size={20} style={{ color: '#16a34a' }} />
                        Ödəniş Metodları
                    </h3>
                    
                    <div>
                        <div style={{ ...styles.paymentMethodItem, background: '#eff6ff' }}>
                            <div style={styles.paymentMethodInfo}>
                                <div style={{ ...styles.paymentMethodIcon, background: '#3b82f6' }}>
                                    <Banknote size={18} />
                                </div>
                                <div>
                                    <div style={styles.paymentMethodName}>Nağd</div>
                                    <div style={styles.paymentMethodCount}>
                                        {completedOrders.filter(o => o.paymentMethod === 'cash').length} sifariş
                                    </div>
                                </div>
                            </div>
                            <div style={{ ...styles.paymentMethodAmount, color: '#2563eb' }}>
                                {formatAmount(paymentMethodStats.cash)}
                            </div>
                        </div>

                        <div style={{ ...styles.paymentMethodItem, background: '#f0fdf4' }}>
                            <div style={styles.paymentMethodInfo}>
                                <div style={{ ...styles.paymentMethodIcon, background: '#22c55e' }}>
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <div style={styles.paymentMethodName}>Kart</div>
                                    <div style={styles.paymentMethodCount}>
                                        {completedOrders.filter(o => o.paymentMethod === 'card').length} sifariş
                                    </div>
                                </div>
                            </div>
                            <div style={{ ...styles.paymentMethodAmount, color: '#16a34a' }}>
                                {formatAmount(paymentMethodStats.card)}
                            </div>
                        </div>

                        <div style={{ ...styles.paymentMethodItem, background: '#fefce8' }}>
                            <div style={styles.paymentMethodInfo}>
                                <div style={{ ...styles.paymentMethodIcon, background: '#eab308' }}>
                                    <CreditCard size={18} />
                                </div>
                                <div>
                                    <div style={styles.paymentMethodName}>Nəsiyə</div>
                                    <div style={styles.paymentMethodCount}>
                                        {completedOrders.filter(o => o.paymentMethod === 'credit').length} sifariş
                                    </div>
                                </div>
                            </div>
                            <div style={{ ...styles.paymentMethodAmount, color: '#ca8a04' }}>
                                {formatAmount(paymentMethodStats.credit)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ödənişlər Siyahısı */}
                <div style={styles.section}>
                    <h3 style={styles.sectionTitle}>
                        <Receipt size={20} style={{ color: '#16a34a' }} />
                        Günlük Ödənişlər ({filteredOrders.length})
                    </h3>

                    {filteredOrders.length === 0 ? (
                        <div style={styles.emptyState}>
                            <Wallet size={48} style={styles.emptyIcon} />
                            <p style={styles.emptyTitle}>Ödəniş tapılmadı</p>
                            <p style={styles.emptySubtitle}>Bu tarix və filtr üçün məlumat yoxdur</p>
                        </div>
                    ) : (
                        <div>
                            {filteredOrders.map(order => {
                                const customer = getCustomer(order.customerId);
                                const orderAmount = order.bidonOrdered * (customer.pricePerBidon || 5);

                                return (
                                    <div 
                                        key={order.id} 
                                        style={{
                                            ...styles.orderItem,
                                            ...(order.completed ? styles.orderItemCompleted : styles.orderItemPending)
                                        }}
                                    >
                                        <div style={styles.orderHeader}>
                                            <div>
                                                <div style={styles.orderCustomer}>
                                                    {customer.firstName} {customer.lastName}
                                                </div>
                                                <div style={styles.orderId}>
                                                    Sifariş #{order.id}
                                                </div>
                                            </div>
                                            <div style={styles.orderAmount}>
                                                <div style={styles.orderAmountValue}>
                                                    {formatAmount(orderAmount)}
                                                </div>
                                                <div style={styles.orderBidonCount}>
                                                    {order.bidonOrdered} bidon
                                                </div>
                                            </div>
                                        </div>

                                        <div style={styles.orderFooter}>
                                            <div style={styles.orderTags}>
                                                <span style={{
                                                    ...styles.tag,
                                                    ...(order.paymentMethod === 'cash' ? styles.tagCash : 
                                                         order.paymentMethod === 'card' ? styles.tagCard : styles.tagCredit)
                                                }}>
                                                    {order.paymentMethod === 'cash' ? 'Nağd' : 
                                                     order.paymentMethod === 'card' ? 'Kart' : 'Nəsiyə'}
                                                </span>
                                                
                                                <span style={{
                                                    ...styles.tag,
                                                    ...(order.completed ? styles.tagCompleted : styles.tagPending)
                                                }}>
                                                    {order.completed ? 'Ödənilib' : 'Gözləyir'}
                                                </span>
                                            </div>
                                            
                                            <div style={styles.orderTime}>
                                                {order.completed ? formatTime(order.completedAt) : 'Gözləyir'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Export Button */}
                <button style={styles.exportButton}>
                    <Download size={20} />
                    Hesabat Yüklə
                </button>
            </div>
        </div>
    );
}