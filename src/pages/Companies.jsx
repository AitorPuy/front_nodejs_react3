import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Companies() {
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", is_primary: false });
    const [error, setError] = useState("");

    const load = async () => {
        const res = await api.get("/companies/");
        setList(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const openNew = () => {
        setEditing(null);
        // Verificar si ya hay una empresa principal
        const hasPrimary = list.some(c => c.is_primary);
        setForm({ name: "", is_primary: !hasPrimary });
        setError("");
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditing(item.id);
        setForm(item);
        setError("");
        setShowModal(true);
    };

    const save = async () => {
        try {
            setError("");

            if (editing) {
                await api.put(`/companies/${editing}/`, form);
            } else {
                await api.post(`/companies/`, form);
            }

            setShowModal(false);
            load();

        } catch (err) {
            if (!err.response || !err.response.data) {
                setError("Error de red");
                return;
            }

            const data = err.response.data;

            if (data.name) setError(data.name[0]);
            else if (data.detail) setError(data.detail);
            else setError("Datos inválidos");
        }
    };

    const remove = async (id) => {
        if (confirm("¿Eliminar esta empresa?")) {
            await api.delete(`/companies/${id}/`);
            load();
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Empresas</h3>
                <button className="btn btn-primary" onClick={openNew}>
                    Nueva empresa
                </button>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Principal</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((c) => (
                        <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>
                                {c.is_primary && (
                                    <span className="badge bg-primary">Principal</span>
                                )}
                            </td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => openEdit(c)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => remove(c.id)}
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
                                <h5 className="modal-title">
                                    {editing ? "Editar empresa" : "Nueva empresa"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}

                                <input
                                    className="form-control mb-2"
                                    placeholder="Nombre"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                
                                <div className="form-check mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="is_primary"
                                        checked={form.is_primary}
                                        onChange={(e) => setForm({ ...form, is_primary: e.target.checked })}
                                        disabled={!editing && list.some(c => c.is_primary)}
                                    />
                                    <label className="form-check-label" htmlFor="is_primary">
                                        Marcar como empresa principal
                                    </label>
                                    {!editing && list.some(c => c.is_primary) && (
                                        <small className="form-text text-muted d-block">
                                            Ya existe una empresa principal. Edítala para cambiar.
                                        </small>
                                    )}
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
                                    Guardar
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
