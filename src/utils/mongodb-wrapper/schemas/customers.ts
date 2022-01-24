import mongoose, { Schema } from 'mongoose';

const customersSchema = new Schema({
  customerId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
});

const customersModel = mongoose.model('Customer', customersSchema);

export { customersModel };
