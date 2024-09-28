import { Link } from "react-router-dom";
import Logo from "@/assets/logo.jpeg";
import "./landing.css";
import IllustrationEditorDesktop from "@/assets/illustration-editor-desktop.png";
import IllustrationPhones from "@/assets/illustration-phones.png";
import IllustrationLaptopDesktop from "@/assets/illustration-laptop-desktop.png";
import IllustrationEditorMobile from "@/assets/illustration-editor-mobile.png";
import IllustrationLaptopMobile from "@/assets/illustration-laptop-mobile.png";
import WhatsappButtonGreenMedium from "@/assets/WhatsAppButtonGreenMedium.svg";
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
  }, []);

  return (
    <>
      <section id="header">
        <h2>H2O Gestión</h2>
        <p>Siente el flujo, controla el curso</p>
        <div id="button-group">
          {/* <Link to="#" id="get-started">
            Contactar con ventas
          </Link> */}
          <Link target="_blank" to="https://wa.me/+56977904563" id="learn-more">
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
                H2O Gestión es un software integral diseñado para la gestión
                eficiente del suministro de agua potable en comunidades rurales.
                Este sistema facilita la administración al simplificar la toma
                de estados de los medidores, generar avisos de cobranza, emitir
                boletas y gestionar pagos en línea. Con un enfoque en la
                transparencia y la precisión, H2O Gestión permite un registro
                detallado del consumo y una atención al cliente óptima. Su
                objetivo es optimizar los procesos de facturación y monitoreo,
                ofreciendo herramientas para una gestión del agua efectiva y
                sostenible.
              </p>
            </div>
            <div className="paragraph">
              <h3>Nuestros Servicios</h3>
              <p>
                En H2O Gestión, nos dedicamos a ofrecer servicios de gestión de
                agua potable rural que son innovadores y siempre actualizados.
                Utilizamos las últimas tecnologías y metodologías para
                adelantarnos a las tendencias del sector y cumplir con las
                normativas vigentes. Nuestro software integra soluciones
                inteligentes de lectura de medidores, proporcionando lecturas
                precisas en tiempo real para minimizar errores y mejorar la
                eficiencia en la recopilación de datos. Además, invertimos
                continuamente en investigación y desarrollo para asegurar que
                nuestras herramientas se mantengan a la vanguardia. Nos
                comprometemos a la formación continua de nuestro equipo,
                garantizando que estamos al día con las nuevas tendencias y
                mejores prácticas del sector. En H2O Gestión, nos esforzamos por
                ofrecer servicios excepcionales, confiables y adaptados a las
                necesidades cambiantes del sector del agua potable
                rural en Chile.
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
            Un modelo de Inteligencia Artificial entrenado para escanear los
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
              método de pago preferido, ya sea transferencia bancaria, tarjeta o
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
          <a target="_blank" href="web.facebook.com/profile.php?id=61565050997415">Facebook</a>
          <a target="_blank" href="https://www.instagram.com/h2ogestionapp/">Instagram</a>
          <a target="_blank" href="https://wa.me/+56977904563"><img src={WhatsappButtonGreenMedium} alt="Chat On Whatsapp" /></a>
        </div>
      </footer>
    </>
  );
}
