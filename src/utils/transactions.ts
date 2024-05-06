import { jwtDecode } from "jwt-decode";
import bankServices from "../services/banks";
import { Modal, message } from "antd";

const { confirm } = Modal;

export enum TransactionStatuses {
  completed = "Completed",
  pending = "Pending"
};

export const fetchBankAccountData = async (detailsToken?: any, defaultDetails?: any, user_id?: string, setLoading?: (isLoading: boolean) => void,  setConfirm?: boolean, setRes?: (res: any) => void ): Promise<any> => {
  if (setLoading) {
    setLoading(true);
  }
  if (user_id) {
    try {
      let details = defaultDetails;
      if (detailsToken) {
        details = await jwtDecode(detailsToken);
      }

      const res = await bankServices.fetchBankData({...details}, user_id);
      if (setConfirm && res.account && res.account?.txns && res.account.txns?.length) {
        showTransImportConfirmation(res.account?.txns, user_id);
      }
      if (setRes) {
        setRes(res);
      }
      setLoading(false);
      return res;
    } catch (err: any) {
      message.error(err.message);
    }
  }
};


export const showTransImportConfirmation = async (transactions: any, user_id: string) => {
  confirm({
    okText: 'Import',
    onOk: () => onTransactionsImportOk(transactions, user_id),
    content: `We found ${transactions.length} invoices, would you like to import them?`
  });
};

export const onTransactionsImportOk = async (transactions: any[], user_id: string) => {
  try {
    const res = await bankServices.importTrans(transactions, user_id);
    if (res) {
      message.success('OK');
    }
  } catch (err: any) {
    message.error(err);
  }
};