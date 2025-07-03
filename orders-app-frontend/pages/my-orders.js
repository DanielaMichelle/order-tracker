import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getOrders, deleteOrder } from '@/services/api';

export default function MyOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
        try {
            const res = await getOrders();
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders', err);
        }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    await deleteOrder(id);
    fetchOrders();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold underline">My Orders</h1>
      
      {/* Orders Table */}
      <table 
        className="min-w-full mt-4 divide-y divide-gray-200 shadow-md rounded-lg overflow-hidden"
      >
        <thead className="bg-gray-100 text-left text-gray-600 uppercase text-sm">
          <tr>
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">Order #</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3"># Products</th>
            <th className="px-4 py-3">Final Price</th>
            <th className="px-4 py-3">Options</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{order.id}</td>
              <td className="px-4 py-2">{order.orderNumber}</td>
              <td className="px-4 py-2">{new Date(order.date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{order.numProducts}</td>
              <td className="px-4 py-2">S/. {order.finalPrice.toFixed(2)}</td>
              <td className="px-4 py-2 flex gap-2">
                <button 
                  onClick={() => router.push(`/add-order/${order.id}`)}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >Edit</button>
                <button 
                  onClick={() => handleDelete(order.id)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Order Button */}
      <button 
        onClick={() => router.push('/add-order/new')}
        className="mt-6 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-2 rounded shadow"
      >
        Add New Order
      </button>
    </div>
  );
}
