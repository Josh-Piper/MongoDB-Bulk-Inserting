import mongodbWrapper from './utils/mongodb-wrapper';
import { Order } from './utils/types';

process.on('message', async (orders: Order[]): Promise<void> => {
  console.log('Child process started with orders:', orders.length);

  await mongodbWrapper.Orders.insertOrders(orders);

  console.log('Child process completed update');
});
