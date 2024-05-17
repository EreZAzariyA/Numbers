import { Button, Col, DatePicker, Input, Row, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import { useResize } from "../../utils/helpers";
import { TransactionStatuses } from "../../utils/transactions";

interface FiltersProps {
  datesFilter?: boolean;
  monthFilter?: boolean;
  categoryFilter?: boolean;
  statusFilter?: boolean;
  textFilter?: boolean;
  filterState: any;
  handleFilterChange: (field: string, val: string | number[] | Dayjs[]) => void;
  resetFilters?: () => void;
};

export const Filters = (props: FiltersProps) => {
  const { t } = useTranslation();
  const { isPhone } = useResize();
  const categories = useSelector((state: RootState) => state.categories);
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
            style={{ width: 200 }}
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
            style={{ width: 150 }}
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
            value={props.filterState.category_id}
            allowClear
            style={{ width: 150 }}
            placeholder={t('placeholders.0')}
            onChange={(val) => props.handleFilterChange('category_id', val)}
            options={[...categories].map((c) => ({
              label: c.name,
              value: c._id,
            }))}
          />
        </Col>
      )}

      {props.textFilter && (
        <Col>
          <Input
            value={props.filterState.text}
            allowClear
            style={{ width: 150 }}
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
            style={{ width: 150 }}
            placeholder={t('placeholders.2')}
            onChange={(val) => props.handleFilterChange('status', val)}
            options={[...transactionStatus].map((c) => ({
              label: c.name,
              value: c.value.toLocaleLowerCase(),
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