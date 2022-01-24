import { customersModel, ordersModel } from './schemas';
import { config } from '../config';
import mongoose from 'mongoose';
import mongoSantize from 'mongo-sanitize';
import { Order } from '../types';

// Connect to the MongoDB database
const connectionDetails = `mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbCluster}.mongodb.net/${config.dbDatabase}?retryWrites=true&w=majority`;
const connectionConfig = {};
mongoose.connect(connectionDetails, connectionConfig);

/**
 * The Customers table.
 */
class Customers {
  async doesCustomerExist(customerId: string): Promise<boolean> {
    const santizedCustomerId = mongoSantize(customerId);
    const matchedCustomers = await customersModel.find({ customerId: santizedCustomerId }, { customerId: 1 });

    return matchedCustomers.length > 0;
  }
}

/**
 * The Orders table.
 */
class Orders {
  private Customers: Customers;

  constructor(customers: Customers) {
    this.Customers = customers;
  }

  /**
   * Insert a single order in the Order table if the customer exists.
   *
   * @param {Order} order The order to insert.
   * @returns {Promise<void>}
   */
  async insertOrder(order: Order): Promise<void> {
    const { customerId } = order;
    const doesCustomerExist = await this.Customers.doesCustomerExist(customerId);

    if (!doesCustomerExist) {
      return;
    }

    const newOrder = new ordersModel(order);
    await newOrder.save();
  }

  /**
   * Insert multiple orders in the Order table if the customer exists.
   *
   * @param {Order[]} orders The orders to insert.
   * @returns {Promise<void>}
   */
  async insertOrders(orders: Order[]): Promise<void> {
    const uniqueCustomers = new Set(orders.map((order) => order.customerId));
    // Insert all the orders per customer since a customer might have purchased
    // multiple products.
    for (const customerId of uniqueCustomers) {
      const doesCustomerExist = await this.Customers.doesCustomerExist(customerId);

      // Don't insert an order if the customer doesn't exist.
      if (!doesCustomerExist) {
        continue;
      }

      // Get all the orders for the customer.
      const customerOrders = orders.filter((order) => order.customerId === customerId);
      const customerOrdersSantized = customerOrders.map(mongoSantize);
      const newOrders = customerOrdersSantized.map((order) => new ordersModel(order));

      await ordersModel.insertMany(newOrders);
    }
  }
}

/**
 * The MongoDB database wrapper.
 * Allowing the inserting of new orders.
 */
class MongoDB {
  public Customers: Customers;
  public Orders: Orders;

  constructor() {
    this.Customers = new Customers();
    this.Orders = new Orders(this.Customers);
  }
}

export default new MongoDB();
