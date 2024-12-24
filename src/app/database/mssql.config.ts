import { IConnectionConfigSqlServer } from '../interfaces/tube-server-manager.interface';
import sql, { pool } from 'mssql';
import { loadNodeEnvironment } from '../utils/dotenv.config';

loadNodeEnvironment();

//@ts-ignore
const sqlServerConnectionString: IConnectionConfigSqlServer = {
  user: process.env.SQLSERVER_USER ?? "",
  password: process.env.SQLSERVER_PASSWORD ?? "",
  database: process.env.SQLSERVER_DATABASE ?? "",
  server: process.env.SQLSERVER_SERVER ?? "",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: Number(process.env.SQLSERVER_TIMEOUT),
  },
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === "true",
    trustServerCertificate: !(process.env.SQLSERVER_TRUST === "false"),
  },
};

export const initSqlServerConnection = async () => {
  try {
    const pool = new sql.ConnectionPool(`${process.env.SQLSERVER_USER_CONNECTION_STRING}`);
    await pool.connect();
    return pool;
  } catch (error) {
    throw error;
  } finally {
    if (pool)
      pool.close();
  }
};

