import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import cloud from 'd3-cloud';
import styled from 'styled-components';

interface WordCloudChartProps {
  data: {
    text: string;
    value: number;
  }[];
  width?: number;
  height?: number;
  fontSizeRange?: [number, number];
  colors?: string[];
}

const WordCloudChart: React.FC<WordCloudChartProps> = ({
  data,
  width = 500,
  height = 300,
  fontSizeRange = [10, 60],
  colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2'],
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Clear previous word cloud
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate font size based on word frequency
    const fontSizeScale = d3
      .scaleLinear()
      .domain([d3.min(data, (d) => d.value) || 0, d3.max(data, (d) => d.value) || 1])
      .range(fontSizeRange);

    // Colors will be used directly in the fill style

    // Create layout
    const layout = cloud()
      .size([width, height])
      .words(data.map((d) => ({ text: d.text, size: fontSizeScale(d.value) })))
      .padding(5)
      .rotate(() => 0) // No rotation for better readability
      .font('Arial')
      .fontSize((d: any) => d.size)
      .on('end', draw);

    layout.start();

    function draw(words: any[]) {
      d3.select(svgRef.current)
        .attr('width', layout.size()[0])
        .attr('height', layout.size()[1])
        .append('g')
        .attr('transform', `translate(${layout.size()[0] / 2},${layout.size()[1] / 2})`)
        .selectAll('text')
        .data(words)
        .enter()
        .append('text')
        .style('font-size', (d: any) => `${d.size}px`)
        .style('font-family', 'Arial')
        .style('fill', (d: any, i: number) => colors[i % colors.length])
        .attr('text-anchor', 'middle')
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`)
        .text((d: any) => d.text);
    }
  }, [data, width, height, fontSizeRange, colors]);

  return (
    <ChartContainer>
      <svg ref={svgRef} width={width} height={height}></svg>
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  max-height: 300px;
`;

export default WordCloudChart;
