import { Link } from "react-router-dom";

export default function Sidebar() {
    const first = localStorage.getItem("first_name") || "";
    const last = localStorage.getItem("last_name") || "";
    const email = localStorage.getItem("email") || "";

    return (
        <div className="bg-light p-3" style={{ minHeight: "100vh", width: "220px" }}>
            <h4>Menu</h4>

            <div className="mb-3">
                <strong>{first} {last}</strong><br />
                <small>{email}</small>
            </div>

            <ul className="list-unstyled">
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/clients">Clientes</Link></li>
                <li><Link to="/providers">Proveedores</Link></li>
                <li><Link to="/profile">Mi perfil</Link></li>
                <li><Link to="/change-password">Cambiar contraseña</Link></li>
                {localStorage.getItem("role") === "admin" && (
                    <li><Link to="/users">Usuarios</Link></li>
                )}
                <li><Link to="/logout">Salir</Link></li>
            </ul>
        </div>
    );
}
