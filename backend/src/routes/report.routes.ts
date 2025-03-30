import { Router } from 'express';
import {
  getDailyReports,
  getDailyReport,
  createDailyReport,
  getWeeklyReports,
  getWeeklyReport,
  createWeeklyReport,
  getMonthlyReports,
  getMonthlyReport,
  createMonthlyReport
} from '../controllers/report.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Daily reports
router.get('/daily', getDailyReports);
router.get('/daily/:id', getDailyReport);
router.post('/daily', authorize(['admin']), createDailyReport);

// Weekly reports
router.get('/weekly', getWeeklyReports);
router.get('/weekly/:id', getWeeklyReport);
router.post('/weekly', authorize(['admin']), createWeeklyReport);

// Monthly reports
router.get('/monthly', getMonthlyReports);
router.get('/monthly/:id', getMonthlyReport);
router.post('/monthly', authorize(['admin']), createMonthlyReport);

export default router;