import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Users() {
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        email: "",
        role: "user",
        is_active: true,
    });
    const [error, setError] = useState("");

    const load = async () => {
        const res = await api.get("/accounts/users/");
        setList(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const openEdit = (u) => {
        setEditing(u.id);
        setForm({
            email: u.email,
            role: u.role,
            is_active: u.is_active,
        });
        setError("");
        setShowModal(true);
    };

    const save = async () => {
        try {
            setError("");

            await api.patch(`/accounts/users/${editing}/`, {
                is_active: form.is_active,
                role: form.role
            });

            await api.post(`/accounts/users/${editing}/set-role/`, { role: form.role });
            await api.post(`/accounts/users/${editing}/set-active/`, { is_active: form.is_active });

            setShowModal(false);
            load();

        } catch (err) {
            if (!err.response || !err.response.data) {
                setError("Error de red");
                return;
            }

            const data = err.response.data;

            if (data.email) setError(data.email[0]);
            else if (data.role) setError(data.role[0]);
            else if (data.is_active) setError(data.is_active[0]);
            else setError("Datos inválidos");
        }
    };

    const remove = async (id) => {
        if (confirm("¿Eliminar usuario?")) {
            await api.delete(`/accounts/users/${id}/`);
            load();
        }
    };

    return (
        <>
            <h3>Usuarios</h3>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Activo</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((u) => (
                        <tr key={u.id}>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.is_active ? "Sí" : "No"}</td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => openEdit(u)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => remove(u.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showModal && (
                <div className="modal fade show d-block" style={{ background: "#0008" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">Editar usuario</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}

                                <div className="mb-2">
                                    <label>Email</label>
                                    <input
                                        disabled
                                        className="form-control"
                                        value={form.email}
                                    />
                                </div>

                                <div className="mb-2">
                                    <label>Rol</label>
                                    <select
                                        className="form-control"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                </div>

                                <div className="form-check mt-3">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={form.is_active}
                                        onChange={(e) =>
                                            setForm({ ...form, is_active: e.target.checked })
                                        }
                                    />
                                    <label className="form-check-label">Activo</label>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancelar
                                </button>
                                <button className="btn btn-primary" onClick={save}>
                                    Guardar cambios
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
