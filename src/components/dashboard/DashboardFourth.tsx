import TransactionModel from "../../models/transaction";
import { Graph } from "../components/Charts/Graph";
import { Tabs, Typography } from "antd";
import { getCompanyName, isArrayAndNotEmpty } from "../../utils/helpers";
import { ChartsTypes } from "../components/Charts/charts-utils";
import { BankAccountModel } from "../../models/bank-model";

interface DashboardFourthProps {
  transactions: TransactionModel[];
  bankAccount: BankAccountModel[];
};

const DashboardFourth = (props: DashboardFourthProps) => {

  const banks = props.bankAccount.map((bank) => ({
    label: getCompanyName(bank.bankName),
    key: bank?._id,
    children: <Graph data={bank?.pastOrFutureDebits} type={ChartsTypes.PAST_DEBIT} />
  }));

  return (
    <div className="home-fourth-main-container home-component">
      {isArrayAndNotEmpty(banks) ? (
        <Tabs items={banks}/>
      ) : (
        <>
          <Typography.Text className="sub-title pb-10">Add transactions to track your expenses</Typography.Text>
          <br />
          <br />
          <Graph data={[]} type={null} />
        </>
      )}
    </div>
  );
};

export default DashboardFourth;