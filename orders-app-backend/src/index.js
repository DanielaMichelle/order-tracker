const { PrismaClient } = require('@prisma/client');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

// GET /api/products
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// GET /api/orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: { include: { product: true } },
      },
    });

    const response = orders.map(order => {
      const finalPrice = order.orderItems.reduce((sum, item) => (
        sum + item.product.unitPrice * item.quantity
      ), 0);

      return {
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.date,
        numProducts: order.orderItems.length,
        finalPrice,
      };
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });

    const products = order.orderItems.map(item => ({
      productId: item.productId,
      name: item.product.name,
      unitPrice: item.product.unitPrice,
      quantity: item.quantity,
      totalPrice: item.quantity * item.product.unitPrice,
    }));

    const totalItems = products.length;
    const finalPrice = products.reduce((sum, p) => sum + p.totalPrice, 0);

    res.json({
      id: order.id,
      orderNumber: order.orderNumber,
      date: order.date,
      totalItems,
      finalPrice,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});

// POST /api/orders
app.post('/api/orders', async (req, res) => {
  const { orderNumber, products } = req.body;

  try {
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        orderItems: {
          create: products.map(p => ({
            productId: p.productId,
            quantity: p.quantity,
          })),
        },
      },
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

// PUT /api/orders/:id
app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { orderNumber, products } = req.body;

  try {
    await prisma.order.update({
      where: { id: parseInt(id) },
      data: { orderNumber },
    });

    // Delete existing order items
    await prisma.orderItem.deleteMany({ where: { orderId: parseInt(id) } });

    // Insert new order items
    await prisma.orderItem.createMany({
      data: products.map(p => ({
        orderId: parseInt(id),
        productId: p.productId,
        quantity: p.quantity,
      })),
    });

    res.json({ message: 'Orden actualizada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar la orden' });
  }
});


// DELETE /api/orders/:id
app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.orderItem.deleteMany({ where: { orderId: parseInt(id) } });
    await prisma.order.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});