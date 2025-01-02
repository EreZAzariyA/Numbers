import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import { getCompanyName, getTransactionsByCategory, useResize } from "../../utils/helpers";
import { TransactionStatuses, TransactionsType } from "../../utils/transactions";
import { SupportedCompaniesTypes } from "../../utils/definitions";
import { DefaultOptionType } from "antd/es/select";
import { Button, Col, DatePicker, Flex, Input, Row, Select, Tooltip } from "antd";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";
import { Languages } from "../../utils/enums";

interface FiltersProps {
  byTransType?: boolean;
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

export const Filters = (props: FiltersProps) => {
  const { t } = useTranslation();
  const { isPhone, isMobile } = useResize();
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const style: React.CSSProperties = {
    width: (isMobile ? 200 : 250)
  };
  const { categories, loading } = useAppSelector((state) => state.categories);
  const { lang } = useAppSelector((state) => state.config.language);
  const mappedCategories = categories.map((category) => {
    const transactions = getTransactionsByCategory(category._id);
    return {
      label: (
        <Row justify={'space-between'}>
          <Col>{category.name}</Col>
          <Col><small>{transactions.length}</small></Col>
        </Row>
      ),
      value: category._id,
      transactions
    }
  }).sort((a, b) => (b.transactions.length - a.transactions.length))

  const withCollapse = [
    props.datesFilter,
    props.monthFilter,
    props.categoryFilter,
    props.statusFilter,
    props.textFilter,
    props.companyFilter,
    props.byIncome,
    props.categoryText,
  ].filter(Boolean).length > 4;

  const handleCollapse = () => setCollapsed(!collapsed);
  const isEN = lang === Languages.EN;

  return (
    <Row align={'middle'} justify={'start'} gutter={[10, 10]} className={`filters ${collapsed ? 'collapsed' : ''}`}>
      <Col style={withCollapse && { width: (isMobile ? 210 : 260) }}>
        <Flex>
          {withCollapse && (
            <Tooltip title="More filters">
              <Button
                type="text"
                className={`icon-btn ${isEN ? 'en' : ''}`}
                icon={isEN ? <RightOutlined /> : <LeftOutlined />}
                onClick={handleCollapse}
              />
            </Tooltip>
          )}
          {props.monthFilter && (
            <DatePicker
              picker="month"
              maxDate={dayjs()}
              allowClear={!isPhone}
              style={{ width: '100%' }}
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
          )}
        </Flex>
      </Col>

      {props.byTransType && (
        <Col>
          <Select
            value={props.filterState.type}
            allowClear
            style={style}
            placeholder={t('filters.placeholders.4')}
            onChange={(val) => props.handleFilterChange('type', val)}
            options={[TransactionsType.ACCOUNT, TransactionsType.CARD_TRANSACTIONS].map((c) => ({
              label: t(`transactions.transactionsType.${c.toLocaleLowerCase()}`),
              value: c.toLocaleLowerCase(),
            }))}
          />
        </Col>
      )}

      {props.datesFilter && (
        <Col>
          <DatePicker.RangePicker
            id="datesFilter"
            allowClear
            style={style}
            value={props.filterState.dates}
            maxDate={dayjs()}
            onChange={(val) => {
              // if (!val) {
              //   props.handleFilterChange('dates', null);
              //   return;
              // }
              props.handleFilterChange('dates', val);
              props.handleFilterChange('month', null);
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
            maxTagCount='responsive'
            options={mappedCategories}
            loading={loading}
          />
        </Col>
      )}

      {props.textFilter && (
        <Col>
          <Input
            id="textFilter"
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
              label: getCompanyName(val),
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
  );
};