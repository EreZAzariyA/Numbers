import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import TransactionModel from "../../../models/transaction";
import { Table, Typography, Popconfirm, Row, Col, Divider, TableProps, Flex, Pagination, Space, PaginationProps } from "antd";
import transactionsServices, { TransactionsResp } from "../../../services/transactions";
import { queryFiltering } from "../../../utils/helpers";
import { useAppSelector } from "../../../redux/store";
import { useBanks } from "../../../hooks/useBanks";
import { Filters } from "../Filters";
import { Dayjs } from "dayjs";
import { TransType, TransactionsType } from "../../../utils/transactions";
import { TotalsContainer } from "../TotalsContainer";
import { useQuery } from "@tanstack/react-query";
import CardTransactionModel from "../../../models/card-transaction";
import { getAccountCreditCards } from "../../../utils/bank-utils";
import { getDefaultTransactionFilterState } from "../../../hooks/useTransactionFilters";

interface EditTableProps<T> {
  tableProps: TableProps<T>;
  paginationProps: PaginationProps;
  editable: boolean;
  filterState: any;
  setFilterState: (updater: any) => void;

  query: object;
  type: TransType;

  totals: boolean;
  actionButton: ReactNode;
  handleAdd: () => void;
  onEditMode: (record: T) => void;
  removeHandler: (record_id: string) => Promise<void>;
};

export const EditTable = <T extends (CardTransactionModel | TransactionModel)>(props: Partial<EditTableProps<T>>) => {
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);
  const { data: account } = useBanks();
  const cards = getAccountCreditCards(account);

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const type = props.type || props.filterState.type;
  const skip = (page - 1) * pageSize;
  const query = props.query || queryFiltering(props.filterState, { skip, limit: pageSize });

  const { data, isLoading } = useQuery<TransactionsResp>({
    queryKey: ['transactions', user?._id, props.filterState, query],
    queryFn: () => transactionsServices.fetchTransactions(user?._id, query, type),
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    gcTime: 1000 * 2,
    enabled: !!user?._id,
  });

  const handleFilterChange = (field: string, value: string | string[] | Dayjs | [Dayjs, Dayjs] | null): void => {
    props.setFilterState((currentFilters: any) => {
      const nextFilters = {
        ...currentFilters,
        [field]: value,
      };

      if (field === "month" && value) {
        nextFilters.dates = null;
      }

      if (field === "dates" && value) {
        nextFilters.month = null;
      }

      if (field === "type" && value !== TransactionsType.CARD_TRANSACTIONS) {
        nextFilters.cardNumber = null;
      }

      return nextFilters;
    });
    setPage(1);
  };

  const resetFilters = () => {
    props.setFilterState(getDefaultTransactionFilterState());
    setPage(1);
  };

  const actionsColumnRender = (record: T) => (
    <Row align={'middle'}>
      <Col>
        <Typography.Link onClick={() => props.onEditMode(record)}>
          {t('actions.2')}
        </Typography.Link>
      </Col>
      <Divider type="vertical" />
      <Col>
        <Popconfirm
          title={t('common.messages.confirm')}
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
      render: (_: any, record: T) => actionsColumnRender(record),
    } : {})]
  ];

  return (
    <Space direction="vertical" size={"middle"}>
      <Flex align="flex-start" justify="space-between" gap={10}>
        {props.filterState && (
          <Filters
            type="transactions"
            cards={cards}
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
          <TotalsContainer filterState={props.filterState} type={type} />
        )}
      </Flex>
      <Table
        {...props.tableProps}
        dataSource={data?.transactions as T[]}
        columns={columns}
        rowKey='_id'
        loading={isLoading}
        pagination={false}
      />

      <Flex justify="space-between">
        {props?.actionButton && (
          props.actionButton
        )}
        <Pagination
          pageSize={pageSize}
          current={page}
          showSizeChanger
          total={props.query ? data?.transactions?.length : data?.total}
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
