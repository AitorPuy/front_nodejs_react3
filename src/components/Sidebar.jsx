import { Link } from "react-router-dom";

export default function Sidebar({ onToggle }) {
    const first = localStorage.getItem("first_name") || "";
    const last = localStorage.getItem("last_name") || "";
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "";

    return (
        <aside
            className="bg-white border-end p-3 d-flex flex-column position-relative"
            style={{ minHeight: "100vh", width: "240px" }}
        >
            <div className="mb-4 d-flex align-items-center justify-content-start">
                <div className="d-flex align-items-center">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32 }}>
                        <i className="bi bi-person" />
                    </div>
                    <div>
                        <div className="fw-semibold">
                            {first} {last}
                        </div>
                        <div className="small text-muted">{email}</div>
                    </div>
                </div>
            </div>

            <nav className="flex-grow-1">
                <ul className="list-unstyled mb-0">
                    <li className="mb-2">
                        <Link to="/" className="d-flex align-items-center text-decoration-none text-dark">
                            <i className="bi bi-speedometer2 me-2" />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/clients" className="d-flex align-items-center text-decoration-none text-dark">
                            <i className="bi bi-people me-2" />
                            <span>Clientes</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/providers" className="d-flex align-items-center text-decoration-none text-dark">
                            <i className="bi bi-truck me-2" />
                            <span>Proveedores</span>
                        </Link>
                    </li>
                    {role === "admin" && (
                        <li className="mb-2">
                            <Link to="/users" className="d-flex align-items-center text-decoration-none text-dark">
                                <i className="bi bi-person-gear me-2" />
                                <span>Usuarios</span>
                            </Link>
                        </li>
                    )}
                    <li className="mb-2">
                        <Link to="/profile" className="d-flex align-items-center text-decoration-none text-dark">
                            <i className="bi bi-person-badge me-2" />
                            <span>Mi perfil</span>
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/change-password" className="d-flex align-items-center text-decoration-none text-dark">
                            <i className="bi bi-shield-lock me-2" />
                            <span>Cambiar contraseña</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
