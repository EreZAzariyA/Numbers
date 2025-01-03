import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TransactionModel from "../../../models/transaction";
import { Table, Typography, Popconfirm, Row, Col, Divider, TableProps, App, Flex, Pagination, Grid, Space } from "antd";
import transactionsServices from "../../../services/transactions";
import { queryFiltering } from "../../../utils/helpers";
import { useAppSelector } from "../../../redux/store";
import { Filters } from "../Filters";
import dayjs, { Dayjs } from "dayjs";
import { TransactionStatusesType, TransType } from "../../../utils/transactions";
import { TotalsContainer } from "../TotalsContainer";

interface EditTableProps<T> {
  tableProps?: TableProps<T>;
  editable?: boolean;
  filterState?: object;
  setFilterState?: (object: any) => void;

  query?: object;
  type?: TransType;

  totals?: boolean;
  actionButton?: ReactNode;
  handleAdd?: () => void;
  onEditMode?: (record: T) => void;
  removeHandler?: (record_id: string) => Promise<void>;
};

export const EditTable = <T extends TransactionModel>(props: EditTableProps<T>) => {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const screen = Grid.useBreakpoint();
  const user = useAppSelector((state) => state.auth.user);

  const [transactions, setTransactions] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const dispatchTransactions = async () => {
      const query = props.query || queryFiltering(props.filterState, { skip: (page - 1) * pageSize, limit: pageSize });
      setLoading(true);

      try {
        const { transactions, total } = await transactionsServices.fetchTransactions(user?._id, query, props.type);
        setTransactions(transactions as T[]);
        setTotal(props.query ? transactions?.length : total);
      } catch (err: any) {
        message.error(err);
      }
      setLoading(false);
    };

    dispatchTransactions();
  }, [page, pageSize, props.filterState, message, user._id, props.query, props.type]);

  useEffect(() => {
    setPage(1);
  }, [props.type]);

  const handleFilterChange = (field: string, value: string | number[] | Dayjs[] | Dayjs): void => {
    props.setFilterState({ ...props.filterState, [field]: value });
    setPage(1);
  };

  const resetFilters = () => {
    props.setFilterState({
      month: dayjs(),
      status: TransactionStatusesType.COMPLETED
    });
  };

  const columnRender = (record: T) => (
    <Row align={'middle'}>
      <Col>
        <Typography.Link onClick={() => props.onEditMode(record)}>
          {t('actions.2')}
        </Typography.Link>
      </Col>
      <Divider type="vertical" />
      <Col>
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => props.removeHandler(record?._id)}
        >
          <Typography.Link>
            {t('actions.3')}
          </Typography.Link>
        </Popconfirm>
      </Col>
    </Row>
  );

  const columns = [
    ...props.tableProps.columns,
    ...[(props.editable ? {
      title: t('transactions.table.header.actions'),
      key: 'action',
      width: 150,
      render: (_: any, record: T) => columnRender(record),
    } : {})]
  ];

  return (
    <Space direction="vertical" size={"middle"}>
      <Flex align="flex-start" gap={10} wrap={screen.xs}>
        {props.filterState && (
          <Filters
            type="transactions"
            byTransType
            datesFilter
            monthFilter
            categoryFilter
            statusFilter
            textFilter
            companyFilter
            byIncome
            filterState={props.filterState}
            handleFilterChange={handleFilterChange}
            resetFilters={resetFilters}
          />
        )}
        {props.totals && (
          <TotalsContainer filterState={props.filterState} type={props.type} />
        )}
      </Flex>
      <Table
        {...props.tableProps}
        dataSource={transactions}
        columns={columns}
        rowKey='_id'
        loading={loading}
        pagination={false}
      />

      <Flex justify="space-between">
        {props?.actionButton && (
          props.actionButton
        )}
        <Pagination
          pageSize={pageSize}
          current={page}
          total={total}
          hideOnSinglePage
          onChange={(page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          }}
        />
      </Flex>
    </Space>
  );
};