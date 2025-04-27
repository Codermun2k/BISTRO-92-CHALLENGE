import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const GET_DASHBOARD = gql`
  subscription {
    dashboard {
      pendingOrders {
        order_id
        table_number
        status
        order_time
      }
      avgFulfillmentTime
      totalSales
    }
  }
`;

function App() {
  const { data, loading } = useQuery(GET_DASHBOARD);
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    if (data) {
      setSalesData({
        labels: ['Today'],
        datasets: [{ label: 'Sales', data: [data.dashboard.totalSales], backgroundColor: 'rgba(75,192,192,0.4)' }]
      });
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1>Bistro 92 Dashboard</h1>
      <div>
        <h2>Pending Orders</h2>
        <table className="table-auto">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Table</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.dashboard.pendingOrders.map(order => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.table_number}</td>
                <td>{order.status}</td>
                <td>{new Date(order.order_time).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <h2>Average Fulfillment Time: {data.dashboard.avgFulfillmentTime} mins</h2>
      </div>
      <div>
        <h2>Total Sales</h2>
        <Line data={salesData} />
      </div>
    </div>
  );
}

export default App;
