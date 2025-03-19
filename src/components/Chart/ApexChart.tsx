import { Skeleton } from '@chakra-ui/react';
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
  const getOptions = () => ({
    chart: {
      type,
      zoom: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: showDataLabels,
      style: {
        fontSize: '16px',
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
        colors: ['#4A5568', 'transparent'],
        opacity: 0.5,
      },
    },
    legend: {
      show: !hideLegend,
      position: 'bottom',
      labels: {
        colors: '#FFF',
      },
    },
    markers: {
      size: 0,
    },
    xaxis: {
      categories: categories && categories.length > 0 ? categories : [''],
      labels: {
        show: categories && categories.length > 0,
        style: {
          colors: '#FFF',
          fontSize: '14px',
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#FFF',
          fontSize: '14px',
        },
      },
    },
    colors: colors || undefined,
    tooltip: {
      theme: 'dark',
    },
  } as ApexOptions);

  if (isLoading) {
    return <Skeleton height="300px" w="100%" />;
  }

  return (
    <ApexCharts id={id} options={getOptions()} series={series} type={type} height={height} width={width} />
  );
}
