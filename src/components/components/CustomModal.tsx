import { useState } from "react";
import ConnectBankForm, { ConnectBankFormType } from "../bank-page/ConnectBankForm";
import { BankAccountDetails, BankAccountModel } from "../../models/bank-model";
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
  const [modalResult, setModalResult] = useState<BankAccountDetails>(null);

  const isCardProvider = modalResult?.bank?.isCardProvider;
  let modalSubTitle = `Account number: ${modalResult?.account?.accountNumber || modalResult?.account?.cardNumber} Added. Current balance of ${modalResult?.account?.balance} added to your account`;
  if (isCardProvider) {
    const creditCards = modalResult?.account?.creditCards;
    modalSubTitle = `${creditCards?.length} card added into your account`
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
        {!modalResult && (
          <ConnectBankForm
            user={props.user}
            bankDetails={props.bank}
            formType={props.formType}
            setIsOkBtnActive={props?.setIsOkBtnActive}
            setResult={setModalResult}
          />
        )}
        {modalResult?.account && (
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