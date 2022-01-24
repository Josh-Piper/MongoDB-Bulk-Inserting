import MongoDB from './utils/mongodb-wrapper';
import { Order } from './utils/types';
import schedule from 'node-schedule';
import { request } from 'http';
import axios from 'axios';

const jobName = 'load csv files into data from google drive';

// Run every two seconds despite the date time.
const repeatJob = '*/2 * * * * *';

const doSomething = async () => {
  const url = 'https://drive.google.com/uc?id=1pm7Vi3vRg6b3TOfPS5yUGzzz3wZEJQEm';
  const response = await axios.get(url, { responseType: 'blob' });
  const file = response.data;

  console.log('file', file);

  // First download the file
  // Then read the file once it is on the local machine
  // This is really dangerous
  // But I couldn't find an alternative approach!

  // Could split the file by an amount of records.

  // Given a lot of records, it may choose to split the file and render it at different
  // parts of the day. Hence, adding future jobs.
};

// schedule.scheduleJob(jobName, repeatJob, async () => {
//   console.log('Hui');
// });

doSomething().then(() => console.log('Done.'));

// const doIt = async () => {
//   const newOrder: Order = { customerId: '123', orderId: '123', item: '123', quantity: 123 };
//   MongoDB.Orders.insertOrder(newOrder);

// };

// Using a callback. Depends on how this will be launched. As a job etc.

// doIt().then(() => console.log('Finished'));

// Get CSV file from url

// Import into MongoDB database

// Ensure customerId exists in the database otherwise skip import

// To scale. Load more jobs via an express server. Sorta like adding webhooks.
// Better query to load.
// Scale horizontally? For different types of jobs

// Might be best to sort by each unique customerId.
// Allow for bulk actions to occur?
// Via insertmany if multiple otherwuise insertOne

// dbn.Orders.find({ customerId: x }, { customerId: 1, _id: 0 })
// if array is not length 0. Then continue.

// Orders and Customers
