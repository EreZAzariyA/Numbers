import InvoiceModel from "../../models/invoice";
import { Graph } from "../components/Charts/Graph";
import { UserBankModel } from "../../models/user-model";
import { Tabs, Typography } from "antd";
import { CompaniesNames } from "../../utils/definitions";
import { isArrayAndNotEmpty } from "../../utils/helpers";
import { ChartsTypes } from "../components/Charts/charts-utils";

interface DashboardThirdProps {
  invoices: InvoiceModel[];
  bankAccount: UserBankModel[];
};

const DashboardThird = (props: DashboardThirdProps) => {

  const banks = props.bankAccount.map((bank) => ({
    label: CompaniesNames[bank.bankName] || bank.bankName,
    key: bank?._id,
    children: <Graph data={bank?.pastOrFutureDebits} type={ChartsTypes.PAST_DEBIT} />
  }));

  return (
    <>
      {isArrayAndNotEmpty(banks) ? (
        <Tabs items={banks}/>
      ) : (
        <>
          <Typography.Text className="sub-title pb-10">Add invoices to track your expenses</Typography.Text>
          <br />
          <br />
          <Graph data={[]} type={null} />
        </>
      )}
    </>
  );
};

export default DashboardThird;