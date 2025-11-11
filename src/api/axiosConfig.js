import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let pending = [];

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const refresh = localStorage.getItem("refresh");
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_URL}/accounts/token/refresh/`,
                        { refresh }
                    );

                    localStorage.setItem("access", res.data.access);

                    pending.forEach((cb) => cb(res.data.access));
                    pending = [];
                } catch (err) {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    window.location.href = "/login";
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                pending.push((token) => {
                    original.headers.Authorization = `Bearer ${token}`;
                    resolve(api(original));
                });
            });
        }

        return Promise.reject(error);
    }
);

export default api;
