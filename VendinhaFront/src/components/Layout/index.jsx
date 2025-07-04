import { Link, Outlet } from "react-router-dom";

export function Menu() {
    return (
        <nav>
            <ul>
                <li>
                    <Link to="/">Clientes</Link>
                </li>
                <li>
                    <Link to="/dividas">Dividas</Link>
                </li>
            </ul>
        </nav>)
}

export function Footer() {
    return <footer>
        <p>{new Date().getFullYear()} - Todos os direitos reservados &copy;</p>
    </footer>
}

export default function Layout() {
    return <>
        <header><Menu /></header>
            <main><Outlet /></main>
            <Footer />
    </>
}