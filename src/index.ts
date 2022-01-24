/**
 * Sync MongoDB orders database with a stored CSV file on Google drive.
 */
import schedule from 'node-schedule';
import { fork } from 'child_process';
import MongoDB from './utils/mongodb-wrapper';
import { getCSVOrdersFromUrl } from './utils/helpers/orders';

const url = 'https://drive.google.com/uc?id=1pm7Vi3vRg6b3TOfPS5yUGzzz3wZEJQEm';

// Use the following https://crontab.guru/every-day-at-1am to generate
// the wanted intervals.
const repeatJobDailyAt1Am = '0 1 * * *';

schedule.scheduleJob('Sync Orders', repeatJobDailyAt1Am, async (): Promise<void> => {
  const orders = await getCSVOrdersFromUrl(url);
  const numberOfProcesses = Math.ceil(orders.length / 500);

  for (let i = 0; i < numberOfProcesses; i++) {
    const worker = fork('./insertOrders', [], { cwd: __dirname });

    // Get the orders for the current worker.
    const startingIdx = i === 0 ? 0 : i * 500;
    const endingIdx = i === 0 ? 500 : (i + 1) * 500;

    worker.send(orders.slice(startingIdx, endingIdx));
  }
});

getCSVOrdersFromUrl(url).then((orders) => {
  // Each process will handle 500 orders.
  const numberOfProcesses = Math.ceil(orders.length / 500);

  for (let i = 0; i < numberOfProcesses; i++) {
    const worker = fork('./insertOrders', [], { cwd: __dirname });

    // Get the orders for the current worker.
    const startingIdx = i === 0 ? 0 : i * 500;
    const endingIdx = i === 0 ? 500 : (i + 1) * 500;

    worker.send(orders.slice(startingIdx, endingIdx));
  }
});

// Since the job is schedule for 1am, we can assume that we have time to
// sync a large file. However, if we are dealing with a significant amount,
// then we might also conduct smaller syncs throughout the day or horizontally
// scale the application.
