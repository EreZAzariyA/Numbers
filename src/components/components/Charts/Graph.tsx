import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { asNumString, getFutureDebitDate, isArrayAndNotEmpty } from '../../../utils/helpers';
import { ChartsTypes } from './charts-utils';
import { PastOrFutureDebitType } from '../../../utils/types';

interface GraphProps {
  data: PastOrFutureDebitType[];
  type: ChartsTypes;
};

const customTooltipFormatter = (value: number): string => {
  return asNumString(value);
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

export const Graph = (props: GraphProps) => {

  let data = [
    { name: '', uv: 0 },
    { name: '', uv: 0 },
    { name: '', uv: 0 },
    { name: '', uv: 0 },
    { name: '', uv: 0 },
  ];
  if (isArrayAndNotEmpty(props.data)) {
    switch (props.type) {
      case ChartsTypes.PAST_DEBIT:
        data = props.data.map((i) => ({
          name: getFutureDebitDate(i.debitMonth),
          uv: i.monthlyNISDebitSum,
        }));
      break;
    }
  }

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis dataKey={'uv'} tick={customizedYAxisTick} />
        <Tooltip formatter={customTooltipFormatter} />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};