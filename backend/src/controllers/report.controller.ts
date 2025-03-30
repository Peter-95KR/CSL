import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/data-source';
import { DailyReport } from '../models/daily-report.model';
import { WeeklyReport } from '../models/weekly-report.model';
import { MonthlyReport } from '../models/monthly-report.model';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';

const dailyReportRepository = AppDataSource.getRepository(DailyReport);
const weeklyReportRepository = AppDataSource.getRepository(WeeklyReport);
const monthlyReportRepository = AppDataSource.getRepository(MonthlyReport);

// Daily Reports
export const getDailyReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = {};
    
    if (startDate && endDate) {
      whereClause = {
        date: Between(new Date(startDate as string), new Date(endDate as string))
      };
    } else if (startDate) {
      whereClause = {
        date: MoreThanOrEqual(new Date(startDate as string))
      };
    } else if (endDate) {
      whereClause = {
        date: LessThanOrEqual(new Date(endDate as string))
      };
    }

    const reports = await dailyReportRepository.find({
      where: whereClause,
      order: { date: 'DESC' }
    });

    return res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
};

export const getDailyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const report = await dailyReportRepository.findOne({ where: { id } });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    return res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};

export const createDailyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reportData = req.body;
    
    const report = dailyReportRepository.create(reportData);
    await dailyReportRepository.save(report);
    
    return res.status(201).json({ 
      message: 'Daily report created successfully',
      report 
    });
  } catch (error) {
    next(error);
  }
};

// Weekly Reports
export const getWeeklyReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = {};
    
    if (startDate && endDate) {
      whereClause = {
        startDate: MoreThanOrEqual(new Date(startDate as string)),
        endDate: LessThanOrEqual(new Date(endDate as string))
      };
    } else if (startDate) {
      whereClause = {
        startDate: MoreThanOrEqual(new Date(startDate as string))
      };
    } else if (endDate) {
      whereClause = {
        endDate: LessThanOrEqual(new Date(endDate as string))
      };
    }

    const reports = await weeklyReportRepository.find({
      where: whereClause,
      order: { startDate: 'DESC' }
    });

    return res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
};

export const getWeeklyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const report = await weeklyReportRepository.findOne({ where: { id } });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    return res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};

export const createWeeklyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reportData = req.body;
    
    const report = weeklyReportRepository.create(reportData);
    await weeklyReportRepository.save(report);
    
    return res.status(201).json({ 
      message: 'Weekly report created successfully',
      report 
    });
  } catch (error) {
    next(error);
  }
};

// Monthly Reports
export const getMonthlyReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { startDate, endDate } = req.query;
    let whereClause = {};
    
    if (startDate && endDate) {
      whereClause = {
        month: Between(new Date(startDate as string), new Date(endDate as string))
      };
    } else if (startDate) {
      whereClause = {
        month: MoreThanOrEqual(new Date(startDate as string))
      };
    } else if (endDate) {
      whereClause = {
        month: LessThanOrEqual(new Date(endDate as string))
      };
    }

    const reports = await monthlyReportRepository.find({
      where: whereClause,
      order: { month: 'DESC' }
    });

    return res.status(200).json({ reports });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const report = await monthlyReportRepository.findOne({ where: { id } });
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    return res.status(200).json({ report });
  } catch (error) {
    next(error);
  }
};

export const createMonthlyReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reportData = req.body;
    
    const report = monthlyReportRepository.create(reportData);
    await monthlyReportRepository.save(report);
    
    return res.status(201).json({ 
      message: 'Monthly report created successfully',
      report 
    });
  } catch (error) {
    next(error);
  }
};