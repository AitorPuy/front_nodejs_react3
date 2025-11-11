import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

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
            if (!err.response) {
                setError("Error de red");
                return;
            }
            if (err.response.status === 401) {
                setError("Email o contraseña incorrectos");
                return;
            }
            setError("Error desconocido");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3>Login</h3>
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
                        ¿No tienes cuenta?{" "}
                        <Link to="/register">Regístrate</Link>
                    </small>
                </div>
            </form>
        </div>
    );
}
