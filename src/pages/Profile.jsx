import { useEffect, useState } from "react";
import api from "../api/axiosConfig";

export default function Profile() {
    const [data, setData] = useState({});

    useEffect(() => {
        api.get("/accounts/me/").then((res) => setData(res.data));
    }, []);

    return (
        <>
            <h3>Mi Perfil</h3>
            <div>Email: {data.email}</div>
        </>
    );
}
