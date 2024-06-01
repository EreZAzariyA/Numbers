import { useState } from 'react';
import {
  ResponsiveContainer,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  YAxis,
  Cell,
} from 'recharts';
import { asNumString, isArrayAndNotEmpty } from '../../../utils/helpers';
import { ChartsTypes } from './charts-utils';

interface BarChartsProps {
  data?: any[];
  type: ChartsTypes;
};

const customizedXAxisTick = (props: {x: number, y: number, payload: any}) => {
  const { x, y, payload } = props;
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666">
        {payload.value}
      </text>
    </g>
  );
};

const customizedYAxisTick = (props: any) => {
  const { x, y, payload } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="end" fill="#666">
        {asNumString(payload.value)}
      </text>
    </g>
  );
};

export const BarCharts = (props: BarChartsProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(null);

  let data: any[] = [];
  if (props.type === ChartsTypes.INVOICES_PER_CATEGORY && isArrayAndNotEmpty(Object.keys(props.data))) {
    data = Object.entries(props.data)
    .filter((val) => val[1].totalAmount.spent !== 0)
    .map(([key, value]) => ({
      name: key,
      spent: Math.abs(value.totalAmount.spent),
      income: value.totalAmount.income,
    }));
  } else {
    data = [{name: 'No Data', spent: 0, income: 0}]
  }

  const activeItem = data[activeIndex];

  return (
    <>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={customizedXAxisTick} padding={{ left: 0, right: 0 }} />
          <YAxis dataKey={"spent"} tick={customizedYAxisTick} />
          <Tooltip formatter={(val) => (val.toLocaleString())} />
          <Bar dataKey="spent" name='Spent' onClick={(_, i) => setActiveIndex(i)} minPointSize={1}>
            {data.map((_, index) => (
              <Cell cursor="pointer" fill={index === activeIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {activeItem && (
        <p className="content">{`Amount spent on "${activeItem.name}": ${activeItem.spent}`}</p>
      )}
    </>
  );
}
