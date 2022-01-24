import mongoose from 'mongoose';

const ordersSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const ordersModel = mongoose.model('Order', ordersSchema);

export { ordersModel };
