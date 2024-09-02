import { Button, Col, DatePicker, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useResize } from "../../utils/helpers";
import { TransactionStatuses } from "../../utils/transactions";
import { CompaniesNames, SupportedCompaniesTypes } from "../../utils/definitions";

interface FiltersProps {
  datesFilter?: boolean;
  monthFilter?: boolean;
  categoryFilter?: boolean;
  statusFilter?: boolean;
  textFilter?: boolean;
  companyFilter?: boolean;
  filterState: any;
  handleFilterChange: (field: string, val: string | number[] | Dayjs[]) => void;
  resetFilters?: () => void;
};

export const Filters = (props: FiltersProps) => {
  const { t } = useTranslation();
  const { isPhone } = useResize();
  const { categories, loading } = useSelector((state: RootState) => state.categories);
  const transactionStatus = [
    {
      name: TransactionStatuses.completed,
      value: TransactionStatuses.completed
    },
    {
      name: TransactionStatuses.pending,
      value: TransactionStatuses.pending
    }
  ];

  return (
    <Row align={'middle'} justify={'start'} gutter={[10, 10]}>
      {props.datesFilter && (
        <Col>
          <DatePicker.RangePicker
            allowClear
            style={{ width: 250 }}
            value={props.filterState.dates}
            maxDate={dayjs()}
            onChange={(val) => {
              if (!val) {
                props.handleFilterChange('dates', null);
                return;
              }
              props.handleFilterChange('dates', val);
            }}
          />
        </Col>
      )}

      {props.monthFilter && (
        <Col>
          <DatePicker
            picker="month"
            maxDate={dayjs()}
            allowClear={!isPhone}
            style={{ width: 250 }}
            value={props.filterState.month}
            onChange={(val) => {
              if (!val) {
                props.handleFilterChange('month', null);
                return;
              }
              props.handleFilterChange('month', val);
            }}
          />
        </Col>
      )}

      {props.categoryFilter && (
        <Col>
          <Select
            mode="multiple"
            allowClear
            value={props.filterState.categories}
            style={{ width: 250 }}
            placeholder={t('placeholders.0')}
            onChange={(val) => props.handleFilterChange('categories', val)}
            options={[...categories].map((c) => ({
              label: c.name,
              value: c._id,
            }))}
            loading={loading}
          />
        </Col>
      )}

      {props.textFilter && (
        <Col>
          <Input
            value={props.filterState.text}
            allowClear
            style={{ width: 250 }}
            placeholder={t('placeholders.3')}
            onChange={(val) => props.handleFilterChange('text', val.target.value)}
          />
        </Col>
      )}

      {props.statusFilter && (
        <Col>
          <Select
            value={props.filterState.status}
            allowClear
            style={{ width: 250 }}
            placeholder={t('placeholders.2')}
            onChange={(val) => props.handleFilterChange('status', val)}
            options={[...transactionStatus].map((c) => ({
              label: c.name,
              value: c.value.toLocaleLowerCase(),
            }))}
          />
        </Col>
      )}

      {props.companyFilter && (
        <Col>
          <Select
            value={props.filterState.companyId}
            allowClear
            style={{ width: 250 }}
            placeholder={t('placeholders.4')}
            onChange={(val) => props.handleFilterChange('companyId', val)}
            options={Object.entries(SupportedCompaniesTypes).map(([key, val]) => ({
              label: CompaniesNames[val],
              value: key,
            }))}
          />
        </Col>
      )}

      <Col>
        <Button className="reset-btn" onClick={props.resetFilters}>Reset</Button>
      </Col>
    </Row>
  )
};