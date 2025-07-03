import axios from "axios";

const API_BASE = 'http://localhost:3000/api';

// Órdenes
export const getOrders = () => axios.get(`${API_BASE}/orders`);
export const getOrderById = (id) => axios.get(`${API_BASE}/orders/${id}`);
export const createOrder = (data) => axios.post(`${API_BASE}/orders`, data);
export const updateOrder = (id, data) => axios.put(`${API_BASE}/orders/${id}`, data);
export const deleteOrder = (id) => axios.delete(`${API_BASE}/orders/${id}`);

// Productos
export const getProducts = () => axios.get(`${API_BASE}/products`);
export const addProductToOrder = (orderId, data) =>
  axios.post(`${API_BASE}/orders/${orderId}/products`, data);
export const updateOrderProduct = (orderId, productId, data) =>
  axios.put(`${API_BASE}/orders/${orderId}/products/${productId}`, data);
export const removeProductFromOrder = (orderId, productId) =>
  axios.delete(`${API_BASE}/orders/${orderId}/products/${productId}`);