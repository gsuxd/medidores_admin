import { useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Logo from "../assets/logo.jpeg";
import { Outlet, useNavigate } from "react-router-dom";
import "./index.css";
export default function Navbar() {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    return (
        <>
        <nav id="navbar">
        <div className="nav-title">
          <img src={Logo} alt="logo" onClick={() => navigate("/")} />
          <h4>Sistema de Gestión H2O</h4>
        </div>
        <div className={`nav-buttons ${showModal && "active"}`}>
          <button className="button primary-button">Iniciar Sesión</button>
          <button className="button secondary-button">Registro</button>
        </div>
        <div className="menu-button">
          {showModal ? (
            <IoIosCloseCircleOutline
              size={30}
              color="white"
              onClick={() => setShowModal(!showModal)}
            />
          ) : (
            <CiMenuBurger
              size={30}
              color="white"
              onClick={() => setShowModal(!showModal)}
            />
          )}
        </div>
      </nav>
      <Outlet/>
      </>
    )
}