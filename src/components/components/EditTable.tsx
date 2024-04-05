import { Form, Table, Typography, Popconfirm, Row, Col, Divider, Button, TableProps } from "antd";
import { DataType, InvoiceDataType } from "../../utils/types";
import { useNavigate } from "react-router-dom";

interface EditTableProps<T> {
  columns: TableProps<T>['columns'];
  dataSource: any;
  type: string;
  handleAdd?: () => void;
  onEditMode?: (record: any) => void;
  removeHandler?: (record_id: string) => void;
  rowKey: string;
  scrollAble?: boolean;
  isReady?: boolean;
};

export const EditTable = <T extends DataType | InvoiceDataType>(props: EditTableProps<T>) => {
  const [ form ] = Form.useForm();
  const isCategoriesList = props.type === 'categories';
  const componentName = isCategoriesList ? 'Category' : 'Invoice';
  const navigate = useNavigate();


  props.columns.push({
    title: 'Actions',
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
              <Typography.Link onClick={() => navigate({ pathname: '/invoices', hash: record._id })}>
                Add invoice
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
    <Form form={form}>
      <Table
        rowKey={props.rowKey}
        bordered
        columns={props.columns}
        dataSource={props.dataSource}
        rootClassName="editable-row"
        scroll={props.scrollAble ? {x: 600} : {}}
      />
      <Form.Item>
        <Button onClick={props.handleAdd}>Add {componentName}</Button>
      </Form.Item>
    </Form>
  );
};