import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CategoryModal from "./CategoryModal";
import TransactionModel from "../../../models/transaction";
import CategoryModel from "../../../models/category-model";
import Modal from "antd/es/modal/Modal";
import { Table, Typography, Popconfirm, Row, Col, Divider, TableProps } from "antd";

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
  const [open, setOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryModel>(null);

  const columnRender = (record: T) => (
    <Row align={'middle'}>
      {props.type === 'categories' && (
        <>
          <Col>
            <Typography.Link onClick={() => {
              setOpen(true);
              setSelectedCategory(record as CategoryModel);
            }}>
              {t('actions.0')}
            </Typography.Link>
          </Col>
          <Divider type="vertical" />
          <Col>
            <Typography.Link onClick={() => navigate({ pathname: '/transactions', hash: record._id })}>
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

  props.tableProps.columns.push({
    title: t('transactions.table.header.actions'),
    key: 'action',
    width: 150,
    render: (_: any, record) => columnRender(record),
  });

  return (
    <>
      <Table {...props.tableProps} />

      <Modal
        destroyOnClose
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <CategoryModal loading={!selectedCategory} category={selectedCategory} />
      </Modal>
    </>
  );
};