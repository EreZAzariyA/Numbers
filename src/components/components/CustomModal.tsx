import { Modal, ModalProps } from "antd";

export const CustomModal = (props: ModalProps) => {
  return (
    <Modal
      {...props}
      destroyOnClose
      closable
    >
      {props.children}
    </Modal>
  );
};