import { useState } from "react";
import { useTranslation } from "react-i18next";
import ConnectBankForm, { ConnectBankFormType } from "../bank-page/ConnectBankForm";
import { BankAccountModel } from "../../models/bank-model";
import UserModel from "../../models/user-model";
import { Modal, ModalProps, Result } from "antd";

interface ConnectBankModelProps {
  modalProps: ModalProps;
  formType: ConnectBankFormType.Connect_Bank | ConnectBankFormType.Update_Bank,
  user?: UserModel;
  bank?: BankAccountModel;
  setIsOkBtnActive?: (isActive: boolean) => void;
  setIsOpen: (val: boolean) => void;
}

export const ConnectBankModel = (props: ConnectBankModelProps) => {
  const { t } = useTranslation();
  const [modalResult, setModalResult] = useState<BankAccountModel>(null);

  let modalSubTitle = '';
  if (modalResult) {
    const isCardProvider = modalResult.isCardProvider || false;
    if (!isCardProvider) {
      modalSubTitle = t('connectBank.successAccountSubtitle', {
        accountNumber: modalResult.details?.accountNumber,
        balance: modalResult.details?.balance,
      });
    } else {
      const creditCards = modalResult.cardsPastOrFutureDebit?.cardsBlock || [];
      modalSubTitle = t('connectBank.successCardsSubtitle', { count: creditCards.length });
    }
  }

  const onClose = () => {
    setModalResult(null);
    props.setIsOpen(false);
  }

  return (
    <>
      <Modal
        {...props.modalProps}
        width={400}
        footer={modalResult ? false : undefined}
        onCancel={onClose}
      >
        {!modalResult ? (
          <ConnectBankForm
            user={props.user}
            bankDetails={props.bank}
            formType={props.formType}
            setIsOkBtnActive={props?.setIsOkBtnActive}
            setResult={setModalResult}
          />
        ) : (
          <Result
            status="success"
            title={t('connectBank.successTitle')}
            subTitle={modalSubTitle}
          />
        )}
      </Modal>
    </>
  );
};
