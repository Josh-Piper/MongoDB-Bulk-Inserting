import schedule from 'node-schedule';
import axios from 'axios';

const jobName = 'load csv files into data from google drive';

// Run every two seconds despite the date time.
const repeatJob = '*/2 * * * * *';

const doSomething = async () => {
  const data = await axios.get('https://drive.google.com/file/d/1gqodjXbk-hEWRQxQniNHfbYf9xDGE1eY/view?usp=sharing');
  console.log('data', data);
};

schedule.scheduleJob(jobName, repeatJob, async () => {
  console.log('Hui');
});
