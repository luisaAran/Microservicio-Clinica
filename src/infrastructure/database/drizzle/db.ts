import { drizzle } from "drizzle-orm/mysql2";
import { MySql2Database } from "drizzle-orm/mysql2";
export const db: MySql2Database = drizzle(process.env.DATABASE_URL!);
