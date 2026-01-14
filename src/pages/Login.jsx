import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [companyName, setCompanyName] = useState("AdminLTE");

    useEffect(() => {
        // Obtener empresa principal sin autenticación
        const loadPrimaryCompany = async () => {
            try {
                const baseURL = import.meta.env.VITE_API_URL;
                if (!baseURL) {
                    console.error("VITE_API_URL no está configurada. Crea un archivo .env con VITE_API_URL=http://localhost:8000/api");
                    return;
                }
                const res = await axios.get(`${baseURL}/companies/primary/`);
                if (res.data && res.data.name) {
                    setCompanyName(res.data.name);
                }
            } catch (err) {
                // Si falla, mantener el nombre por defecto
                console.error("No se pudo cargar la empresa principal:", err);
                if (err.code === "ERR_NETWORK") {
                    console.error("Verifica que el backend esté corriendo y que CORS esté configurado correctamente");
                }
            }
        };
        loadPrimaryCompany();
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/accounts/token/", { email, password });

            const access = res.data.access;
            const refresh = res.data.refresh;

            // guardar tokens
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);

            // decodificar role y email
            const payload = JSON.parse(atob(access.split(".")[1]));
            localStorage.setItem("role", payload.role);
            localStorage.setItem("email", payload.email);

            // obtener datos reales del usuario (nombre)
            const me = await api.get("/accounts/me/");
            localStorage.setItem("first_name", me.data.first_name || "");
            localStorage.setItem("last_name", me.data.last_name || "");

            window.location.href = "/";

        } catch (err) {
            console.error("Error en login:", err);
            
            // Verificar si la URL de la API está configurada
            const apiUrl = import.meta.env.VITE_API_URL;
            if (!apiUrl) {
                setError("Error: VITE_API_URL no está configurada. Verifica el archivo .env");
                return;
            }
            
            if (!err.response) {
                // Error de red (backend no disponible, CORS, etc.)
                if (err.code === "ERR_NETWORK" || err.message?.includes("Network Error")) {
                    setError(`Error de conexión. Verifica que el backend esté corriendo en ${apiUrl}`);
                } else {
                    setError(`Error de red: ${err.message || "Desconocido"}`);
                }
                return;
            }
            
            if (err.response.status === 401) {
                setError("Email o contraseña incorrectos");
                return;
            }
            
            if (err.response.status === 404) {
                setError(`Endpoint no encontrado. Verifica que la URL del backend sea correcta: ${apiUrl}`);
                return;
            }
            
            if (err.response.status === 500) {
                setError("Error del servidor. Revisa los logs del backend");
                return;
            }
            
            // Mostrar el mensaje de error del servidor si está disponible
            const errorMessage = err.response?.data?.detail || 
                                err.response?.data?.message || 
                                err.response?.data?.error ||
                                `Error ${err.response.status}: ${err.response.statusText}`;
            setError(errorMessage);
        }
    };

    return (
        <div className="w-100 d-flex align-items-center justify-content-center bg-light" style={{ minHeight: "100vh" }}>
            <div className="card shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
                <div className="card-body">
                    <h3 className="text-center mb-4">{companyName}</h3>
                    <p className="text-center text-muted mb-4">
                        Sign in to start your session
                    </p>
                    <form onSubmit={submit}>
                        <input
                            className="form-control mb-2"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="form-control mb-2"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {error && (
                            <div className="alert alert-danger py-2">{error}</div>
                        )}

                        <button className="btn btn-primary w-100 mb-3">Entrar</button>

                        <div className="text-center">
                            <small>
                                ¿No tienes cuentaa?{" "}
                                <Link to="/register">Regístrate</Link>
                            </small>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
