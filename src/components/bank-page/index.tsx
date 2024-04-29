import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const BankPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="500"
      title="In Build..."
      subTitle="Sorry, Page still in build."
      extra={<Button type="primary" onClick={() => navigate('/dashboard')}>Back Home</Button>}
    />
  );
};

export default BankPage;