import { Typography } from "antd";
import { CompanyTypes, SCRAPERS } from "../../utils/definitions";


interface BankAccountPageProps {
  bankAccount: any;
};

const BankAccountPage = (props: BankAccountPageProps) => {
  console.log(props.bankAccount);
  
  return (
    <div>
      <Typography.Title level={4} style={{ margin: 0 }}>
        {(SCRAPERS as any)[props.bankAccount.bankName]?.name || props.bankAccount?.bankName}
      </Typography.Title>
    </div>
  );
};

export default BankAccountPage;