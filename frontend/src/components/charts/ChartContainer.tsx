import React, { useState } from 'react';
import styled from 'styled-components';
import { ChartType } from '../../types/report.types';
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import WordCloudChart from './WordCloudChart';
import { Box, FormControl, InputLabel, MenuItem, Select, Paper, Typography } from '@mui/material';

interface ChartContainerProps {
  title: string;
  data: any;
  availableChartTypes: ChartType[];
  defaultChartType?: ChartType;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  data,
  availableChartTypes,
  defaultChartType = 'bar',
}) => {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return <BarChart data={data} />;
      case 'line':
        return <LineChart data={data} />;
      case 'pie':
      case 'doughnut':
        return <PieChart data={data} type={chartType} />;
      case 'wordCloud':
        return <WordCloudChart data={data} />;
      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <StyledPaper elevation={3}>
      <ChartHeader>
        <Typography variant="h6">{title}</Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
          <InputLabel id="chart-type-select-label">Chart Type</InputLabel>
          <Select
            labelId="chart-type-select-label"
            id="chart-type-select"
            value={chartType}
            label="Chart Type"
            onChange={(e) => setChartType(e.target.value as ChartType)}
          >
            {availableChartTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </ChartHeader>
      <ChartContent>{renderChart()}</ChartContent>
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  padding: 16px;
  margin: 16px 0;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ChartContent = styled.div`
  flex: 1;
  height: 300px;
  max-height: 350px;
  position: relative;
  overflow: hidden;
`;

export default ChartContainer;