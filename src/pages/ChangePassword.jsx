import { useState } from "react";
import api from "../api/axiosConfig";

export default function ChangePassword() {
    const [current_password, setCP] = useState("");
    const [new_password, setNP] = useState("");
    const [new_password2, setNP2] = useState("");
    const [done, setDone] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        await api.post("/accounts/me/change-password/", {
            current_password,
            new_password,
            new_password2,
        });
        setDone(true);
    };

    if (done) return <div>Contraseña cambiada.</div>;

    return (
        <form onSubmit={submit}>
            <h3>Cambiar contraseña</h3>
            <input className="form-control mb-2" placeholder="Actual"
                value={current_password} onChange={(e) => setCP(e.target.value)} />
            <input className="form-control mb-2" placeholder="Nueva"
                value={new_password} onChange={(e) => setNP(e.target.value)} />
            <input className="form-control mb-2" placeholder="Repite nueva"
                value={new_password2} onChange={(e) => setNP2(e.target.value)} />
            <button className="btn btn-primary">Cambiar</button>
        </form>
    );
}
