import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  LabelList,
} from 'recharts';
import { PastOrFutureDebitType } from '../../utils/transactions';
import { getFutureDebitDate, isArrayAndNotEmpty } from '../../utils/helpers';
import { useState } from 'react';
import dayjs from 'dayjs';
import { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';

type barChartsDataType = {
  name?: string;
  pv?: number;
  uv?: number;
};

interface BarChartsProps {
  pastOrFutureDebit: PastOrFutureDebitType[];
};

export const BarCharts = (props: BarChartsProps) => {
  const userLang = useSelector((state: RootState) => state.language.lang);
  const [activeIndex, setActiveIndex] = useState<number>(null);

  let data: barChartsDataType[] = [];
  if (isArrayAndNotEmpty(props.pastOrFutureDebit)) {
    data = props.pastOrFutureDebit.map((debit) => ({
      name: getFutureDebitDate(debit.debitMonth),
      pv: debit.monthlyNISDebitSum,
      uv: debit.monthlyNumberOfTransactions
    }));
  } else {
    data = [{name: 'No Data', pv: 0}];
  }

  const activeItem = data[activeIndex];

  const renderCustomizedLabel = (props: any) => {
    const { x, y, width, value } = props;
    const radius = 10;
    const month = dayjs(JSON.stringify(value)).locale(userLang).format('DD');

    return (
      <g>
        <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
        <text x={x + width / 2} y={y - radius} fill="#fff" textAnchor="middle" dominantBaseline="middle">
          {dayjs(month).isValid() ? month: 0}
        </text>
      </g>
    );
  };

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          onClick={({ activeTooltipIndex }) => {
            setActiveIndex(activeTooltipIndex);
          }}
          margin={{
            top: 5,
            right: 30,
            left: 10,
            bottom: 5,
          }}
        >
          <CartesianGrid />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="pv" name={'Month'} fill="#413ea0" minPointSize={5}>
            <LabelList dataKey="name" content={renderCustomizedLabel} />
          </Bar>
          <Bar dataKey="uv" name={'Transactions'} fill="#82ca9d" minPointSize={10} />
        </BarChart>
      </ResponsiveContainer>
      {activeItem && (
        <p>{activeItem.pv} {activeItem.name}</p>
      )}
    </>
  );
}
