import dotenv from 'dotenv';
import path from 'path';

// Load the .env file that contains encrypted credentials. Decrypt as required.
dotenv.config({ path: path.resolve(__dirname, '../../credentials.env') });

export const config = {
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbCluster: process.env.DB_CLUSTER,
  dbDatabase: process.env.DB_DATABASE,
};
