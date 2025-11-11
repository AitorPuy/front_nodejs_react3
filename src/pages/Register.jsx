import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== password2) {
            setError("Las contraseñas no coinciden");
            return;
        }

        try {
            await api.post("/accounts/register/", {
                email,
                password,
                password2,
            });

            setSuccess(true);

        } catch (err) {
            if (!err.response) {
                setError("Error de red");
                return;
            }

            const data = err.response.data;

            if (data.email) setError(data.email[0]);
            else if (data.password) setError(data.password[0]);
            else if (data.password2) setError(data.password2[0]);
            else setError("Error en el registro");

            return; // evita "Uncaught in promise"
        }
    };

    if (success) {
        return (
            <div className="container mt-5" style={{ maxWidth: "400px" }}>
                <div className="alert alert-success">
                    Registro completado. Ya puedes iniciar sesión.
                </div>
                <Link to="/login" className="btn btn-primary w-100">
                    Ir al login
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3>Registro</h3>

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

                <input
                    className="form-control mb-2"
                    type="password"
                    placeholder="Repite Password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                />

                {error && (
                    <div className="alert alert-danger py-2">{error}</div>
                )}

                <button className="btn btn-primary w-100 mb-3">
                    Crear cuenta
                </button>

                <div className="text-center">
                    <small>
                        ¿Ya tienes cuenta?{" "}
                        <Link to="/login">Iniciar sesión</Link>
                    </small>
                </div>
            </form>
        </div>
    );
}
