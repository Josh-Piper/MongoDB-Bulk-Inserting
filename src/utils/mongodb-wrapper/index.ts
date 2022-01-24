import { customersModel, ordersModel } from './schemas';
import { config } from '../config';
import mongoose from 'mongoose';
import mongoSantize from 'mongo-sanitize';
import { Order } from '../types';
import logger from '../logger';

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
   * Insert multiple orders in the Order table if the customer exists.
   *
   * @param {Order[]} orders The orders to insert.
   * @returns {Promise<void>}
   */
  async insertOrders(orders: Order[]): Promise<void> {
    const uniqueCustomers = new Set(orders.map((order) => order.customerId));
    const bulkInsertOrders = [];

    for (const customerId of uniqueCustomers) {
      const doesCustomerExist = await this.Customers.doesCustomerExist(customerId);

      // If the customer doesn't exist, then don't insert the order.
      if (!doesCustomerExist) {
        logger.info('Customer %s does not exist, skipping order', customerId);
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
    await ordersModel.bulkWrite(bulkInsertOrders);
    logger.info('Finished bulk update');
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
