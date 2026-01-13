import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Welcome from "./pages/Welcome";
import Clients from "./pages/Clients";
import Providers from "./pages/Providers";
import Companies from "./pages/Companies";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedLayout from "./layouts/ProtectedLayout";
import Logout from "./pages/Logout";

export default function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <ProtectedLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Welcome />} />
                    <Route path="clients" element={<Clients />} />
                    <Route path="providers" element={<Providers />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="change-password" element={<ChangePassword />} />
                    <Route path="logout" element={<Logout />} />

                    <Route
                        path="companies"
                        element={
                            <ProtectedRoute role="admin">
                                <Companies />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="users"
                        element={
                            <ProtectedRoute role="admin">
                                <Users />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
