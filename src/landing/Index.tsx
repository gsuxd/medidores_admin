import { Link } from "react-router-dom";
import Logo from "@/assets/logo.jpeg";
import "./landing.css";
import IllustrationEditorDesktop from "@/assets/illustration-editor-desktop.png";
import IllustrationPhones from "@/assets/illustration-phones.png";
import IllustrationLaptopDesktop from "@/assets/illustration-laptop-desktop.png";
import IllustrationEditorMobile from "@/assets/illustration-editor-mobile.png";
import IllustrationLaptopMobile from "@/assets/illustration-laptop-mobile.png";
import { useEffect } from "react";


export default function LandingPage() {
  function onResize() {
    const img = document.getElementById("illustration-editor")!;
    const img2 = document.getElementById("illustration-laptop")!;
    if (window.innerWidth > 768) {
      //@ts-expect-error 432
      img.src = IllustrationEditorDesktop;
      //@ts-expect-error 432
      img2.src = IllustrationLaptopDesktop;
    } else {
      //@ts-expect-error 432
      img.src = IllustrationEditorMobile;
      //@ts-expect-error 432
      img2.src = IllustrationLaptopMobile;
    }
  }

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [])

  return (
    <>
      <section id="header">
        <h2>H2O Gestión</h2>
        <p>Siente el flujo, controla el curso</p>
        <div id="button-group">
          <Link to="#" id="get-started">
            Contactar con ventas
          </Link>
          <Link to="#" id="learn-more">
            Más Información
          </Link>
        </div>
      </section>
      <section id="designed">
        <h1>Controla tu SSR</h1>
        <div className="content">
          <div className="text">
            <div className="paragraph">
              <h3>Administración a medida</h3>
              <p>
                H2O Gestión es un sistema completo de administración para tu
                SSR. Designa administradores para vender a tus socios y
                operadores, además de ofrecer seguimiento a tus socios de sus
                deudas y notificaciones en tiempo real mediante notificaciones
                Push y correos masivos.
              </p>
            </div>
            <div className="paragraph">
              <h3>Nuestros Servicios</h3>
              <p>
                H2O se compromete a mejorar continuamente y a ofrecer servicios
                de gestión innovadores y actualizados. Nuestro enfoque se basa
                en la utilización de las últimas tecnologías y metodologías para
                adelantarnos a las tendencias del sector y cambios en el marco
                regulatorio para los APR. Invertimos significativamente en
                investigación y desarrollo para garantizar que nuestro software
                sea capaz de integrarse a la perfección con las tecnologías de
                vanguardia que están cambiando el sector del agua potable rural.
                Por ejemplo, hemos incorporado soluciones inteligentes de
                lectura de medidores que proporcionan lecturas precisas en
                tiempo real para minimizar los errores y mejorar la eficacia en
                la recopilación de datos. Además, nos mantenemos al tanto de las
                nuevas normativas y estándares del sector para garantizar que
                nuestros clientes cumplen los nuevos requisitos legales. Por
                último, nuestro equipo está comprometido con la formación y el
                desarrollo, aprendiendo y mejorando continuamente para estar al
                día de las nuevas tendencias, tecnologías y mejores prácticas
                del sector. En H2O Gestión, nos esforzamos por ofrecer a
                nuestros clientes servicios excepcionales que sean innovadores,
                fiables y que satisfagan las necesidades cambiantes del sector
                del agua potable rural en Chile.
              </p>
            </div>
          </div>
          <img
            src={IllustrationEditorDesktop}
            id="illustration-editor"
            alt="illustration-editor"
            data-inviewport="illustration-editor"
          />
        </div>
      </section>
      <section id="state-of-art">
        <img
          src={IllustrationPhones}
          alt="illustration-phones"
          data-inviewport="illustration-phones"
          id="illustration-phones"
        />
        <div className="content">
          <h2>Herramienta para tus operadores</h2>
          <p>
            Usando un modelo de Inteligencia Artificial entrenado escanea los
            medidores con solo una foto, agrega la lectura a la cola y súbelas
            cuando tengas conexión a internet estable, dando soporte a las zonas
            rurales donde la conexión es limitada.
          </p>
        </div>
      </section>
      <section id="info">
        <img
          src={IllustrationLaptopDesktop}
          data-inviewport="illustration-laptop"
          alt="illustration-laptop-desktop"
          id="illustration-laptop"
        />
        <div className="content">
          <div className="paragraph">
            <h2>Pagos oportunos</h2>
            <p>
              Tus socios tendrán la opción de pagar mediante la app usando su
              método de pago preferido, ya sea transferencia bancaria; tarjeta o
              efectivo.
            </p>
          </div>
        </div>
      </section>
      <footer id="footer">
        <img src={Logo} alt="logo" />
        <div className="link-container">
          <h2>Producto</h2>
          <a href="#">Solicitar una demo</a>
          <a href="#">Precios</a>
        </div>
        <div className="link-container">
          <h2>Nosotros</h2>
          <Link to="/terminos-y-condiciones">Terminos y Condiciones</Link>
          <Link to="/politica-de-privacidad">Política de Privacidad</Link>
        </div>
        <div className="link-container">
          <h2>Conecta con nosotros</h2>
          <a href="#">Contacto</a>
          <a href="#">Instagram</a>
          <a href="#">Whatsapp</a>
        </div>
      </footer>
    </>
  );
}
