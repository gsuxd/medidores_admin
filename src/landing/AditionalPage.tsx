import { useLocation } from "react-router-dom"
import "./moreInfo.styles.css"

export default function AditionalPage() {
    const {title, content} = useLocation().state;
    return (
        <div className="text-group">
            <div className="title"><h2>{title}</h2></div>
            <div className="content">{content}</div>
        </div>
    )
}