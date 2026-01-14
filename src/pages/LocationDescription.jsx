import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";

export default function LocationDescription() {
    const [searchParams] = useSearchParams();
    const topic = searchParams.get("topic") || "";
    const cityName = searchParams.get("city") || "";
    const formattedAddress = searchParams.get("address") || "";
    
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const generateDescription = async () => {
        if (!cityName || !topic) {
            setError("Faltan datos de ciudad o tema");
            return;
        }

        setLoading(true);
        setError("");
        setDescription("");

        try {
            const response = await api.post("/locations/generate-description/", {
                city_name: cityName,
                topic: topic,
            });
            setDescription(response.data.description);
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.response?.data?.detail) {
                setError(err.response.data.detail);
            } else {
                setError("Error al generar la descripción");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4">Descripción de {cityName}</h2>
            
            <div className="card shadow-sm border-0">
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label">Ubicación detectada:</label>
                        <div className="form-control-plaintext">
                            <div className="fw-bold mb-1">{cityName}</div>
                            {formattedAddress && (
                                <div className="text-muted small">{formattedAddress}</div>
                            )}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Tema seleccionado:</label>
                        <div className="form-control-plaintext fw-bold">{topic}</div>
                    </div>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <button
                        className="btn btn-primary mb-3"
                        onClick={generateDescription}
                        disabled={loading || !cityName || !topic}
                    >
                        {loading ? "Generando..." : "Generar Descripción"}
                    </button>

                    {description && (
                        <div className="alert alert-info">
                            <strong>Descripción:</strong> {description}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
