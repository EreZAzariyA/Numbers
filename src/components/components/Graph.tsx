import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PastOrFutureDebits } from '../../models/user-model';
import { asNumString, getFutureDebitDate } from '../../utils/helpers';

interface GraphProps {
  pastOrFutureDebits: PastOrFutureDebits[];
};

export const Graph = (props: GraphProps) => {

  const data = props.pastOrFutureDebits?.map((debit) => ({
    name: getFutureDebitDate(debit.debitMonth),
    uv: debit.monthlyNISDebitSum,
  }));

  const customTooltipFormatter = (value: number): string => {
    return asNumString(value);
  };

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis  />
          <Tooltip formatter={customTooltipFormatter} />
          <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};