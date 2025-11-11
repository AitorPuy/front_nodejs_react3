import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function ProtectedLayout() {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="flex-grow-1 p-4">
                <Outlet />
            </div>
        </div>
    );
}
