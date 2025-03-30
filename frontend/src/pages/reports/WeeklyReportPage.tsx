import React, { useState, useEffect } from 'react';
import { Grid, Typography, Box, Paper, Button, TextField, MenuItem } from '@mui/material';
import Layout from '../../components/layout/Layout';
import ChartContainer from '../../components/charts/ChartContainer';
import { WeeklyReport } from '../../types/report.types';
import { getWeeklyReports } from '../../services/report.service';

const WeeklyReportPage: React.FC = () => {
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<number>(0); // 현재 주차
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 주차 계산 함수
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // 해당 주차의 시작일과 종료일 계산
  const getWeekDates = (year: number, week: number): { start: Date, end: Date } => {
    const firstDayOfYear = new Date(year, 0, 1);
    const daysOffset = firstDayOfYear.getDay() - 1; // 월요일 기준으로 조정
    const firstMonday = new Date(year, 0, 1 + (daysOffset <= 0 ? -daysOffset : 7 - daysOffset));
    
    const start = new Date(firstMonday);
    start.setDate(firstMonday.getDate() + (week - 1) * 7);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    
    return { start, end };
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      if (selectedWeek <= 0) {
        throw new Error('주차를 선택해주세요');
      }
      
      const { start, end } = getWeekDates(selectedYear, selectedWeek);
      const startStr = start.toISOString().split('T')[0];
      const endStr = end.toISOString().split('T')[0];
      
      // 키워드 파라미터를 추가하여 API 호출 (백엔드 API 수정 필요)
      const data = await getWeeklyReports(startStr, endStr);
      setReports(data);
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || '보고서 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 현재 날짜의 주차 계산
    const today = new Date();
    const currentWeek = getWeekNumber(today);
    
    setSelectedWeek(currentWeek);
    setSelectedYear(today.getFullYear());
    
    // fetchReports will be called when these state updates trigger the next useEffect
  }, []);

  useEffect(() => {
    if (selectedWeek > 0) {
      fetchReports();
    }
  }, [selectedWeek, selectedYear]);

  // Format week labels
  const weekLabels = reports.map(report => {
    const start = new Date(report.startDate).toLocaleDateString();
    const end = new Date(report.endDate).toLocaleDateString();
    return `${start} - ${end}`;
  });

  // Prepare data for charts
  const buzzData = {
    labels: weekLabels,
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

  const sentimentData = {
    labels: weekLabels,
    datasets: [
      {
        label: '긍정적',
        data: reports.map(report => report.companyPositive),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: '부정적',
        data: reports.map(report => report.companyNegative),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '문의',
        data: reports.map(report => report.companyInquiry),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  const smallBusinessData = {
    labels: weekLabels,
    datasets: [
      {
        label: '창업자 언급',
        data: reports.map(report => report.entrepreneurStartupMentions),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: '폐업관련 언급',
        data: reports.map(report => report.businessClosureMentions),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: '업종변경 관련 언급',
        data: reports.map(report => report.businessTypeSwitchMentions),
        borderColor: 'rgb(255, 206, 86)',
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
      },
    ],
  };

  // Aggregate keyword frequency across all reports
  const keywordFrequencyData = reports.reduce(
    (accumulator, report) => {
      if (report.keywordFrequency) {
        Object.entries(report.keywordFrequency).forEach(([keyword, frequency]) => {
          if (accumulator[keyword]) {
            accumulator[keyword] += frequency;
          } else {
            accumulator[keyword] = frequency;
          }
        });
      }
      return accumulator;
    },
    {} as Record<string, number>
  );

  // Convert to format expected by WordCloudChart
  const wordCloudData = Object.entries(keywordFrequencyData)
    .map(([text, value]) => ({ text, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 50); // Limit to top 50 keywords

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          주간 보고서
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          주간 지표 및 현황 분석
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={3}>
            <TextField
              label="연도"
              type="number"
              value={selectedYear}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedYear(Number(e.target.value))}
              variant="outlined"
              fullWidth
              InputProps={{ 
                inputProps: { min: 2020, max: 2030 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="주차 선택 (1-52)"
              type="number"
              value={selectedWeek}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedWeek(Number(e.target.value))}
              variant="outlined"
              fullWidth
              InputProps={{ 
                inputProps: { min: 1, max: 52 }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              label="키워드 입력"
              value={keyword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={3}>
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
          {selectedWeek > 0 && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" align="center">
                {selectedYear}년 {selectedWeek}주차 ({getWeekDates(selectedYear, selectedWeek).start.toLocaleDateString()} - {getWeekDates(selectedYear, selectedWeek).end.toLocaleDateString()})
              </Typography>
            </Grid>
          )}
        </Grid>
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
              title="주간 버즈량"
              data={buzzData}
              availableChartTypes={['bar', 'line']}
              defaultChartType="bar"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="회사 여론 동향"
              data={sentimentData}
              availableChartTypes={['line', 'bar']}
              defaultChartType="line"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <ChartContainer
              title="소상공인 트렌드"
              data={smallBusinessData}
              availableChartTypes={['line', 'bar']}
              defaultChartType="line"
            />
          </Grid>

          <Grid item xs={12}>
            <ChartContainer
              title="인기 키워드"
              data={wordCloudData}
              availableChartTypes={['wordCloud']}
              defaultChartType="wordCloud"
            />
          </Grid>
        </Grid>
      )}
    </Layout>
  );
};

export default WeeklyReportPage;
