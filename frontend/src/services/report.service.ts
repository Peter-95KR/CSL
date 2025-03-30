import { DailyReport, WeeklyReport, MonthlyReport } from '../types/report.types';
// Direct fetch implementation - no longer using axios via api.service.ts

// Helper function to get authorization header
const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Daily Reports
export const getDailyReports = async (startDate?: string, endDate?: string) => {
  try {
    // Build query params
    let url = 'http://localhost:3001/api/reports/daily';
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    console.log('일별 보고서 가져오는 중:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
    });
    
    if (!response.ok) {
      throw new Error('일별 보고서 가져오기 실패');
    }
    
    const data = await response.json();
    console.log('일별 보고서 데이터:', data);
    return data.reports;
  } catch (error) {
    console.error('일별 보고서 가져오기 오류:', error);
    throw error;
  }
};

export const getDailyReport = async (id: string) => {
  try {
    const url = `http://localhost:3001/api/reports/daily/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch daily report with id ${id}`);
    }
    
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error(`Error fetching daily report with id ${id}:`, error);
    throw error;
  }
};

// Weekly Reports
export const getWeeklyReports = async (startDate?: string, endDate?: string) => {
  try {
    // Build query params
    let url = 'http://localhost:3001/api/reports/weekly';
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    console.log('Fetching weekly reports from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch weekly reports');
    }
    
    const data = await response.json();
    return data.reports;
  } catch (error) {
    console.error('Error fetching weekly reports:', error);
    throw error;
  }
};

export const getWeeklyReport = async (id: string) => {
  try {
    const url = `http://localhost:3001/api/reports/weekly/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch weekly report with id ${id}`);
    }
    
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error(`Error fetching weekly report with id ${id}:`, error);
    throw error;
  }
};

// Monthly Reports
export const getMonthlyReports = async (startDate?: string, endDate?: string) => {
  try {
    // Build query params
    let url = 'http://localhost:3001/api/reports/monthly';
    if (startDate || endDate) {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      url += `?${params.toString()}`;
    }
    
    console.log('Fetching monthly reports from:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch monthly reports');
    }
    
    const data = await response.json();
    return data.reports;
  } catch (error) {
    console.error('Error fetching monthly reports:', error);
    throw error;
  }
};

export const getMonthlyReport = async (id: string) => {
  try {
    const url = `http://localhost:3001/api/reports/monthly/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...getAuthHeader()
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch monthly report with id ${id}`);
    }
    
    const data = await response.json();
    return data.report;
  } catch (error) {
    console.error(`Error fetching monthly report with id ${id}:`, error);
    throw error;
  }
};
