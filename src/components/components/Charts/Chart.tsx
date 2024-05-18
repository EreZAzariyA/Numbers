import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import InvoiceModel from '../../../models/invoice';
import CategoryModel from '../../../models/category-model';
import { ThemeColors } from '../../../redux/slicers/theme-slicer';
import { Languages } from '../../../redux/slicers/lang-slicer';
import { getInvoicesTotalsPrice, useResize } from '../../../utils/helpers';
import { PieChart } from '@mui/x-charts';
import "./Charts.css"

interface ChartsProps {
  categories: CategoryModel[];
  invoices: InvoiceModel[];
};

const Charts = (props: ChartsProps) => {
  const theme = useSelector((state: RootState) => state.theme.themeColor);
  const lang = useSelector((state: RootState) => state.language.lang);
  const isEn = lang === Languages.EN;
  const pieColor = theme === ThemeColors.LIGHT ? 'black' : 'white';
  const { isMobile } = useResize();

  let data = [];
  for (let category of props.categories) {
    const id = category._id;
    const label = category.name;
    const categoryInvoices = [...props.invoices].filter((i) => i.category_id === category._id);
    const value = getInvoicesTotalsPrice(categoryInvoices);

    const categoryData = {id, label, value: (Math.abs(value.spent) || 0.0001)};
    data.push(categoryData);
  };

  return (
    <PieChart
      margin={isMobile ? { top: 50, left: 100 } : {}}
      series={[
        {
          data: data.length ? [...data] : [{ label: 'No Data', value: 0.0001, color: 'grey' }],
          innerRadius: isMobile ? 50 : 60,
          cornerRadius: 5,
          paddingAngle: 2,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30 },
        },
      ]}
      height={200}
      slotProps={{
        legend: {
          labelStyle: {
            fill: pieColor
          },
          padding: {
            left: isEn ? 10 : 0,
          },
          direction: isMobile ? 'row' : 'column',
          position: {
            horizontal: isMobile ? 'middle' : isEn ? 'right' : 'right',
            vertical: isMobile ? 'top' : 'middle',
          }
        },
      }}
    />
  );
};

export default Charts;