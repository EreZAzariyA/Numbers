import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PastOrFutureDebits } from '../../models/user-model';
import { asNumString, getFutureDebitDate, isArrayAndNotEmpty } from '../../utils/helpers';

interface GraphProps {
  pastOrFutureDebits: PastOrFutureDebits[];
};

const emptyData = [
  { name: '', uv: 0 },
  { name: '', uv: 0 },
  { name: '', uv: 0 },
  { name: '', uv: 0 },
  { name: '', uv: 0 },
];

const customTooltipFormatter = (value: number): string => {
  return asNumString(value);
};

export const Graph = (props: GraphProps) => {

  const data = props.pastOrFutureDebits?.map((debit) => ({
    name: getFutureDebitDate(debit.debitMonth),
    uv: debit.monthlyNISDebitSum,
  }));

  return (
    <ResponsiveContainer width={'100%'} height={300}>
      <AreaChart
        data={isArrayAndNotEmpty(data) ? data : emptyData}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis  />
        <Tooltip formatter={customTooltipFormatter} />
        <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};