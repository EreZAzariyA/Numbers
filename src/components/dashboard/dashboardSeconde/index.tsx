import { useSelector } from "react-redux";
import "./dashboardSeconde.css";
import { RootState } from "../../../redux/store";
import InvoiceModel from "../../../models/invoice";

interface DashboardSecondeProps {
  invoices: InvoiceModel[];
};

const DashboardSeconde = (props: DashboardSecondeProps) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="home-seconde-main-container home-component">
      Seconde
    </div>
  )
};

export default DashboardSeconde;