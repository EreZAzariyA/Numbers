import { ButtonProps, Modal } from "antd";
import { ReactNode } from "react";

interface ModalProps {
  type?: string;
  title?: string;
  isOpen: boolean;
  children: ReactNode;
  onOk?: () => void;
  okText?: string;
  okButtonProps: ButtonProps;
  cancelButtonProps: ButtonProps;
};

export const CustomModal = (props: ModalProps) => {
  return (
    <Modal
      title={props.title || 'Modal'}
      open={props.isOpen}
      onOk={props.onOk}
      okText={props.okText}
      cancelButtonProps={props.cancelButtonProps}
      okButtonProps={props.okButtonProps}
    >
      {props.children}
    </Modal>
  );
};

export default CustomModal;