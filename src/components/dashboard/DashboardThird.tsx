import InvoiceModel from "../../models/invoice";
import { Graph } from "../components/Graph";
import { UserBankModel } from "../../models/user-model";
import { Tabs } from "antd";
import { CompaniesNames } from "../../utils/definitions";
import { isArrayAndNotEmpty } from "../../utils/helpers";

interface DashboardThirdProps {
  invoices: InvoiceModel[];
  bankAccount: UserBankModel[];
};

const DashboardThird = (props: DashboardThirdProps) => {

  const banks = props.bankAccount.map((bank) => ({
    label: CompaniesNames[bank.bankName] || bank.bankName,
    key: bank?._id,
    children: <Graph pastOrFutureDebits={bank?.pastOrFutureDebits} />
  }));

  return (
    <>
      {isArrayAndNotEmpty(banks) ? (
        <Tabs items={banks}/>
      ) : (
        <Graph pastOrFutureDebits={[]} />
      )}
    </>
  );
};

export default DashboardThird;