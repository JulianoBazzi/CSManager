/** biome-ignore-all lint/suspicious/noExplicitAny: <ignore> */
import { Chart as ChakraChart, useChart } from '@chakra-ui/charts';
import { Skeleton } from '@chakra-ui/react';
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

interface IChartSeries {
  name?: string;
  data: number[];
}

interface IChartProps {
  id?: string;
  type?: 'line' | 'area' | 'bar';
  categories?: (string | number)[];
  series?: IChartSeries[];
  colors?: string[];
  showDataLabels?: boolean;
  hideLegend?: boolean;
  loading?: boolean;
  width?: string | number;
  height?: string | number;
}

export default function Chart({
  categories = [],
  series = [],
  colors,
  hideLegend,
  loading,
  height = '300px',
}: IChartProps) {
  const data = categories.map((category, index) => {
    const row: Record<string, any> = { category: String(category) };
    series.forEach((serie, serieIndex) => {
      row[serie.name ?? `serie${serieIndex}`] = serie.data[index];
    });
    return row;
  });

  const chart = useChart({
    data,
    series: series.map((serie, serieIndex) => ({
      name: serie.name ?? `serie${serieIndex}`,
      color: colors?.[serieIndex] ?? 'blue.solid',
    })),
  });

  if (loading) {
    return <Skeleton height={height} w="100%" />;
  }

  return (
    <ChakraChart.Root chart={chart} w="100%" h={height}>
      <LineChart data={chart.data} responsive>
        <CartesianGrid stroke={chart.color('border.muted')} vertical={false} />
        <XAxis dataKey={chart.key('category')} stroke={chart.color('border')} />
        <YAxis stroke={chart.color('border')} />
        <Tooltip cursor={false} content={<ChakraChart.Tooltip />} />
        {!hideLegend && <Legend content={<ChakraChart.Legend />} />}
        {chart.series.map(item => (
          <Line
            key={item.name}
            dataKey={chart.key(item.name)}
            stroke={item.color}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ChakraChart.Root>
  );
}
