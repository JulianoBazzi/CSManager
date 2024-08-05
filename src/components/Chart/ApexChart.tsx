import { Skeleton, useBreakpointValue } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

interface IApexChartProps {
  id: string;
  type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap'
  | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap';
  categories?: string[] | number[];
  series?: ApexAxisChartSeries | ApexNonAxisChartSeries;
  colors?: string[];
  showDataLabels?: boolean;
  hideLegend?: boolean;
  isLoading?: boolean;
  width?: string | number,
  height?: string | number,
}

export default function ApexChart({
  id,
  type,
  categories = [],
  series = [],
  colors,
  showDataLabels,
  hideLegend,
  isLoading,
  width = '100%',
  height = 'auto',
}: IApexChartProps) {
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });

  const getOptions = () => ({
    chart: {
      type,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: showDataLabels,
      style: {
        fontSize: isMobile ? '16px' : '20px',
      },
      dropShadow: {
        enabled: true,
        left: 1,
        top: 1,
        opacity: 0.9,
      },
    },
    plotOptions: {
      bar: {
        distributed: hideLegend,
      },
    },
    stroke: {
      curve: 'smooth',
    },
    grid: {
      row: {
        colors: ['#f9f9f9', 'transparent'],
        opacity: 0.5,
      },
    },
    legend: {
      show: !hideLegend,
      position: 'bottom',
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: categories && categories.length > 0 ? categories : [''],
      labels: {
        show: categories && categories.length > 0,
      },
    },
    colors: colors || undefined,
  } as ApexOptions);

  if (isLoading) {
    return <Skeleton height="300px" w="100%" />;
  }

  return (
    <ApexCharts id={id} options={getOptions()} series={series} type={type} height={height} width={width} />
  );
}
