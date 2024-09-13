import { Dayjs } from "dayjs";
import { PastOrFutureDebitType } from "../../utils/types";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState } from "react";
import { asNumString } from "../../utils/helpers";


interface DebitsBarChartsProps{
  pastDebits: PastOrFutureDebitType[];
  currentMonth: Dayjs;
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


export const DebitsBarCharts = (props: DebitsBarChartsProps) => {
  const data = [...props?.pastDebits];
  const [activeIndex, setActiveIndex] = useState<number>(null);
  const activeItem = data[activeIndex];

  return (
    <>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="debitMonth" tick={customizedXAxisTick} padding={{ left: 0, right: 0 }} />
          <YAxis dataKey={"monthlyNISDebitSum"} tick={customizedYAxisTick} />
          <Tooltip formatter={(val) => (val.toLocaleString())} />
          <Bar dataKey="monthlyNISDebitSum" name='Spent' onClick={(_, i) => setActiveIndex(i)} minPointSize={1}>
            {data.map((_, index) => (
              <Cell cursor="pointer" fill={index === activeIndex ? '#82ca9d' : '#8884d8'} key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      {activeItem && (
        <p className="content">{`Amount spent on "${activeItem.debitMonth}": ${activeItem.monthlyNISDebitSum}`}</p>
      )}
    </>
  )
}