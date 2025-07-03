const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el proceso de seed...');
  
  const products = await prisma.product.createMany({
    data: [
      { name: 'Laptop Lenovo', unitPrice: 2500.00 },
      { name: 'Mouse Inalámbrico', unitPrice: 80.00 },
      { name: 'Teclado Mecánico', unitPrice: 150.00 },
      { name: 'Monitor LG 24"', unitPrice: 800.00 },
      { name: 'Headset Gamer', unitPrice: 220.00 },
      { name: 'Base Enfriadora', unitPrice: 100.00 },
    ],
  });

  const allProducts = await prisma.product.findMany();

  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-001',
      orderItems: {
        create: [
          { productId: allProducts[0].id, quantity: 1 }, // Laptop
          { productId: allProducts[1].id, quantity: 2 }, // Mouse
          { productId: allProducts[2].id, quantity: 1 }, // Teclado
        ],
      },
    },
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-002',
      orderItems: {
        create: [
          { productId: allProducts[3].id, quantity: 1 }, // Monitor
          { productId: allProducts[4].id, quantity: 1 }, // Headset
          { productId: allProducts[5].id, quantity: 1 }, // Enfriadora
        ],
      },
    },
  });

  console.log('Productos y órdenes de ejemplo insertados correctamente.');
}

main()
  .catch(e => {
    console.error('Error al hacer seed:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
