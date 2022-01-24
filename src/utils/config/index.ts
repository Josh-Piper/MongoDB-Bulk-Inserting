import dotenv from 'dotenv';
import path from 'path';
import { GlobalConfiguration } from '../types';

// Load the .env file that contains encrypted credentials. Decrypt as required.
dotenv.config({ path: path.resolve(__dirname, '../../credentials.env') });

/**
 * Global configuration file storing the database credentials.
 */
export const config: GlobalConfiguration = {
  dbUsername: process.env.DB_USERNAME ?? '',
  dbPassword: process.env.DB_PASSWORD ?? '',
  dbCluster: process.env.DB_CLUSTER ?? '',
  dbDatabase: process.env.DB_DATABASE ?? '',
  loggingLevel: Number(process.env.LOGGING_LEVEL) ?? 0,
};
