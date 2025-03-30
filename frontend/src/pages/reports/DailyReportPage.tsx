import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, TextField, Button } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../../components/layout/Layout';
import ChartContainer from '../../components/charts/ChartContainer';
import { DailyReport } from '../../types/report.types';
import { getDailyReports } from '../../services/report.service';

const DailyReportPage: React.FC = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const date = selectedDate ? selectedDate.toISOString().split('T')[0] : undefined;
      
      // 키워드 파라미터를 추가하여 API 호출 (백엔드 API 수정 필요)
      // 실제 구현에서는 백엔드 API에 keyword 파라미터 전달 필요
      const data = await getDailyReports(date, date);
      setReports(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('보고서 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 기본값으로 오늘 날짜 설정
    const today = new Date();
    setSelectedDate(today);
    
    // fetchReports will be called when these state updates trigger the next useEffect
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchReports();
    }
  }, [selectedDate]);

  // Prepare data for charts
  const buzzData = {
    labels: reports.map(report => new Date(report.date).toLocaleDateString()),
    datasets: [
      {
        label: '총 버즈량',
        data: reports.map(report => report.totalBuzz),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const sentimentTrendData = {
    labels: reports.map(report => new Date(report.date).toLocaleDateString()),
    datasets: [
      {
        label: '긍정적',
        data: reports.map(report => report.companyPositive),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: '부정적',
        data: reports.map(report => report.companyNegative),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: '문의',
        data: reports.map(report => report.companyInquiry),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        tension: 0.1,
      },
    ],
  };

  const competitorTrendData = {
    labels: reports.map(report => new Date(report.date).toLocaleDateString()),
    datasets: [
      {
        label: '긍정적',
        data: reports.map(report => report.competitorPositive),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
      {
        label: '부정적',
        data: reports.map(report => report.competitorNegative),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
      },
      {
        label: '문의',
        data: reports.map(report => report.competitorInquiry),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          일별 보고서
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          일별 지표 및 현황 분석
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="날짜 선택"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="키워드 입력"
                value={keyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                variant="outlined"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={fetchReports}
                fullWidth
                sx={{ height: '56px' }}
              >
                검색
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {loading ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>보고서 로딩중...</Typography>
        </Paper>
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Paper>
      ) : reports.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>선택한 기간에 가능한 보고서가 없습니다.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <ChartContainer
              title="일별 버즈량"
              data={buzzData}
              availableChartTypes={['bar', 'line']}
              defaultChartType="bar"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="회사 여론 동향"
              data={sentimentTrendData}
              availableChartTypes={['line', 'bar']}
              defaultChartType="line"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="경쟁사 여론 동향"
              data={competitorTrendData}
              availableChartTypes={['line', 'bar']}
              defaultChartType="line"
            />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default DailyReportPage;
