import axios from 'axios';
import { Order } from '../../types';

/**
 * Get an 'Order' from a CSV string.
 *
 * @param {string} csvLine An individual line from the CSV file.
 * @returns {Order | null} The order if it is valid, otherwise null.
 */
export const getOrderFromCSVLine = (csvLine: string): Order | null => {
  const [orderId, customerId, item, quantity] = csvLine.split(',');

  // Ensure that each column exists.
  if (!orderId || !customerId || !item || !quantity) {
    return null;
  }

  return {
    customerId,
    orderId,
    item,
    quantity: Number(quantity),
  };
};

/**
 * Convert a CSV file to an array of orders.
 *
 * @param {string[]} csvOrders All the lines of the CSV file.
 * @returns {Order[]} The orders to input into the database from the CSV file.
 */
export const convertCSVOrdersToMongoOrders = (csvOrders: string[]): Order[] => {
  if (csvOrders.length === 0) {
    return [];
  }

  // If the headers are included, then don't include them.
  if (csvOrders[0] === 'orderId,customerId,item,quantity') {
    csvOrders.shift();
  }

  // Get all valid orders
  const orders = csvOrders.map(getOrderFromCSVLine);
  const validOrders = orders.filter((order) => order !== null) as Order[];

  return validOrders;
};

/**
 * Get all the orders from a CSV file located online.
 * Assumes that the CSV file is in the format: orderId,customerId,item,quantity
 *
 * @param {string} url The URL of the CSV file.
 * @returns {Promise<Order[]>} The orders to input into the database from the CSV file.
 */
export const getCSVOrdersFromUrl = async (url: string): Promise<Order[]> => {
  const response = await axios.get<string>(url, { responseType: 'blob' });
  const allOrdersCSV = response.data.split('\n');

  return convertCSVOrdersToMongoOrders(allOrdersCSV);
};
