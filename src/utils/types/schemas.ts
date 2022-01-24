/**
 * The shape of a customer in the customers table.
 */
export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
}

/**
 * The shape of an order in the orders table.
 */
export interface Order {
  orderId: string;
  customerId: string;
  item: string;
  quantity: number;
}
