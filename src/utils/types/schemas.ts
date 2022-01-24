export interface Customer {
  customerId: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  orderId: string;
  customerId: string;
  item: string;
  quantity: number;
}
