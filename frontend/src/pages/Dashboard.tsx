import React, { useState, useEffect } from 'react';
import { Grid, Typography, Paper, Box, TextField, Button, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Layout from '../components/layout/Layout';
import ChartContainer from '../components/charts/ChartContainer';
import { getDailyReports } from '../services/report.service';
import { DailyReport } from '../types/report.types';

const Dashboard: React.FC = () => {
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // 기간 선택 상태
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // 분석 주기 선택 (daily, weekly, monthly)
  const [analysisType, setAnalysisType] = useState<string>('daily');
  
  // 키워드 검색
  const [keyword, setKeyword] = useState<string>('');

  // 데이터 가져오기 함수
  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (!startDate || !endDate) {
        throw new Error('기간을 선택해주세요');
      }
      
      const start = startDate.toISOString().split('T')[0];
      const end = endDate.toISOString().split('T')[0];
      
      // 실제 구현에서는 분석 타입과 키워드를 API에 전달해야 함
      const data = await getDailyReports(start, end);
      setReports(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || '대시보드 데이터 로드 실패');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 기본값으로 최근 30일 설정
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    
    setStartDate(start);
    setEndDate(end);
  }, []);

  // Prepare data for charts
  const buzzTrendData = {
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

  const sentimentData = {
    labels: ['긍정적', '부정적', '문의'],
    datasets: [
      {
        label: '회사',
        data: [
          reports.reduce((sum, report) => sum + report.companyPositive, 0),
          reports.reduce((sum, report) => sum + report.companyNegative, 0),
          reports.reduce((sum, report) => sum + report.companyInquiry, 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
      },
    ],
  };

  const competitorData = {
    labels: ['긍정적', '부정적', '문의'],
    datasets: [
      {
        label: '경쟁사',
        data: [
          reports.reduce((sum, report) => sum + report.competitorPositive, 0),
          reports.reduce((sum, report) => sum + report.competitorNegative, 0),
          reports.reduce((sum, report) => sum + report.competitorInquiry, 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(255, 206, 86, 0.6)'],
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
          대시보드 개요
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          기간별 키워드 분석 대시보드
        </Typography>
      </Box>
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="시작일"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="종료일"
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{ textField: { variant: 'outlined', fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="키워드 입력"
                value={keyword}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setKeyword(e.target.value)}
                variant="outlined"
                fullWidth
                placeholder="브랜드명, 상품명 등"
                helperText="분석할 키워드를 입력하세요"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={fetchData}
                fullWidth
                sx={{ height: '56px' }}
              >
                분석 시작
              </Button>
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <ToggleButtonGroup
                  value={analysisType}
                  exclusive
                  onChange={(e, newValue) => newValue && setAnalysisType(newValue)}
                  aria-label="분석 주기"
                >
                  <ToggleButton value="daily" aria-label="일별 분석">
                    일별
                  </ToggleButton>
                  <ToggleButton value="weekly" aria-label="주간 분석">
                    주간
                  </ToggleButton>
                  <ToggleButton value="monthly" aria-label="월간 분석">
                    월간
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
            
            {startDate && endDate && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary" align="center">
                  {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()} 기간의 {keyword ? `'${keyword}' 키워드` : '전체'} {
                    analysisType === 'daily' ? '일별' : 
                    analysisType === 'weekly' ? '주간' : '월간'
                  } 분석 결과
                </Typography>
              </Grid>
            )}
          </Grid>
        </LocalizationProvider>
      </Paper>

      {loading ? (
        <StyledPaper>
          <Typography>대시보드 데이터 로딩중...</Typography>
        </StyledPaper>
      ) : error ? (
        <StyledPaper>
          <Typography color="error">{error}</Typography>
        </StyledPaper>
      ) : (
        <Grid container spacing={3} sx={{ height: 'auto' }}>
          <Grid item xs={12} md={8} sx={{ height: '400px' }}>
            <ChartContainer
              title="버즈량 추이"
              data={buzzTrendData}
              availableChartTypes={['bar', 'line']}
              defaultChartType="line"
            />
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ height: '400px' }}>
            <ChartContainer
              title="회사 여론 동향"
              data={sentimentData}
              availableChartTypes={['pie', 'doughnut', 'bar']}
              defaultChartType="doughnut"
            />
          </Grid>
          
          <Grid item xs={12} md={4} sx={{ height: '400px' }}>
            <ChartContainer
              title="경쟁사 여론 동향"
              data={competitorData}
              availableChartTypes={['pie', 'doughnut', 'bar']}
              defaultChartType="doughnut"
            />
          </Grid>
          
          <Grid item xs={12} md={8} sx={{ height: '400px' }}>
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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default Dashboard;
