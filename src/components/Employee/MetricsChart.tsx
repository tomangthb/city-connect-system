
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

interface ChartData {
  date?: string;
  value?: number;
  name?: string;
  percentage?: number;
}

interface MetricsChartProps {
  title: string;
  data: ChartData[];
  type?: 'line' | 'bar' | 'pie';
  color?: string;
  showLegend?: boolean;
}

const chartConfig = {
  value: {
    label: "Value",
    color: "hsl(var(--chart-1))",
  },
};

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
  '#82CA9D', '#FFC658', '#FF7C7C', '#8DD1E1', '#D084D0'
];

const MetricsChart = ({ title, data, type = 'line', color = '#3b82f6', showLegend = false }: MetricsChartProps) => {
  const renderCustomizedLabel = (entry: any) => {
    if (type === 'pie' && entry.percentage > 5) { // Only show label if slice is bigger than 5%
      return `${entry.percentage}%`;
    }
    return '';
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-xs">
            <div 
              className="w-3 h-3 rounded mr-1" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="truncate max-w-[120px]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color} 
                  strokeWidth={2}
                  dot={{ fill: color, strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            ) : type === 'bar' ? (
              <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill={color} />
              </BarChart>
            ) : (
              <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-200 rounded shadow-lg">
                          <p className="font-medium">{data.name}</p>
                          <p className="text-sm">{data.percentage}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {showLegend && <Legend content={<CustomLegend />} />}
              </PieChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MetricsChart;
