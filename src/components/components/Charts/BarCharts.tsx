import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
      <text x={0} y={0} dy={16} textAnchor="start" fill="#666">
        {asNumString(payload.value)}
      </text>
    </g>
  );
};

export const BarCharts = (props: BarChartsProps) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number>(null);

  let data: any[] = [];
  if (props.type === ChartsTypes.INVOICES_PER_CATEGORY && isArrayAndNotEmpty(Object.keys(props.data))) {
    data = Object.entries(props.data)
    .map(([key, value]) => ({
      name: key,
      spent: Math.abs(value?.spent),
      income: value?.income,
    }));
  } else if (props.type === ChartsTypes.PAST_DEBIT) {

  } else {
    data = [{ name: t('charts.noData'), spent: 0, income: 0 }];
  }

  data = [...data].filter((d) => d.spent !== 0);

  const activeItem = data[activeIndex];

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.15)" />
          <XAxis dataKey="name" tick={customizedXAxisTick} />
          <YAxis dataKey={"spent"} tick={customizedYAxisTick} />
          <Tooltip formatter={(val) => (val.toLocaleString())} />
          <Bar dataKey="spent" name={t('charts.spent')} onClick={(_, i) => setActiveIndex(i)} minPointSize={1}>
            {data.map((_, index) => (
              <Cell cursor="pointer" fill={index === activeIndex ? '#14B8A6' : '#0D9488'} key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {activeItem && (
        <p className="content">{t('charts.amountSpentOn', { name: activeItem.name, amount: activeItem.spent })}</p>
      )}
    </>
  );
}
