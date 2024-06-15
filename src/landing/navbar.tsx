import { useContext } from "react";
import "./index.css";
import { AdminContext } from "@/contexts/AdminContext";
import { Link, Outlet } from "react-router-dom";
import Menu from "@mui/icons-material/Menu";
import Logo from "@/assets/logo.jpeg";
export default function Navbar() {
  const {
    auth: { logged },
  } = useContext(AdminContext);
  return (
    <>
      <nav id="nav">
        <Link to={"/"}>
        <img id="title" src={Logo} alt="logo" />
        </Link>
        <div className="links-group links">
          <ul>
            <li className="item-group">
              <h3 className="item-group-title">
                Producto
                <span>
                  <img
                    src="src/img/icon-arrow-dark.svg"
                    alt="icon-arrow"
                    className="arrow"
                  />
                </span>
              </h3>
              <ul>
                <li>
                  <a href="#">Descripción</a>
                </li>
                <li>
                  <a href="#">Precio</a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div className="links-group links-2">
          <ul>
            <li>
              <Link to={logged ? "/admin/dashboard" : "/login"} id="login">
                {logged ? "Dashboard" : "Iniciar Sesión"}
              </Link>
            </li>
          </ul>
        </div>
        <Menu id="menu" />
      </nav>
      <Outlet />
    </>
  );
}
