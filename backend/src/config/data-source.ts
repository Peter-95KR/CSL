import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { DailyReport } from '../models/daily-report.model';
import { WeeklyReport } from '../models/weekly-report.model';
import { MonthlyReport } from '../models/monthly-report.model';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'csl_dashboard',
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [User, DailyReport, WeeklyReport, MonthlyReport],
  migrations: [__dirname + '/../migrations/**/*.ts'],
  subscribers: [],
});