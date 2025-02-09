import { App, Button, Col, Row } from "antd";
import { CreditCardType } from "../../../utils/types";
import { useState } from "react";
import { useAppSelector } from "../../../redux/store";
import { isArray, isArrayAndNotEmpty } from "../../../utils/helpers";
import { SupportedCompaniesTypes } from "../../../utils/definitions";
import { CheckCircleTwoTone } from "@ant-design/icons";
import transactionsServices from "../../../services/transactions";


interface ImportModalProps {
  card: CreditCardType;
  companyId: string;
}

export const ImportModal = (props: ImportModalProps) => {
  const { card, companyId } = props;
  const { message } = App.useApp();
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [imported, setImported] = useState<{ success: boolean, len: number }>({ success: false, len: 0 });

  const handleClick = async () => {
    setLoading(true);
    const transactions = card.txns;

    if (isArrayAndNotEmpty(transactions)) {
      try {
        const res = await transactionsServices.importTransactions(
          user._id,
          transactions,
          (SupportedCompaniesTypes as any)[companyId]
        );
        if (res && isArray(res)) {
          setImported({ success: true, len: res?.length });
          message.success(`imported transactions: ${res?.length || 0}`);
        }
      } catch (err: any) {
        message.error(err.message);
      }
    }
    setLoading(false);
  };

  return (
    <Row justify={'space-between'} align={'middle'} key={card._id}>
      {imported.success && (
        <Col>
          <CheckCircleTwoTone twoToneColor="#339900" />
        </Col>
      )}
      <Col>{card?.cardNumber}</Col>
      <Col>{card?.txns?.length}/{imported.len}</Col>
      <Col>
        <Button onClick={handleClick} loading={loading} disabled={imported.success}>Import</Button>
      </Col>
    </Row>
  );
};