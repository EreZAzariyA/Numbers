import { useState } from "react";
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
  const [modalResult, setModalResult] = useState<BankAccountModel>(null);

  let modalSubTitle = '';
  if (modalResult) {
    const isCardProvider = modalResult.isCardProvider || false;
    if (!isCardProvider) {
      modalSubTitle = `Account number: ${modalResult.details?.accountNumber} Added. Current balance of ${modalResult.details?.balance} added to your account`;
    } else {
      const creditCards = modalResult.cardsPastOrFutureDebit?.cardsBlock || [];
      modalSubTitle = `${creditCards.length} card added into your account`
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
        onClose={onClose}
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
            title="Successfully Connected To Your Bank Account!"
            subTitle={modalSubTitle}
          />
        )}
      </Modal>
    </>
  );
};