import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FiUsers, FiHome, FiUser, FiLogOut, FiBriefcase } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function AppShell({ role }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const admin = role === "admin";
  const links = admin
    ? [{ to: "/admin/dashboard", label: "Dashboard", icon: FiHome }, { to: "/admin/employees", label: "Employees", icon: FiUsers }]
    : [{ to: "/employee/dashboard", label: "Dashboard", icon: FiHome }, { to: "/employee/profile", label: "My Profile", icon: FiUser }];

  async function handleLogout() {
    await logout();
    navigate("/login", { replace: true });
  }

  return <div className="min-h-screen bg-slate-50 md:flex">
    <aside className="flex w-full flex-col bg-slate-950 p-5 text-white md:min-h-screen md:w-64">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500"><FiBriefcase size={21} /></div>
        <div><p className="font-bold tracking-wide">PeopleDesk</p><p className="text-xs text-slate-400">Employee management</p></div>
      </div>
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-widest text-slate-500">{admin ? "Administration" : "Employee space"}</p>
      <nav className="flex flex-row gap-2 md:flex-col">
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
          <Icon size={18} />{label}
        </NavLink>)}
      </nav>
      <div className="mt-auto hidden border-t border-slate-800 pt-5 md:block">
        <p className="truncate text-sm font-semibold">{user?.name}</p>
        <p className="mb-4 truncate text-xs text-slate-400">{user?.email}</p>
        <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"><FiLogOut /> Sign out</button>
      </div>
    </aside>
    <main className="min-w-0 flex-1">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 md:px-10">
        <div><p className="text-sm text-slate-500">{admin ? "Admin workspace" : "Employee workspace"}</p><h1 className="text-xl font-bold text-slate-900">{admin ? "Administration" : "My workspace"}</h1></div>
        <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold">{user?.name}</p><p className="text-xs capitalize text-slate-500">{user?.role}</p></div><div className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-bold text-blue-700">{user?.name?.slice(0, 1)?.toUpperCase()}</div>
          <button onClick={handleLogout} title="Sign out" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"><FiLogOut /></button>
        </div>
      </header>
      <div className="p-5 md:p-10"><Outlet /></div>
    </main>
  </div>;
}
