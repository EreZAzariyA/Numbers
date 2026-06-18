import { useNavigate } from "react-router-dom";
import "./logo.css";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div className="logo" onClick={() => navigate('/dashboard')}>
      <div className="logo-inner">
        <span className="logo-name">E.A Store</span>
        <span className="logo-tagline">Azariya · Company</span>
      </div>
    </div>
  );
};

export default Logo;
