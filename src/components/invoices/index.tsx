import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../../redux/store";
import NewInvoice from "./newInvoice/newInvoice";
import { EditTable } from "../components/EditTable";
import { Filters } from "../components/Filters";
import TotalAmountInput from "../components/TotalAmount";
import InvoiceModel from "../../models/invoice";
import invoicesServices from "../../services/invoices";
import { InvoiceDataType } from "../../utils/types";
import { asNumString, getError } from "../../utils/helpers";
import { TransactionStatuses } from "../../utils/transactions";
import { TotalAmountType } from "../../utils/enums";
import { Button, Col, Row, Space, TableProps, message } from "antd";

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
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel>(null);
  const newInvoiceWithCategory_idFromCategories = hash.split('#')?.[1];
  const [step, setStep] = useState<string>(hash ? Steps.New_Invoice : null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterState, setFilterState] = useState({
    category_id: null,
    dates: null,
    month: dayjs(),
    status: 'completed',
    text: null
  });

  const onFinish = async (invoice: Partial<InvoiceModel>) => {
    if (!user) {
      message.error("User id is missing");
      return;
    }

    setIsLoading(true);
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
    setIsLoading(false);
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
      status: 'completed',
      text: null
    });
  };

  let data = [...invoices];
  if (filterState.category_id) {
    data = data.filter((d) => d.category_id === filterState.category_id);
  }
  if (filterState.dates && filterState.dates.length === 2) {
    data = data.filter((d) => (
      dayjs(d.date).valueOf() >= dayjs(filterState.dates[0]).startOf('day').valueOf() &&
      dayjs(d.date).valueOf() <= dayjs(filterState.dates[1]).endOf('day').valueOf()
    ));
  }
  if (filterState.month) {
    data = data.filter((d) => (
      dayjs(d.date).valueOf() >= dayjs(filterState.month).startOf('month').valueOf() &&
      dayjs(d.date).valueOf() <= dayjs(filterState.month).endOf('month').valueOf()
    ));
  }
  if (filterState.status) {
    data = data.filter((d) => d.status === filterState.status);
  }
  if (filterState.text) {
    data = data.filter((d) => d.description.startsWith(filterState.text));
  }

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
      width: 250
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (val) => (
        asNumString(val)
      )
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
          <Button danger className="btn-18" type="link" size="small" onClick={onBack}>Back</Button>
        )}
      </div>
      <div className="page-inner-container">
        {!step && (
          <Space direction="vertical" className="w-100">
            <Row justify={'space-between'} align={'middle'} wrap={false} gutter={[10, 5]}>
              <Col>
                <Filters
                  datesFilter
                  monthFilter
                  categoryFilter
                  statusFilter
                  textFilter
                  filterState={filterState}
                  handleFilterChange={handleFilterChange}
                  resetFilters={resetFilters}
                />
              </Col>
              <Col>
                <Space direction="vertical">
                  <TotalAmountInput invoices={data} type={TotalAmountType.SPENT} />
                  <TotalAmountInput invoices={data} type={TotalAmountType.INCOME} />
                </Space>
              </Col>
            </Row>
            <EditTable
              columns={columns}
              dataSource={data}
              rowKey="_id"
              scrollAble
              type="invoices"
              onEditMode={onEdit}
              removeHandler={onRemove}
            />
            <Button onClick={() => setStep(Steps.New_Invoice)}>
              Add Invoice
            </Button>
          </Space>
        )}
        {(step && step === Steps.New_Invoice) && (
          <NewInvoice
            onFinish={onFinish}
            categories={categories}
            newInvoiceCategoryId={newInvoiceWithCategory_idFromCategories}
            isLoading={isLoading}
          />
        )}
        {(step && step === Steps.Update_Invoice) && (
          <NewInvoice
            onFinish={onFinish}
            categories={categories}
            invoice={selectedInvoice}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default Invoices;