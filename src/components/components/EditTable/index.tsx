import { useTranslation } from "react-i18next";
import CategoryTransactionsModal from "../CategoryTransactionsModal";
import TransactionModel from "../../../models/transaction";
import CategoryModel from "../../../models/category-model";
import { Table, Typography, Popconfirm, Row, Col, Divider, TableProps, App } from "antd";

interface EditTableProps<T> {
  type?: string;
  editable?: boolean;
  handleAdd?: () => void;
  onEditMode?: (record: T) => void;
  removeHandler?: (record_id: string) => Promise<void>;
  isReady?: boolean;
  tableProps: TableProps<T>;
};

export const EditTable = <T extends CategoryModel | TransactionModel>(props: EditTableProps<T>) => {
  const { modal } = App.useApp();
  const { t } = useTranslation();

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
    props.tableProps.columns.push({
      title: t('transactions.table.header.actions'),
      key: 'action',
      width: 150,
      render: (_: any, record) => columnRender(record),
    });
  }

  return <Table {...props.tableProps} />
};