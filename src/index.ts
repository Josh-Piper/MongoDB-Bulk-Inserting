/**
 * Sync MongoDB orders database with a stored CSV file on Google drive.
 */
import MongoDB from './utils/mongodb-wrapper';
import schedule from 'node-schedule';
import { getCSVOrdersFromUrl } from './utils/helpers/orders';

const url = 'https://drive.google.com/uc?id=1pm7Vi3vRg6b3TOfPS5yUGzzz3wZEJQEm';

// Use the following https://crontab.guru/every-day-at-1am to generate
// the wanted intervals.
const repeatJobDailyAt1Am = '0 1 * * *';

schedule.scheduleJob('Sync Orders', repeatJobDailyAt1Am, async () => {
  const orders = await getCSVOrdersFromUrl(url);

  // Since the job is schedule for 1am, we can assume that we have time to
  // sync a large file. However, if we are dealing with a significant amount,
  // then we might also conduct smaller syncs throughout the day or horizontally
  // scale the application.
  MongoDB.Orders.insertOrders(orders);
});
