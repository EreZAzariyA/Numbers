import { useTranslation } from "react-i18next";
import CategoryTransactionsModal from "../CategoryTransactionsModal";
import TransactionModel from "../../../models/transaction";
import CategoryModel from "../../../models/category-model";
import { Table, Typography, Popconfirm, Row, Col, Divider, TableProps, App } from "antd";
import React, { useEffect, useState } from "react";
import UserModel from "../../../models/user-model";
import { useAppDispatch } from "../../../redux/store";
import { ColumnsType } from "antd/lib/table";
import transactionsServices from "../../../services/transactions";

interface EditTableProps<T> {
  type?: string;
  editable?: boolean;
  handleAdd?: () => void;
  onEditMode?: (record: T) => void;
  removeHandler?: (record_id: string) => Promise<void>;
  isReady?: boolean;

  user?: UserModel;
  query?: object;
  columns: TableProps<T>['columns']
  style?: React.CSSProperties;
};

export const EditTable = <T extends CategoryModel | TransactionModel>(props: EditTableProps<T>) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { modal, message } = App.useApp();
  const [transactions, setTransactions] = useState<TransactionModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const dispatchTransactions = async () => {
      setLoading(true);
      try {
        const transactions = await transactionsServices.fetchTransactions(props.user._id, null, props.query)
        setTransactions(transactions)
      } catch (err: any) {
        message.error(err);
      }
      setLoading(false);
    };

    dispatchTransactions();
  }, [dispatch, message, props.query, props.user._id]);

  const showModal = (record: CategoryModel) => {
    modal.info({
      icon: null,
      closable: true,
      destroyOnClose: true,
      style: { top: 20 },
      content: <CategoryTransactionsModal category={record} />,
      footer: null
    });
  };

  const columnRender = (record: T) => (
    <Row align={'middle'}>
      {props.type === 'categories' && (
        <>
          <Col>
            <Typography.Link onClick={() => showModal(record as CategoryModel)}>
              {t('actions.0')}
            </Typography.Link>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Typography.Link href={`/transactions/#${record._id}`}>
              {t('actions.1')}
            </Typography.Link>
          </Col>
          <Divider type="vertical" />
        </>
      )}
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

  if (props.editable) {
    props.columns.push({
      title: t('transactions.table.header.actions'),
      key: 'action',
      width: 150,
      render: (_: any, record) => columnRender(record),
    });
  }

  return <Table
    columns={props.columns as ColumnsType<TransactionModel>}
    dataSource={transactions}
    rowKey='_id'
    loading={loading}
    pagination= {{
      hideOnSinglePage: true
    }}
    style={props.style}
    expandable={{
      defaultExpandAllRows: true
    }}
    scroll={{ x: 800 }}
  />
};