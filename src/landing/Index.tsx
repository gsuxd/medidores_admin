import type { IconType } from "react-icons";
import { IoPersonCircleOutline, IoWaterOutline } from "react-icons/io5";
import { GiReceiveMoney, GiWaterRecycling } from "react-icons/gi";
import { MdSupportAgent } from "react-icons/md";
import { FaMoneyBillTransfer, FaRegCirclePlay } from "react-icons/fa6";
import { RiFolderDownloadLine } from "react-icons/ri";
import "./landing.styles.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <div id="heading">
        <h2>"Siente el flujo controla el curso"</h2>
        <h4>Controla tu servicio de la manera más eficiente</h4>
      </div>
      <div id="button-group">
        <IconButton
          Icon={IoWaterOutline}
          title="Sobre Nosotros"
          onClick={() => {
            navigate("/more-info", {
              state: {
                title: "Sobre nosotros",
                content:
                  "H2O Gestión es una empresa que nace con el propósito de facilitar la gestión de los Sistemas de agua potable rural (SSR o APR) en Chile. Somos un equipo de profesionales con experiencia en el sector hídrico, que hemos desarrollado un software innovador y eficiente, que se adapta a las necesidades de cada SAPR. Nuestra misión es mejorar la calidad de vida de las comunidades rurales, brindándoles una herramienta que les permite administrar y cobrar sus servicios de agua de forma transparente y sencilla.",
              },
            });
          }}
        />
        <IconButton
          Icon={GiWaterRecycling}
          title="Nuestros Servicios"
          onClick={() => {
            navigate("more-info", {state: {
              title: "Nuestros Servicios",
              content: "H2O se compromete a mejorar continuamente y a ofrecer servicios de gestión innovadores y actualizados. Nuestro enfoque se basa en la utilización de las últimas tecnologías y metodologías para adelantarnos a las tendencias del sector y cambios en el marco regulatorio para los APR. Invertimos significativamente en investigación y desarrollo para garantizar que nuestro software sea capaz de integrarse a la perfección con las tecnologías de vanguardia que están cambiando el sector del agua potable rural. Por ejemplo, hemos incorporado soluciones inteligentes de lectura de medidores que proporcionan lecturas precisas en tiempo real para minimizar los errores y mejorar la eficacia en la recopilación de datos. Además, nos mantenemos al tanto de las nuevas normativas y estándares del sector para garantizar que nuestros clientes cumplen los nuevos requisitos legales. Por último, nuestro equipo está comprometido con la formación y el desarrollo, aprendiendo y mejorando continuamente para estar al día de las nuevas tendencias, tecnologías y mejores prácticas del sector. En H2O Gestión, nos esforzamos por ofrecer a nuestros clientes servicios excepcionales que sean innovadores, fiables y que satisfagan las necesidades cambiantes del sector del agua potable rural en Chile."
            }})
          }}
        />
        <IconButton
          Icon={IoPersonCircleOutline}
          title="Revisa tu cuenta"
          onClick={() => {
            navigate("more-info", {state: {
              title: "Revisa tu cuenta",
              content: "Si eres socio de un SAPR que utiliza nuestro software, puedes revisar tu cuenta ingresando tu RUT y tu contraseña. Podrás ver tu consumo de agua, tu saldo, y tu historial de pagos."
            }})
          }}
        />
        <IconButton
          Icon={GiReceiveMoney}
          title="Paga tu cuenta"
          onClick={() => {
            navigate("more-info", {state: {
              title: "Paga tu cuenta",
              content: "Si eres socio de un SAPR que utiliza nuestro software, puedes pagar tu cuenta de forma fácil y segura a través de este portal. Aceptamos diversos medios de pago, como tarjetas de crédito, débito, transferencias bancarias, y otros."
            }})
          }}
        />
        <IconButton
          Icon={MdSupportAgent}
          title="Contacta un ejecutivo"
          onClick={() => {
            navigate('more-info', {state: {
              title: "Contactar un Ejecutivo",
              content: " Si quieres saber más sobre nuestro software, o solicitar una demostración gratuita, puedes contactar a uno de nuestros ejecutivos a través de este formulario. Te responderemos a la brevedad posible."
            }})
          }}
        />
        <IconButton
          Icon={FaMoneyBillTransfer}
          title="Servicios Contable"
          onClick={() => {
            navigate('more-info', {state: {
              title: "Servicios Contable",
              content: "Nuestros profesionales contadores te ayudan a llevar un registro contable de todos los ingresos y egresos de tu SAPR, así como generar informes financieros y tributarios.     * Toma de estado inteligente: Nuestro software se integra con dispositivos móviles que te permiten tomar el estado de los medidores de agua de forma rápida y precisa, y enviar los datos a la plataforma en tiempo real.    * Software de administración y cobranza: Nuestro software te permite gestionar los datos de tus socios, emitir boletas y facturas electrónicas, enviar avisos de pago, realizar cobros automáticos, y consultar el historial de pagos y deudas."
            }})
          }}
        />
        <IconButton
          Icon={FaRegCirclePlay}
          title="Que hacemos"
          onClick={() => {
            navigate('more-info', {state: {
              title: "Que hacemos",
              content: "Si eres socio de un SAPR que utiliza nuestro software, puedes pagar tu cuenta de forma fácil y segura a través de este portal. Aceptamos diversos medios de pago, como tarjetas de crédito, débito, transferencias bancarias, y otros."
            }})
          }}
        />
        <IconButton
          Icon={RiFolderDownloadLine}
          title="Descargar documentos"
          onClick={() => {
            navigate("more-info", {state: {
              title: "Descargar documentos",
              content: "En esta sección, puedes descargar documentos útiles para tu SAPR, como manuales de usuario, normativas legales, guías de buenas prácticas, y otros."
            }})
          }}
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
