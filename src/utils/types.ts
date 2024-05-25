import { MenuProps } from "antd";

export type MenuItem = Required<MenuProps>['items'][number];
export const getMenuItem = (
  label: React.ReactNode,
  key?: React.Key | null,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
  value?: string
): MenuItem  => {
  return {
    key,
    icon,
    children,
    label,
    type,
    value
  } as MenuItem;
};

export interface DataType {
  _id: string;
  name: string;
  editable: boolean;
};

export interface InvoiceDataType {
  _id: string;
  date: Date;
  category: string;
  description: string
  amount: number;
  editable: boolean;
};