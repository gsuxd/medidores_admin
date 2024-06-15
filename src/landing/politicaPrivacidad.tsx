import "./moreInfo.styles.css";
import "./landing.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Document, Page } from "react-pdf";
import query from "@/assets/politica_privacidad.pdf";
import { useState } from "react";

export default function PoliticaPrivacidad() {
  const [numPages, setNumPages] = useState(0);
  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  return (
    <div className="text-group">
      <div className="title">
        <h2>Politica de Privacidad</h2>
      </div>
      <div className="content">
        <Document renderMode="svg" onLoadSuccess={onLoadSuccess} file={query}>
          {new Array(numPages).fill(0).map((_, index) => (
            <Page key={index} pageNumber={index + 1} />
          ))}
        </Document>
      </div>
    </div>
  );
}
