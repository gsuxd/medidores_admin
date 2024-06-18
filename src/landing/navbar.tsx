import { useContext, useEffect } from "react";
import "./index.css";
import { AdminContext } from "@/contexts/AdminContext";
import { Link, Outlet } from "react-router-dom";
import Menu from "@mui/icons-material/Menu";
import Logo from "@/assets/logo.jpeg";
export default function Navbar() {
  const {
    auth: { logged },
  } = useContext(AdminContext);
  useEffect(() => {
    const titles = document.querySelectorAll(".item-group-title")!;
    titles.forEach((title) => {
      title.addEventListener("click", () => {
        title.classList.toggle("active");
        title.parentElement!.classList.toggle("active");
        const others = document.querySelectorAll(".item-group-title");
        others.forEach((other) => {
          if (other !== title) {
            other.classList.remove("active");
            other.parentElement!.classList.remove("active");
          }
        });
      });
    });
    window.addEventListener("click", (e) => {
      if (
        //@ts-expect-error 4321
        e.target!.classList.contains("item-group") ||
        //@ts-expect-error 4321
        e.target!.classList.contains("item-group-title")
      ) {
        return;
      }
      titles.forEach((title) => {
        title.classList.remove("active");
        title.parentElement!.classList.remove("active");
      });
    });
    const menu = document.getElementById("menu")!;

    menu.addEventListener("click", () => {
      if (menu.classList.contains("active")) {
        menu.classList.remove("active");
        //@ts-expect-error 432
        menu.src = "src/img/icon-hamburger.svg";
      } else {
        menu.classList.add("active");
        //@ts-expect-error 432
        menu.src = "src/img/icon-close.svg";
      }
      document
        .getElementsByClassName("mobile-menu")[0]
        .classList.toggle("active");
    });
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  function onResize() {
    const links = document.querySelectorAll(".links-group");
    const nav = document.getElementById("nav")!;
    const arrows = document.querySelectorAll(".arrow");
    if (window.innerWidth > 768) {
      if (document.getElementById("mobile-menu")) {
        //@ts-expect-error 432
        nav.appendChild(links);
        document.getElementById("mobile-menu")!.remove();
      }
      arrows.forEach(() => {
        "src/img/icon-arrow-light.svg";
      });

      
    } else {
      if (!document.getElementById("mobile-menu")) {
        const parent = document.createElement("div");
        parent.id = "mobile-menu";
        parent.classList.add("mobile-menu");
        links.forEach((link) => {
          parent.appendChild(link);
        });
        nav.appendChild(parent);
      }
      arrows.forEach((arrow) => {
        //@ts-expect-error 432
        arrow.src = "src/img/icon-arrow-dark.svg";
      });
      //@ts-expect-error 432
      img.src = "src/img/illustration-editor-mobile.svg";
      //@ts-expect-error 432
      img2.src = "src/img/illustration-laptop-mobile.svg";
    }
  }
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
                    src="https://img.icons8.com/ios/50/000000/expand-arrow--v1.png"
                    width={10}
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
