import "./logo.css";
import logoLight from "../../../assets/logo/logo-light.png";
import logoDark from "../../../assets/logo/logo-dark.png";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { ThemeColors } from "../../../redux/slicers/theme-slicer";


const Logo = () => {
  const navigate = useNavigate();
  const theme = useSelector((state: RootState) => state.theme.themeColor);

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