import { drizzle } from 'drizzle-orm/mysql2';
import type { MySql2Database } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const {
	DB_HOST = 'localhost',
	DB_PORT = '3306',
	DB_USER = 'root',
	DB_PASSWORD = '',
	DB_NAME = 'clinic_db',
} = process.env;

const pool = mysql.createPool({
	host: DB_HOST,
	port: Number(DB_PORT),
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
});

export const db: MySql2Database = drizzle(pool);
