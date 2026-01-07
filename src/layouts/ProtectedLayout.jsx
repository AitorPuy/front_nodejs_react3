import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import api from "../api/axiosConfig";

export default function ProtectedLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [companyName, setCompanyName] = useState("Atlantis CRM");

    useEffect(() => {
        api.get("/accounts/me/")
            .then((res) => {
                if (res.data.codigo_empresa_nombre) {
                    setCompanyName(res.data.codigo_empresa_nombre);
                }
            })
            .catch(() => {
                // Si falla, mantener el nombre por defecto
            });
    }, []);

    return (
        <div className="d-flex min-vh-100 bg-light">
            {sidebarOpen && <Sidebar onToggle={() => setSidebarOpen(!sidebarOpen)} />}

            <div className="flex-grow-1 d-flex flex-column">
                <header className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-3">
                    <button
                        type="button"
                        className="btn btn-primary me-3"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <i className="bi bi-list" />
                    </button>

                    <Link to="/" className="navbar-brand d-flex align-items-center">
                        <span className="bg-white text-primary rounded-circle d-inline-flex align-items-center justify-content-center me-2" style={{ width: 32, height: 32 }}>
                            <i className="bi bi-graph-up" />
                        </span>
                        <span>{companyName}</span>
                    </Link>

                    <form className="d-none d-md-flex ms-4" style={{ maxWidth: "360px", width: "100%" }}>
                        <div className="input-group input-group-sm">
                            <span className="input-group-text bg-white border-0">
                                <i className="bi bi-search" />
                            </span>
                            <input
                                type="search"
                                className="form-control border-0"
                                placeholder="Buscar..."
                                aria-label="Buscar"
                            />
                        </div>
                    </form>

                    <div className="ms-auto d-flex align-items-center">
                        <Link to="/logout" className="btn btn-outline-light btn-sm d-flex align-items-center">
                            <i className="bi bi-box-arrow-right me-2" />
                            <span>Logout</span>
                        </Link>
                    </div>
                </header>

                <main className="flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
