import { useNavigate } from "react-router-dom";
import TransactionModel from "../../models/transaction";
import CategoryModel from "../../models/category-model";
import { Table, Typography, Popconfirm, Row, Col, Divider, TableProps } from "antd";
import { useTranslation } from "react-i18next";

interface EditTableProps<T> {
  type: string;
  handleAdd?: () => void;
  onEditMode?: (record: T) => void;
  removeHandler?: (record_id: string) => Promise<void>;
  isReady?: boolean;
  tableProps: TableProps<T>;
};

export const EditTable = <T extends CategoryModel | TransactionModel>(props: EditTableProps<T>) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  props.tableProps.columns.push({
    title: t('transactions.table.header.actions'),
    key: 'action',
    width: 200,
    render: (_: any, record: any) => (
      <Row align={'middle'}>
        <Col>
          <Typography.Link onClick={() => props.onEditMode(record)}>
            Edit
          </Typography.Link>
        </Col>
        <Divider type="vertical" />
        {props.type === 'categories' && (
          <>
            <Col>
              <Typography.Link onClick={() => navigate({ pathname: '/transactions', hash: record._id })}>
                Add transaction
              </Typography.Link>
            </Col>
            <Divider type="vertical" />
          </>
        )}
        <Col>
          <Popconfirm
            title="Are you sure?"
            onConfirm={() => props.removeHandler(record?._id)}
          >
            <Typography.Link>
              Delete
            </Typography.Link>
          </Popconfirm>
        </Col>
      </Row>
    ),
  });

  return (
    <Table
      {...props.tableProps}
    />
  );
};