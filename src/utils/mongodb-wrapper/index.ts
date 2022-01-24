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
    const bulkInsertOrders = [];

    console.log(uniqueCustomers);
    for (const customerId of uniqueCustomers) {
      const doesCustomerExist = await this.Customers.doesCustomerExist(customerId);

      // If the customer doesn't exist, then don't insert the order.
      if (!doesCustomerExist) {
        continue;
      }

      // Get the customers order details
      const customerOrders = orders.filter((order) => order.customerId === customerId);
      const sanitizedCustomerOrders = customerOrders.map(mongoSantize);

      // Add the orders to the bulk insert array.
      if (sanitizedCustomerOrders.length === 1) {
        bulkInsertOrders.push({
          insertOne: {
            document: sanitizedCustomerOrders[0],
          },
        });
      } else {
        bulkInsertOrders.push({
          insertMany: {
            documents: sanitizedCustomerOrders,
          },
        });
      }
    }

    // Insert all the documents as a bulk update to prevent
    // using too many connections. Moreover, databases are
    // optimised for this.
    const res = await ordersModel.bulkWrite(bulkInsertOrders);
    console.log('res', res);
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
