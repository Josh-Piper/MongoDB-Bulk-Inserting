/**
 * The global configuration file. Containing the credentials
 * to access the MongoDB database.
 */
export interface GlobalConfiguration {
  dbUsername: string;
  dbPassword: string;
  dbCluster: string;
  dbDatabase: string;
}
