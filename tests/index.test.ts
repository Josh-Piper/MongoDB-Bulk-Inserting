import { expect } from 'chai';
import { convertCSVOrdersToMongoOrders, getOrderFromCSVLine } from '../src/utils/helpers/orders';
import { Order } from '../src/utils/types';

describe('Transforming Orders', () => {
  it('Get Order From CSV Line', () => {
    const actualOrder = getOrderFromCSVLine('abc123,1a2b,Macintosh Laptop,1');

    const expectedOrder: Order = {
      orderId: 'abc123',
      customerId: '1a2b',
      item: 'Macintosh Laptop',
      quantity: 1,
    };

    expect(actualOrder).to.deep.equal(expectedOrder);
  });

  it('Converting multiline CSV to Orders', () => {
    const actualOrders = convertCSVOrdersToMongoOrders([
      'orderId,customerId,item,quantity',
      'abc123,1a2b,Macintosh Laptop,1',
      'def456,1a2b,iPad Mini,2',
      'ghi789,1a3b,Roses,20',
    ]);

    const expectedOrders: Order[] = [
      {
        orderId: 'abc123',
        customerId: '1a2b',
        item: 'Macintosh Laptop',
        quantity: 1,
      },
      {
        orderId: 'def456',
        customerId: '1a2b',
        item: 'iPad Mini',
        quantity: 2,
      },
      {
        orderId: 'ghi789',
        customerId: '1a3b',
        item: 'Roses',
        quantity: 20,
      },
    ];

    expect(actualOrders).to.deep.equal(expectedOrders);
  });
});
