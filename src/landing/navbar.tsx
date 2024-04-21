import { useContext, useState } from "react";
import { CiMenuBurger } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import Logo from "../assets/logo.jpeg";
import { Outlet, useNavigate } from "react-router-dom";
import "./index.css";
import { AdminContext } from "@/contexts/AdminContext";
import { AnimatePresence, motion } from "framer-motion";
import useWindowSize from "@/hooks/useWindowSize";
import { useMediaQuery } from "@mui/material";
export default function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const {
    auth: { logged },
  } = useContext(AdminContext);
  const { width } = useWindowSize();
  const mobile = useMediaQuery("(max-width: 760px)");
  return (
    <>
      <nav id="navbar">
        <div className="nav-title">
          <img src={Logo} alt="logo" onClick={() => navigate("/")} />
          <h4>Sistema de Gestión H2O</h4>
        </div>
        <motion.div
          initial={{ y: mobile && !showModal ? -1000 : 0 }}
          animate={{ y: mobile && showModal ? width * 0.2 : undefined }}
          className={"nav-buttons"}
        >
          {logged ? (
            <>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="button primary-button"
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="button primary-button"
              >
                Iniciar Sesión
              </button>
            </>
          )}
        </motion.div>
        <div className="menu-button">
          <AnimatePresence mode="wait" initial={false}>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <IoIosCloseCircleOutline
                  size={30}
                  color="white"
                  onClick={() => setShowModal(!showModal)}
                />
              </motion.div>
            )}
            {!showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <CiMenuBurger
                  size={30}
                  color="white"
                  onClick={() => setShowModal(!showModal)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      <Outlet />
    </>
  );
}
