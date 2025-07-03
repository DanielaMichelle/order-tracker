import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  getOrderById,
  createOrder,
  updateOrder,
  getProducts,
} from '@/services/api';

export default function AddEditOrder() {
  const router = useRouter();  // Get the router object from Next.js to access route parameters

  const { id } = router.query; // Extract the 'id' from the route 

  const isNew = id === 'new'; // Check if the current form is for creating a new order

  const [orderNumber, setOrderNumber] = useState(''); // State to store the order number ("ORD-001")

  const [selectedProducts, setSelectedProducts] = useState([]); // List of products selected for this order

  const [allProducts, setAllProducts] = useState([]);  // All available products from the database

  const [loading, setLoading] = useState(true);  // Whether the page is still loading data

  const [showModal, setShowModal] = useState(false); // Whether the modal for adding/editing a product is open

  const [newProductId, setNewProductId] = useState(''); // Product ID selected in the modal

  const [newQty, setNewQty] = useState(1); // Quantity selected in the modal

  const [editingIndex, setEditingIndex] = useState(null);  // Index of the product being edited


  useEffect(() => {
    if (!router.isReady) return; // Wait until the router is ready
    loadAllProducts();  // Load all products from the API
    
    // If editing an existing order, load its data
    if (!isNew) {
      loadOrder(id);  
    } else {
      // If creating a new order, stop the loading state
      setLoading(false); 
    }
  }, [router.isReady, id]); // runs when the router or id changes



  // Fetch all products from the API
  const loadAllProducts = async () => {
    try {
      const res = await getProducts();
      setAllProducts(res.data);
    } catch (err) {
      console.error('Error loading products:', err);
    }
  };

  // Fetch a specific order by ID and load its data
  const loadOrder = async (orderId) => {
    try {
      const res = await getOrderById(orderId);
      setOrderNumber(res.data.orderNumber); // Set the order number
      setSelectedProducts(res.data.products); // Set the products in the order
    } catch (err) {
      console.error('Error loading order:', err);
    } finally {
      setLoading(false); // Stop loading state after fetching
    }
  };

  // Handle form submission for creating or updating an order
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the payload to send to the backend
    const payload = {
      orderNumber,
      products: selectedProducts.map(p => ({
        productId: p.productId,
        quantity: p.quantity,
      })),
    };

    try {
       // Create or update the order depending on the mode
      if (isNew) {
        await createOrder(payload);
      } else {
        await updateOrder(id, payload);
      }
      router.push('/my-orders'); // Redirect to the orders page after saving
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  // Add a new product to the order or edit an existing one
  const handleAddProduct = () => {
    // Get the selected product from the list
    const product = allProducts.find(p => p.id === parseInt(newProductId));

    if (editingIndex !== null) { // If editing a product, update it in the list
      const updated = [...selectedProducts];
      updated[editingIndex] = {
        productId: product.id,
        name: product.name,
        unitPrice: product.unitPrice,
        quantity: newQty,
      };
      setSelectedProducts(updated);
    } else { // If adding a new product
        // check if it already exists
        const alreadyAdded = selectedProducts.some(p => p.productId === product.id);
        if (alreadyAdded) {
          alert('This product is already in the order.');
          return;
        }

        // Add the new product to the list
        setSelectedProducts([
        ...selectedProducts,
        {
          productId: product.id,
          name: product.name,
          unitPrice: product.unitPrice,
          quantity: newQty,
        },
      ]);
    }

    // Reset modal form
    setShowModal(false);
    setNewProductId('');
    setNewQty(1);
  };

  // Remove a product from the selected list
  const handleDeleteProduct = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to remove this product?');
    if (!confirmDelete) return;

    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  // Load the selected product into the modal to edit it
  const handleEditProduct = (index) => {
    const p = selectedProducts[index];
    setNewProductId(p.productId.toString());
    setNewQty(p.quantity);
    setEditingIndex(index);
    setShowModal(true);
  };


  const totalItems = selectedProducts.length; // Calculate total number of products
  const finalPrice = selectedProducts.reduce((sum, p) => sum + p.quantity * p.unitPrice,0); // Calculate final price
  
  // If loading, show a loading message
  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 className="text-3xl font-bold underline">{isNew ? 'Add Order' : 'Edit Order'}</h1>

      {/* Order Form */}
      <form 
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        {/* Order Number */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Order #:
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        <br />

        {/* Date */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date:
          <input 
            type="text" 
            value={new Date().toLocaleDateString()} 
            disabled 
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        </label>
        <br />

        {/* Number of Products */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          # Products:
          <input 
            type="number" 
            value={totalItems}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        </label>
        <br />
        
        {/* Final Price */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Final Price:
          <input 
            type="text" 
            value={`S/. ${finalPrice.toFixed(2)}`} 
            disabled 
            className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-700"
          />
        </label>
        <br />

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition duration-200">
          {isNew ? 'Create Order' : 'Update Order'}
        </button>
      </form>

      <hr className="my-8 border-gray-300"/>

      {/* Products Table  */}
      <h2 className="text-xl font-semibold mb-4">Products in Order</h2>
      <table 
        className="min-w-full bg-white border border-gray-300 rounded-md shadow-sm"
      >
        <thead className="bg-gray-100 text-gray-700">
          <tr>
             <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Unit Price</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((p, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{p.name}</td>
              <td className="px-4 py-2">S/. {p.unitPrice}</td>
              <td className="px-4 py-2">{p.quantity}</td>
              <td className="px-4 py-2">S/. {(p.unitPrice * p.quantity).toFixed(2)}</td>
              <td className="px-4 py-2 flex gap-2">
                <button 
                  onClick={() => handleEditProduct(index)}
                  className="bg-blue-400 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >Edit</button>
                <button 
                  onClick={() => handleDeleteProduct(index)}
                  className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded text-sm"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add product Button */}
      <button 
        onClick={() => setShowModal(true)}
        className="mt-6 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-2 rounded shadow"
      >
        Add Product
      </button>

      {/* Modal to add products */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-80 p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Add Product</h3>

            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Product:
              </label>
              <select
                value={newProductId}
                onChange={(e) => setNewProductId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select...</option>
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - S/. {p.unitPrice}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Quantity:
              </label>
              <input
                type="number"
                min={1}
                value={newQty}
                onChange={(e) => setNewQty(parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={handleAddProduct}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );

  
}




