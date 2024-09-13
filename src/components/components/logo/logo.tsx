import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../redux/store";
import { ThemeColors } from "../../../utils/enums";
import logoLight from "../../../assets/logo/logo-light.png";
import logoDark from "../../../assets/logo/logo-dark.png";
import "./logo.css";

const Logo = () => {
  const navigate = useNavigate();
  const { theme } = useAppSelector((state) => state.config.themeColor);

  return (
    <div className="logo" onClick={() => navigate('/dashboard')}>
      {theme === ThemeColors.LIGHT && (
        <img src={logoLight} alt="light-logo" />
      )}
      {theme === ThemeColors.DARK && (
        <img src={logoDark} alt="dark-logo" />
      )}
    </div>
  );
};

export default Logo;