export default function Welcome() {
    return (
        <div>
            <h2 className="mb-4">Dashboard</h2>
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small">Nuevos usuarios</span>
                                <i className="bi bi-person-plus text-primary" />
                            </div>
                            <h3 className="mb-0">5</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small">Ventas</span>
                                <i className="bi bi-bag-check text-success" />
                            </div>
                            <h3 className="mb-0">36</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted small">Suscripciones</span>
                                <i className="bi bi-graph-up-arrow text-warning" />
                            </div>
                            <h3 className="mb-0">12</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-3">
                <div className="col-lg-8">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h5 className="card-title">Estadísticas de usuarios</h5>
                            <p className="text-muted small mb-0">
                                Aquí podrás mostrar gráficos y analíticas de tu sistema.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h5 className="card-title">Ventas diarias</h5>
                            <p className="text-muted small mb-0">
                                Esta tarjeta puede contener un resumen rápido de KPIs.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
