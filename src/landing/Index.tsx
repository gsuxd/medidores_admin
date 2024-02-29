import type { IconType } from "react-icons";
import { IoPersonCircleOutline, IoWaterOutline } from "react-icons/io5";
import { GiReceiveMoney, GiWaterRecycling } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { FaMoneyBillTransfer, FaRegCirclePlay } from "react-icons/fa6";
import { RiFolderDownloadLine } from "react-icons/ri";
import Logo from "../assets/logo.jpeg";
import "./styles.css";
import { useEffect, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <nav id="navbar">
        <div className="nav-title">
          <img src={Logo} alt="logo" onClick={() => {}} />
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
      <div id="heading">
        <h2>"Siente el flujo controla el curso"</h2>
        <h4>Controla tu servicio de la manera más eficiente</h4>
      </div>
      <div id="button-group">
        <IconButton
          Icon={IoWaterOutline}
          title="Sobre Nosotros"
          onClick={() => {}}
        />
        <IconButton
          Icon={GiWaterRecycling}
          title="Nuestros Servicios"
          onClick={() => {}}
        />
        <IconButton
          Icon={IoPersonCircleOutline}
          title="Revisa tu cuenta"
          onClick={() => {}}
        />
        <IconButton
          Icon={GiReceiveMoney}
          title="Paga tu cuenta"
          onClick={() => {}}
        />
        <IconButton
          Icon={MdSupportAgent}
          title="Contacta un ejecutivo"
          onClick={() => {}}
        />
        <IconButton
          Icon={FaMoneyBillTransfer}
          title="Servicios Contable"
          onClick={() => {}}
        />
        <IconButton
          Icon={FaRegCirclePlay}
          title="Que hacemos"
          onClick={() => {}}
        />
        <IconButton
          Icon={RiFolderDownloadLine}
          title="Descargar documentos"
          onClick={() => {}}
        />
      </div>
    </>
  );
}

function IconButton({
  onClick,
  title,
  Icon,
}: {
  onClick: () => void;
  title: string;
  Icon: IconType;
}) {
  const [width, setWidth] = useState(window.innerWidth);
  function onResize(e: UIEvent) {
    setWidth(e.view!.innerWidth!);
  }
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  return (
    <button className="icon-button" onClick={onClick}>
      <Icon size={width > 1024 ? 37 : width > 760 ? width * 0.025 : 30} />
      <span>{title}</span>
    </button>
  );
}
