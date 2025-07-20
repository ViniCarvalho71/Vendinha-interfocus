import { Link, Outlet } from "react-router-dom";
import { FaUser,FaDollarSign} from "react-icons/fa";

export function Menu() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/"><FaUser/> Clientes</Link>
                </li>
                <li>
                    <Link to="/dividas"><FaDollarSign/> Dívida</Link>
                </li>
            </ul>
        </nav>)
}


export default function Layout() {
    return (
        <div id="container">          
            <div id="conteudo">
                <header><Menu /></header>
                <main><Outlet /></main>
            </div>
        </div>
    );   
}