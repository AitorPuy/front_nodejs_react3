import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Providers() {
    const [list, setList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
    const [error, setError] = useState("");

    const load = async () => {
        const res = await api.get("/providers/");
        setList(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const openNew = () => {
        setEditing(null);
        setForm({ name: "", email: "", phone: "", notes: "" });
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
                await api.put(`/providers/${editing}/`, form);
            } else {
                await api.post(`/providers/`, form);
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
            else if (data.email) setError(data.email[0]);
            else if (data.phone) setError(data.phone[0]);
            else if (data.detail) setError(data.detail);
            else setError("Datos inválidos");
        }
    };

    const remove = async (id) => {
        if (confirm("¿Eliminar este proveedor?")) {
            await api.delete(`/providers/${id}/`);
            load();
        }
    };

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>Proveedores</h3>
                <button className="btn btn-primary" onClick={openNew}>
                    Nuevo proveedor
                </button>
            </div>

            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Teléfono</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((p) => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.email}</td>
                            <td>{p.phone}</td>
                            <td className="text-end">
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => openEdit(p)}
                                >
                                    Editar
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => remove(p.id)}
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
                                    {editing ? "Editar proveedor" : "Nuevo proveedor"}
                                </h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                {error && <div className="alert alert-danger">{error}</div>}

                                <input
                                    className="form-control mb-2"
                                    placeholder="Nombre"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Email"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                                <input
                                    className="form-control mb-2"
                                    placeholder="Teléfono"
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                />
                                <textarea
                                    className="form-control"
                                    placeholder="Notas"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                />
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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
