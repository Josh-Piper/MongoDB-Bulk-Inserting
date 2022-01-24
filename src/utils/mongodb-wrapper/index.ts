import { customersModel, ordersModel } from './schemas';
import { config } from '../config';
import mongoose from 'mongoose';
import { Order } from '../types';

// Connect to the MongoDB database
const connectionDetails = `mongodb+srv://${config.dbUsername}:${config.dbPassword}@${config.dbCluster}.mongodb.net/${config.dbDatabase}?retryWrites=true&w=majority`;
const connectionConfig = {};
mongoose.connect(connectionDetails, connectionConfig);

/**
 *
 */
class Customers {
  async doesCustomerExist(customerId: string): Promise<boolean> {
    const matchedCustomers = await customersModel.find({ customerId }, { customerId: 1 });

    return matchedCustomers.length > 0;
  }
}

/**
 *
 */
class Orders {
  private Customers: Customers;

  constructor(customers: Customers) {
    this.Customers = customers;
  }

  async insertOrder(order: Order) {
    const { customerId } = order;
    const doesCustomerExist = await this.Customers.doesCustomerExist(customerId);

    if (!doesCustomerExist) {
      return;
    }

    const newOrder = new ordersModel(order);
    await newOrder.save();
  }

  async insertOrders(orders: Order[]) {
    const ordersToInsert = orders.filter((order) => {
      const { customerId } = order;
      return this.Customers.doesCustomerExist(customerId);
    });

    const newOrders = ordersToInsert.map((order) => new ordersModel(order));

    await ordersModel.insertMany(newOrders);
  }
}

/**
 *
 */
class MongoDB {
  private Customers: Customers;
  public Orders: Orders;

  constructor() {
    this.Customers = new Customers();
    this.Orders = new Orders(this.Customers);
  }
}

export default new MongoDB();
