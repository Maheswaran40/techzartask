import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppShell from "./components/AppShell";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeList from "./pages/EmployeeList";
import EmployeeForm from "./pages/EmployeeForm";
import EmployeePortal from "./pages/EmployeePortal";

function HomeRedirect() {
  const { user, checking } = useAuth();
  if (checking) return <div className="grid min-h-screen place-items-center text-slate-500">Loading…</div>;
  return <Navigate to={!user ? "/login" : user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"} replace />;
}

function RouteTable() {
  return <Routes>
    <Route path="/login" element={<Login />} />
    <Route element={<ProtectedRoute roles={["admin"]} />}>
      <Route path="/admin" element={<AppShell role="admin" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="employees" element={<EmployeeList />} />
        <Route path="employees/add" element={<EmployeeForm mode="create" />} />
        <Route path="employees/:id" element={<EmployeeForm mode="view" />} />
        <Route path="employees/:id/edit" element={<EmployeeForm mode="edit" />} />
      </Route>
    </Route>
    <Route element={<ProtectedRoute roles={["employee"]} />}>
      <Route path="/employee" element={<AppShell role="employee" />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<EmployeePortal />} />
        <Route path="profile" element={<EmployeePortal profileOnly />} />
      </Route>
    </Route>
    <Route path="*" element={<HomeRedirect />} />
  </Routes>;
}

export default function App() {
  return <BrowserRouter><AuthProvider><RouteTable /></AuthProvider></BrowserRouter>;
}
