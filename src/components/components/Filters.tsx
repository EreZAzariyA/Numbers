import { Button, Col, DatePicker, Row, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useTranslation } from "react-i18next";
import { Dayjs } from "dayjs";
import { useResize } from "../../utils/helpers";

interface FiltersProps {
  datesFilter?: boolean;
  monthFilter?: boolean;
  categoryFilter?: boolean;
  filterState: any;
  handleFilterChange: (field: string, val: string | number[] | Dayjs[]) => void;
  resetFilters?: () => void;
};

export const Filters = (props: FiltersProps) => {
  const { t } = useTranslation();
  const categories = useSelector((state: RootState) => state.categories);
  const { isPhone } = useResize();

  return (
    <Row align={'middle'} justify={'start'} gutter={[20, 10]}>
      {props.datesFilter && (
        <Col>
          <DatePicker.RangePicker
            allowClear
            style={{ minWidth: '200px' }}
            value={props.filterState.dates}
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
            allowClear={!isPhone}
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
            style={{ minWidth: '200px' }}
            placeholder={t('placeholders.0')}
            onChange={(val) => props.handleFilterChange('category_id', val)}
            options={[...categories].map((c) => ({
              label: c.name,
              value: c._id,
            }))}
          />
        </Col>
      )}
      <Col>
        <Button type="text" danger onClick={props.resetFilters}>Reset</Button>
      </Col>
    </Row>
  )
};