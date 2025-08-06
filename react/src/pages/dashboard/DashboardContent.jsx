import React from 'react';
import { useOrders } from '../../contexts/OrdersContext'; // düzgün path-ə diqqət et

export default function DashboardContent() {
  const { orders, customers } = useOrders();

  const completedOrders = orders.filter(o => o.completed);

  const getCustomer = (id) => customers.find(c => c.id === id);

  return (
    <div style={{ padding: 20 }}>
      <h1>Admin Dashboard - Günlük Proseslər</h1>

      {completedOrders.length === 0 ? (
        <p>Hələ tamamlanmış sifariş yoxdur.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Sifariş ID</th>
              <th>Müştəri</th>
              <th>Tarix</th>
              <th>Bidon Sifarişi</th>
              <th>Bidon Götürmə</th>
              <th>Qalıq</th>
              <th>Ödəniş Metodu</th>
            </tr>
          </thead>
          <tbody>
            {completedOrders.map(order => {
              const cust = getCustomer(order.customerId);
              return (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{cust.firstName} {cust.lastName}</td>
                  <td>{order.date}</td>
                  <td>{order.bidonOrdered}</td>
                  <td>{order.bidonTakenByCourier}</td>
                  <td>{order.bidonRemaining}</td>
                  <td>{order.paymentMethod}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
