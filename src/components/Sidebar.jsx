import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Sidebar({ onToggle }) {
    const first = localStorage.getItem("first_name") || "";
    const last = localStorage.getItem("last_name") || "";
    const email = localStorage.getItem("email") || "";
    const role = localStorage.getItem("role") || "";
    const [cityName, setCityName] = useState("Ubicación");
    const [formattedAddress, setFormattedAddress] = useState("");
    const [loadingCity, setLoadingCity] = useState(true);
    const [showDropdown, setShowDropdown] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getCurrentLocation = () => {
            if (!navigator.geolocation) {
                setLoadingCity(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        console.log("Coordenadas obtenidas:", position.coords.latitude, position.coords.longitude);
                        const response = await api.post("/locations/get-city-name/", {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                        console.log("Respuesta de la API:", response.data);
                        setCityName(response.data.city_name);
                        setFormattedAddress(response.data.formatted_address || "");
                    } catch (err) {
                        console.error("Error al obtener la ciudad desde la API:", err);
                        console.error("Detalles del error:", err.response?.data);
                        setCityName("Ubicación");
                        setFormattedAddress("");
                    } finally {
                        setLoadingCity(false);
                    }
                },
                async (error) => {
                    console.error("Error de geolocalización:", error.code, error.message);
                    setLoadingCity(false);
                    setLocationError(true);
                    
                    // Si es código 2 (POSITION_UNAVAILABLE), intentar usar una ubicación por defecto
                    // para desarrollo (Madrid, España)
                    if (error.code === 2) {
                        try {
                            console.log("Intentando usar ubicación por defecto (Madrid) para desarrollo...");
                            const response = await api.post("/locations/get-city-name/", {
                                latitude: 40.4168,
                                longitude: -3.7038,
                            });
                            setCityName(response.data.city_name);
                            setFormattedAddress(response.data.formatted_address || "");
                            setLocationError(false);
                            console.log("Ubicación por defecto cargada:", response.data.city_name);
                        } catch (err) {
                            console.error("Error al obtener ubicación por defecto:", err);
                            setCityName("Ubicación no disponible");
                            setFormattedAddress("");
                        }
                    } else if (error.code === 1) {
                        setCityName("Permiso denegado");
                        setFormattedAddress("");
                    } else {
                        setCityName("Error de ubicación");
                        setFormattedAddress("");
                    }
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 3600000,
                }
            );
        };

        getCurrentLocation();
    }, []);

    const handleTopicSelect = (topic) => {
        if (locationError || cityName === "Ubicación" || cityName === "Permiso denegado" || cityName === "Ubicación no disponible" || cityName === "Error de ubicación") {
            alert("Por favor, permite el acceso a la ubicación en tu navegador y recarga la página. Ve a la configuración del sitio (icono de candado junto a la URL) y permite la geolocalización.");
            return;
        }
        const params = new URLSearchParams({
            city: cityName,
            topic: topic,
        });
        if (formattedAddress) {
            params.append("address", formattedAddress);
        }
        navigate(`/location-description?${params.toString()}`);
    };

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
                            <Link to="/companies" className="d-flex align-items-center text-decoration-none text-dark">
                                <i className="bi bi-building me-2" />
                                <span>Empresas</span>
                            </Link>
                        </li>
                    )}
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
                    <li className="mb-2 position-relative">
                        <button
                            className="btn btn-link p-0 d-flex align-items-center text-decoration-none text-dark w-100 text-start border-0"
                            type="button"
                            onClick={() => setShowDropdown(!showDropdown)}
                        >
                            <i className="bi bi-geo-alt me-2" />
                            <span className="flex-grow-1 text-truncate">
                                {loadingCity ? "Cargando..." : cityName}
                            </span>
                            <i className={`bi bi-chevron-${showDropdown ? "up" : "down"} ms-auto`} />
                        </button>
                        {showDropdown && (
                            <ul 
                                className="dropdown-menu show position-absolute start-0 mt-1"
                                style={{ zIndex: 1000, minWidth: "200px" }}
                            >
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleTopicSelect("Historia");
                                            setShowDropdown(false);
                                        }}
                                    >
                                        Historia
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleTopicSelect("Geografía");
                                            setShowDropdown(false);
                                        }}
                                    >
                                        Geografía
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => {
                                            handleTopicSelect("Economía");
                                            setShowDropdown(false);
                                        }}
                                    >
                                        Economía
                                    </button>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
