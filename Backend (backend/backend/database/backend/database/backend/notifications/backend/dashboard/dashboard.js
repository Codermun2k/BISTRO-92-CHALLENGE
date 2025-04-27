const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', database: 'bistro92', password: 'your_password' });

exports.handler = async (event) => {
  const client = await pool.connect();
  try {
    const pendingOrders = await client.query(
      'SELECT o.order_id, t.table_number, o.status, o.order_time FROM Orders o JOIN Tables t ON o.table_id = t.table_id WHERE o.status IN ($1, $2)',
      ['pending', 'cooking']
    );

    const fulfillmentTime = await client.query(
      'SELECT AVG(EXTRACT(EPOCH FROM (completed_time - order_time))/60) AS avg_time FROM Orders WHERE status = $1 AND completed_time IS NOT NULL AND order_time >= NOW() - INTERVAL $2',
      ['completed', '1 hour']
    );

    const totalSales = await client.query(
      'SELECT SUM(total_amount) AS total FROM Orders WHERE order_time >= NOW() - INTERVAL $1',
      ['1 day']
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        pendingOrders: pendingOrders.rows,
        avgFulfillmentTime: fulfillmentTime.rows[0].avg_time,
        totalSales: totalSales.rows[0].total
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  } finally {
    client.release();
  }
};
