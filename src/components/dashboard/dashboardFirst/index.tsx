import "./dashboardFirst.css";
import Charts from "../../components/Charts/Chart";
import { Col, Divider, Row } from "antd";
import dayjs, { Dayjs } from "dayjs";
import InvoiceModel from "../../../models/invoice";
import CategoryModel from "../../../models/category-model";
import { findCategoryWithLargestAmount, findCategoryWithLowestAmount, getInvoicesPricePerCategory, getInvoicesTotalsPrice } from "../../../utils/helpers";

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  invoices: InvoiceModel[];
  categories: CategoryModel[];
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const month = dayjs(props.monthToDisplay).locale('he').format('MMMM');
  const invoicesPricePerCategory = getInvoicesPricePerCategory(props.invoices);
  const totalSpent = getInvoicesTotalsPrice(props.invoices);
  const maxSpent = findCategoryWithLargestAmount(invoicesPricePerCategory);
  const minSpent = findCategoryWithLowestAmount(invoicesPricePerCategory);

  return (
    <div className="home-first-main-container home-component">
      <Row gutter={[5, 10]} align={'top'}>
        <Col xs={24} md={16}>
          <Charts categories={props.categories} invoices={props.invoices} />
        </Col>
        <Col xs={24} md={8}>
          <Row gutter={[10, 10]} style={{textAlign: 'center'}}>
            <Col className="mb-10" span={24}>
              <span style={{ textDecoration: 'underline', fontSize: 20, fontWeight: 600 }}>Monthly report for {month}:</span>
            </Col>

            <Col span={12}><b>Total Spent:</b></Col>
            <Col span={12}>{totalSpent?.spent}</Col>
            <Divider style={{ margin: 0 }} />
            {(maxSpent?.amount > 0) && (
              <>
                <Col span={12}><b>Largest Spent:</b></Col>
                <Col span={12}>{`${maxSpent?.category}: ${maxSpent?.amount}`}</Col>
                <Divider style={{ margin: 0 }} />
              </>
            )}
            {minSpent?.amount > 0 && (
              <>
                <Col span={12}><b>Lowest Spent:</b></Col>
                <Col span={12}>{`${minSpent?.category}: ${minSpent?.amount}`}</Col>
                <Divider style={{ margin: 0 }} />
              </>
            )}
            {(maxSpent?.amount > 0 && minSpent?.amount  > 0) && (
              <Col span={24}>
                <b>No Data</b>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardFirst;