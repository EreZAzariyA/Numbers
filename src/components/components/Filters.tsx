import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../redux/store";
import { getCompanyName } from "../../utils/helpers";
import { TransactionStatuses, TransactionsType } from "../../utils/transactions";
import { SupportedCompaniesTypes } from "../../utils/definitions";
import { DefaultOptionType } from "antd/es/select";
import { Button, Col, DatePicker, Flex, Grid, Input, Row, Select, Tooltip } from "antd";
import LeftOutlined from "@ant-design/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons/RightOutlined";
import { Languages } from "../../utils/enums";
import { useQuery } from "@tanstack/react-query";
import CategoryModel from "../../models/category-model";
import categoriesServices from "../../services/categories";
import { CreditCardType } from "../../utils/types";

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
  cards?: CreditCardType[];
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
  const screen = Grid.useBreakpoint();
  const { t } = useTranslation();
  const isPhone  = !screen.xs;
  const  isMobile = !screen.md;
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const style: React.CSSProperties = {
    width: (isMobile ? 200 : 250)
  };
  const { lang } = useAppSelector((state) => state.config.language);
  const user = useAppSelector((state) => state.auth?.user);
  const isCardTransactions = props.filterState.type === TransactionsType.CARD_TRANSACTIONS;

  const fetchCategories = async () => await categoriesServices.fetchCategories(user._id);
  const { data: categories = [], isLoading: loading } = useQuery<CategoryModel[]>({ queryKey: ['categories', user._id], queryFn: fetchCategories });

  const mappedCategories = categories.map((category) => {
    return {
      label: (
        <Row justify={'space-between'}>
          <Col>{category.name}</Col>
          <Col><small>{category.transactions}</small></Col>
        </Row>
      ),
      value: category._id,
      transactions: category.transactions,
    }
  }).sort((a, b) => (b.transactions - a.transactions))
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

  const cardOptions: DefaultOptionType[] = props.cards?.map((card) => ({
    label: `** ${card.cardNumber}`,
    value: card.cardNumber,
  }));

  const handleCollapse = () => setCollapsed(!collapsed);
  const isEN = lang === Languages.EN;
  return (
    <Row align={'middle'} justify={'start'} gutter={[10, 10]} className={`filters ${collapsed ? 'collapsed' : ''}`}>
      <Col style={withCollapse && { width: (isMobile ? 210 : 260) }}>
        <Flex>
          {withCollapse && (
            <Tooltip title="More filters" placement="topLeft">
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
              value: c,
            }))}
          />
        </Col>
      )}

      {isCardTransactions && (
        <Col>
          <Select
            value={props.filterState.card}
            allowClear
            style={style}
            placeholder={'Filter by Card'}
            onChange={(val) => props.handleFilterChange('cardNumber', val)}
            options={cardOptions}
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

      {!!props.filterState.dates && (
        <Col>
          <DatePicker.RangePicker
            id="datesFilter"
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