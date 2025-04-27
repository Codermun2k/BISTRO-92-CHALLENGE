import React, { useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function App() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('newOrder', (order) => {
      setOrders([...orders, order]);
    });
    return () => socket.off('newOrder');
  }, [orders]);

  return (
    <div className="p-4">
      <h1>Kitchen Display</h1>
      {orders.map((order, index) => (
        <div key={index} className="border p-2 mb-2">
          <p>Table: {order.table_number}</p>
          <p>Items: {order.items.map(item => `${item.item_name} x${item.quantity}`).join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
