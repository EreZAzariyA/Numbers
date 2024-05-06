import { Button, Col, Row, Space, TableProps, message } from "antd";
import { InvoiceDataType } from "../../utils/types";
import { useEffect, useState } from "react";
import NewInvoice from "./newInvoice/newInvoice";
import InvoiceModel from "../../models/invoice";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import invoicesServices from "../../services/invoices";
import { EditTable } from "../components/EditTable";
import { getError } from "../../utils/helpers";
import { useTranslation } from "react-i18next";
import { Filters } from "../components/Filters";
import dayjs, { Dayjs } from "dayjs";
import TotalAmountInput from "../components/TotalAmount";
import { useLocation, useNavigate } from "react-router-dom";
import { TransactionStatuses } from "../../utils/transactions";

enum Steps {
  New_Invoice = "New_Invoice",
  Update_Invoice = "Update_Invoice",
};

const Invoices = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { hash } = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const invoices = useSelector((state: RootState) => (state.invoices));
  const categories = useSelector((state: RootState) => (state.categories));
  const [dataSource, setDataSource] = useState<InvoiceModel[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel>(null);
  const newInvoiceWithCategory_idFromCategories = hash.split('#')?.[1];
  const [step, setStep] = useState<string>(hash ? Steps.New_Invoice : null);
  const [filterState, setFilterState] = useState({
    category_id: null,
    dates: null,
    month: dayjs(),
    status: 'completed'
  });

  useEffect(() => {
    let data = [...invoices];
    if (filterState.category_id) {
      data = data.filter((d) => d.category_id === filterState.category_id)
    }
    if (filterState.dates && filterState.dates.length === 2) {
      data = data.filter((d) => (
        dayjs(d.date).valueOf() >= dayjs(filterState.dates[0]).startOf('day').valueOf() &&
        dayjs(d.date).valueOf() <= dayjs(filterState.dates[1]).endOf('day').valueOf()
      ))
    }
    if (filterState.month) {
      data = data.filter((d) => (
        dayjs(d.date).valueOf() >= dayjs(filterState.month).startOf('month').valueOf() &&
        dayjs(d.date).valueOf() <= dayjs(filterState.month).endOf('month').valueOf()
      ))
    }
    if (filterState.status) {
      data = data.filter((d) => d.status === filterState.status)
    }
    setDataSource(data);
  }, [filterState, invoices]);

  const onFinish = async (invoice: InvoiceModel) => {
    if (!user) {
      message.error("User id is missing");
      return;
    }

    try {
      invoice.user_id = user._id;
      let res = null;
      let msg = ''
      if (step === Steps.Update_Invoice) {
        res = await invoicesServices.updateInvoice(invoice);
        msg = 'Invoice updated successfully...';
      } else {
        res = await invoicesServices.addInvoice(invoice);
        msg = 'Invoice added successfully'
      }

      if (res) {
        message.success(msg);
        if (newInvoiceWithCategory_idFromCategories) {
          navigate('/invoices');
        }
        onBack();
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const onBack = () => {
    setStep(null);
    setSelectedInvoice(null);
  };

  const onEdit = (record: InvoiceModel) => {
    setSelectedInvoice(record);
    setStep(Steps.Update_Invoice);
  };

  const onRemove = async (record_id: string): Promise<void> => {
    try {
      await invoicesServices.removeInvoice(record_id);
      message.success('Invoice removed...');
    } catch (err: any) {
      message.error(getError(err));
    }
  };

  const handleFilterChange = (field: string, value: string | number[] | Dayjs[]): void => {
    setFilterState({ ...filterState, [field]: value });
  };

  const resetFilters = () => {
    setFilterState({
      category_id: null,
      dates: [],
      month: dayjs(),
      status: 'completed'
    });
  };

  const columns: TableProps<InvoiceDataType>['columns'] = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => (
        <span>{new Date(text).toLocaleDateString()}</span>
      ),
      sorter: (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      defaultSortOrder: 'ascend'
    },
    {
      title: 'Category',
      dataIndex: 'category_id',
      key: 'category',
      render:(value) => {
        const category = categories.find((c) => c._id === value);
        return (
          <span>{category?.name}</span>
        );
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (val) => {
        return (TransactionStatuses as any)[val]
      }
    }
  ];

  return (
    <div className="page-container invoices">
      <div className="title-container">
        <div className="page-title">{t('pages.invoices')}</div>
        {step && (
          <Button className="btn-18" type="text" size="small" onClick={onBack}>Back</Button>
        )}
      </div>
      <div className="page-inner-container">
        {!step && (
          <Space direction="vertical" className="w-100">
            <Row justify={'space-between'} wrap={false} gutter={[10, 5]}>
              <Col>
                <Filters
                  datesFilter
                  monthFilter
                  categoryFilter
                  statusFilter
                  filterState={filterState}
                  handleFilterChange={handleFilterChange}
                  resetFilters={resetFilters}
                />
              </Col>
              <Col span={8}>
                <TotalAmountInput invoices={dataSource} />
              </Col>
            </Row>
            <EditTable
              columns={columns}
              dataSource={dataSource}
              rowKey="_id"
              scrollAble
              type="invoices"
              onEditMode={onEdit}
              removeHandler={onRemove}
            />
            <Button className="btn-18" onClick={() => setStep(Steps.New_Invoice)}>
              Add Invoice
            </Button>
          </Space>
        )}
        {(step && step === Steps.New_Invoice) && (
          <NewInvoice
            onFinish={onFinish}
            categories={categories}
            newInvoiceCategoryId={newInvoiceWithCategory_idFromCategories}
          />
        )}
        {(step && step === Steps.Update_Invoice) && (
          <NewInvoice
            onFinish={onFinish}
            categories={categories}
            invoice={selectedInvoice}
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;