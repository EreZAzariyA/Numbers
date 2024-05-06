import { Modal } from "antd";
import { ReactNode } from "react";

interface ModalProps {
  type?: string;
  title?: string;
  isOpen: boolean;
  children: ReactNode;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string
};

const CustomModal = (props: ModalProps) => {
  return (
    <Modal
      title={props.title || 'Modal'}
      open={props.isOpen}
      onOk={props.onOk}
      onCancel={props.onCancel}
      okText={props.okText}
    >
      {props.children}
    </Modal>
  );
};

export default CustomModal;