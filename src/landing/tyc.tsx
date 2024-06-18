import "./moreInfo.styles.css";
import "./landing.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Document, Page } from "react-pdf";
import query from "@/assets/tyc.pdf";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mui/material";

export default function TerminosYCondiciones() {
    const [numPages, setNumPages] = useState(0);
    const [width, setWidth] = useState(0);
    const isMobile = useMediaQuery("(max-width: 768px)");
    function onResize() {
      setWidth(window.innerWidth);
    }
    useEffect(() => {
      window.addEventListener("resize", onResize);
      onResize();
      return () => {
        window.removeEventListener("resize", onResize);
      };
    })
    function onLoadSuccess({ numPages }: { numPages: number }) {
      setNumPages(numPages);
    }
    return (
      <div className="text-group">
        <div className="title">
          <h2>Términos y Condiciones</h2>
        </div>
        <div className="content">
          <Document renderMode="svg" onLoadSuccess={onLoadSuccess} file={query}>
            {new Array(numPages).fill(0).map((_, index) => (
              <Page key={index} width={isMobile ? width : undefined} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      </div>
    );
}