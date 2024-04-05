import { PieChart } from '@mui/x-charts';
import CategoryModel from '../../../models/category-model';
import InvoiceModel from '../../../models/invoice';
import "./Charts.css"
import { asNumber, getInvoicesTotalsPrice, useResize } from '../../../utils/helpers';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import { ThemeColors } from '../../../redux/slicers/theme-slicer';

interface ChartsProps {
  categories: CategoryModel[];
  invoices: InvoiceModel[];
};

const Charts = (props: ChartsProps) => {
  const theme = useSelector((state: RootState) => state.theme.themeColor);
  const pieColor = theme === ThemeColors.LIGHT ? 'black' : 'white';
  const { isMobile } = useResize();

  let data = [];
  for (let category of props.categories) {
    const id = category._id;
    const label = category.name;
    const categoryInvoices = props.invoices.filter((i) => i.category_id === category._id);
    const value = getInvoicesTotalsPrice(categoryInvoices)

    const categoryData = {id, label, value: asNumber(value) || 0.0001};
    data.push(categoryData);
  };
  data = data.sort((a, b) => asNumber(b.value) - asNumber(a.value));

  return (
    <PieChart
      margin={isMobile ? { top: 50, left: 100 } : {}}
      series={[
        {
          data: data.length ? [...data] : [{label: 'No Data', value: 1}],
          innerRadius: isMobile ? 50 : 60,
          cornerRadius: 5,
          paddingAngle: 2,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30 },
        }
      ]}
      height={200}
      slotProps={{
        legend: {
          labelStyle: {
            fill: pieColor
          },
          padding: {
            left: 10,
          },
          direction: isMobile ? 'row' : 'column',
          position: {
            horizontal: isMobile ? 'middle' : 'right',
            vertical: isMobile ? 'top' : 'middle',
          }
        },
      }}
    />
  );
};

export default Charts;