import { Col, Divider, Row, Space } from "antd";
import dayjs, { Dayjs } from "dayjs";
import InvoiceModel from "../../models/invoice";
import CategoryModel from "../../models/category-model";
import { asNumString, findCategoryWithLargestSpentAmount, findCategoryWithLowestAmount, getInvoicesPricePerCategory, getInvoicesTotalsPrice } from "../../utils/helpers";
import { Trans as T } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import Charts from "../components/Charts";

interface DashboardFirstProps {
  setMonthToDisplay?: React.Dispatch<React.SetStateAction<Dayjs>>;
  monthToDisplay: Dayjs;
  invoices: InvoiceModel[];
  categories: CategoryModel[];
};

const DashboardFirst = (props: DashboardFirstProps) => {
  const userLang = useSelector((state: RootState) => state.language.lang);
  const date = dayjs(props.monthToDisplay).locale(userLang).format('MMMM-YYYY');
  const invoicesPricePerCategory = getInvoicesPricePerCategory(props.invoices);
  const totalSpent = getInvoicesTotalsPrice(props.invoices);
  const maxSpent = findCategoryWithLargestSpentAmount(invoicesPricePerCategory);
  const minSpent = findCategoryWithLowestAmount(invoicesPricePerCategory);

  return (
    <Space direction="vertical">
      <Row gutter={[10, 10]} align={'top'}>
        <Col xs={24} md={14}>
          <Charts categories={props.categories} invoices={props.invoices} />
        </Col>
        <Col xs={24} md={10}>
          <Row gutter={[10, 10]} style={{textAlign: 'center'}}>
            <Col className="mb-10" span={24}>
              <span className="sub-title"><T>homePage.firstPage.0</T> {date}</span>
              {/* <span style={{ textDecoration: 'underline', textUnderlineOffset: 3, fontSize: 20, fontWeight: 600 }}><T>homePage.firstPage.0</T> {date}</span> */}
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
                <Divider style={{ margin: 0 }} />
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
    </Space>
  );
};

export default DashboardFirst;