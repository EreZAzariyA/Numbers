import dayjs, { Dayjs } from "dayjs";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Trans as T } from "react-i18next";
import InvoiceModel from "../../models/invoice";
import CategoryModel from "../../models/category-model";
import { BarCharts } from "../components/Charts/BarCharts";
import { PieChart } from "../components/Charts/PieChart";
import { asNumString, findCategoryWithLargestSpentAmount, findCategoryWithLowestAmount, getInvoicesPricePerCategory, getInvoicesTotalsPrice, getNumOfTransactionsPerCategory } from "../../utils/helpers";
import { TransactionStatusesType } from "../../utils/transactions";
import { Col, Divider, Row } from "antd";
import { ChartsTypes } from "../components/Charts/charts-utils";

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  invoices: InvoiceModel[];
  categories: CategoryModel[];
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const userLang = useSelector((state: RootState) => state.language.lang);
  const date = dayjs(props.monthToDisplay).locale(userLang).format('MMMM-YYYY');
  const totalSpent = getInvoicesTotalsPrice(props.invoices, TransactionStatusesType.COMPLETED);
  const numOfTransPerCategory = getNumOfTransactionsPerCategory(props.invoices, props.categories, TransactionStatusesType.COMPLETED);
  const invoicesPricePerCategory = getInvoicesPricePerCategory(props.invoices, TransactionStatusesType.COMPLETED);
  const maxSpent = findCategoryWithLargestSpentAmount(invoicesPricePerCategory);
  const minSpent = findCategoryWithLowestAmount(invoicesPricePerCategory);

  return (
    <Row gutter={[10, 10]} align={'middle'}>
      <Col xs={24} lg={14}>
        <PieChart categories={props.categories} invoices={props.invoices} />
      </Col>
      <Col xs={24} lg={10}>
        <Row gutter={[10, 10]}>
          <Col className="mb-10" span={24}>
            <span className="sub-title"><T>homePage.firstPage.0</T> {date}</span>
          </Col>
          <Col span={24}>
            <div>
              <BarCharts data={numOfTransPerCategory} type={ChartsTypes.INVOICES_PER_CATEGORY} />
            </div>
          </Col>
          <Col span={12}><b>Total Spent:</b></Col>
            <Col span={12}>{asNumString(Math.abs(totalSpent?.spent))}</Col>
            {(maxSpent?.amount > 0) && (
              <>
                <Divider style={{ margin: 0 }} />
                <Col span={12}><b>Largest Spent:</b></Col>
                <Col span={12}>{`${maxSpent?.category}: ${asNumString(maxSpent?.amount)}`}</Col>
                <Divider style={{ margin: 0 }} />
              </>
            )}
            {minSpent?.amount > 0 && (
              <>
                <Col span={12}><b>Lowest Spent:</b></Col>
                <Col span={12}>{`${minSpent?.category}: ${asNumString(minSpent?.amount)}`}</Col>
              </>
            )}
            {(maxSpent?.amount < 0 && minSpent?.amount  < 0) && (
              <Col span={24}>
                <b>No Data</b>
              </Col>
            )}
        </Row>
      </Col>
    </Row>
  );
};

export default DashboardFirst;