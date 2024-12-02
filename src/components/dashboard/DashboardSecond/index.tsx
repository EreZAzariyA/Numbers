import dayjs, { Dayjs } from "dayjs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";
import TransactionModel from "../../../models/transaction";
import UserModel from "../../../models/user-model";
import { EditTable } from "../../components/EditTable";
import { asNumString, filterInvoicesByStatus, isArrayAndNotEmpty } from "../../../utils/helpers";
import { TransactionStatusesType } from "../../../utils/transactions";
import { Tooltip } from "antd";
import { TableProps } from "antd/lib";
import "./DashboardSecond.css";

interface DashboardSecondProps<T> {
  user: UserModel;
  transactions: T[];
  transactionsByMonth?: T[];
  monthToDisplay: Dayjs;
};

const DashboardSecond = <T extends TransactionModel>(props: DashboardSecondProps<T>) => {
  const { t } = useTranslation();
  const { loading } = useAppSelector((state) => state.transactions);
  let dataSource: TransactionModel[] = [];

  if (isArrayAndNotEmpty(props.transactions)) {
    dataSource  = filterInvoicesByStatus(props.transactions, TransactionStatusesType.COMPLETED);
    dataSource = [...dataSource].slice(0, 6);
  }

  const columns: TableProps<TransactionModel>['columns'] = [
    {
      title: t('transactions.table.header.date'),
      dataIndex: 'date',
      key: 'date',
      width: '33.3%',
      sorter: (a, b) => (dayjs(b.date).valueOf() - dayjs(a.date).valueOf()),
      defaultSortOrder: 'ascend',
      render: (text, r) => (
        <span>{new Date(text).toLocaleDateString()}</span>
      ),
    },
    {
      title: t('transactions.table.header.description'),
      dataIndex: 'description',
      key: 'description',
      width: '33.3%',
      ellipsis: {
        showTitle: false
      },
      render: (text) => (
        <Tooltip title={text}>
          {text}
        </Tooltip>
      )
    },
    {
      title: t('transactions.table.header.amount'),
      dataIndex: 'amount',
      key: 'amount',
      width: '33.3%',
      render: (val) => (
        asNumString(val)
      )
    },
  ];

  return (
    <div className="home-seconde-main-container home-component">
      <div className="card-container">
        <div className="card-title-container">
          <div className="card-title">
            {t('dashboard.second.0')}
          </div>
          <div className="action">
            <Link to={'/transactions'}>
              {t('dashboard.second.1')}
            </Link>
          </div>
        </div>
        <div className="card-body">
          <EditTable
            tableProps={{
              columns,
              dataSource,
              loading,
              pagination: {
                hideOnSinglePage: true
              },
              style: {
                borderRadius: 0
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSecond;