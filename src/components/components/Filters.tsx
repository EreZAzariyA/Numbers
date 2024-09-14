import React from "react";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import { useResize } from "../../utils/helpers";
import { TransactionStatuses } from "../../utils/transactions";
import { CompaniesNames, SupportedCompaniesTypes } from "../../utils/definitions";
import { DefaultOptionType } from "antd/es/select";
import { Button, Col, DatePicker, Input, Row, Select } from "antd";

interface FiltersProps {
  datesFilter?: boolean;
  monthFilter?: boolean;
  categoryFilter?: boolean;
  statusFilter?: boolean;
  textFilter?: boolean;
  companyFilter?: boolean;
  byIncome?: boolean;
  categoryText?: boolean;
  filterState: any;
  type: 'categories' | 'transactions',
  handleFilterChange: (field: string, val: string | number[] | Dayjs[]) => void;
  resetFilters?: () => void;
};

export const Filters = (props: FiltersProps) => {
  const { t } = useTranslation();
  const { isPhone, isMobile } = useResize();
  const { categories, loading } = useAppSelector((state) => state.categories);
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
  const incomeType: DefaultOptionType[] = [
    {
      label: 'Income',
      value: 'income'
    },
    {
      label: 'Spent',
      value: 'spent'
    }
  ];

  const style: React.CSSProperties = {
    width: (isMobile ? 200 : 250)
  }

  return (
    <Row align={'middle'} justify={'start'} gutter={[10, 10]}>
      {props.datesFilter && (
        <Col>
          <DatePicker.RangePicker
            allowClear
            style={style}
            value={props.filterState.dates}
            maxDate={dayjs()}
            onChange={(val) => {
              if (!val) {
                props.handleFilterChange('dates', null);
                return;
              }
              props.handleFilterChange('dates', val);
              props.handleFilterChange('month', null);
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
            style={style}
            value={props.filterState.month}
            onChange={(val) => {
              if (!val) {
                props.handleFilterChange('month', null);
                return;
              }
              props.handleFilterChange('dates', null);
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
            style={style}
            placeholder={t('filters.placeholders.0')}
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
            style={style}
            placeholder={t('filters.placeholders.3')}
            onChange={(val) => props.handleFilterChange('text', val.target.value)}
          />
        </Col>
      )}

      {props.statusFilter && (
        <Col>
          <Select
            value={props.filterState.status}
            allowClear
            style={style}
            placeholder={t('filters.placeholders.2')}
            onChange={(val) => props.handleFilterChange('status', val)}
            options={[...transactionStatus].map((c) => ({
              label: t(`transactions.status.${c.name?.toLocaleLowerCase()}`),
              value: c.value.toLocaleLowerCase(),
            }))}
          />
        </Col>
      )}

      {props.byIncome && (
        <Col>
          <Select
            value={props.filterState.byIncome}
            allowClear
            style={style}
            placeholder={'Filter by Income'}
            onChange={(val) => props.handleFilterChange('byIncome', val)}
            options={incomeType}
          />
        </Col>
      )}

      {props.companyFilter && (
        <Col>
          <Select
            value={props.filterState.companyId}
            allowClear
            style={style}
            placeholder={t('filters.placeholders.4')}
            onChange={(val) => props.handleFilterChange('companyId', val)}
            options={Object.entries(SupportedCompaniesTypes).map(([key, val]) => ({
              label: CompaniesNames[val],
              value: key,
            }))}
          />
        </Col>
      )}

      {props.categoryText && (
        <Col>
          <Input
            type="text"
            placeholder={t('filters.placeholders.1')}
            allowClear
            value={props.filterState.name}
            onChange={(val) => props.handleFilterChange('name', val.target.value)}
          />
        </Col>
      )}

      <Col>
        <Button className="reset-btn" onClick={props.resetFilters}>
          {t('filters.reset')}
        </Button>
      </Col>
    </Row>
  )
};