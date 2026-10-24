import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiSearch, FiEye, FiTrash2, FiEdit2 } from "react-icons/fi";
import api from "../services/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const { data } = await api.get("/employees", { params: { search, department, status } });
      setEmployees(data.employees);
    } catch (err) { setError(err.response?.data?.message || "Could not load employees"); }
    finally { setLoading(false); }
  }, [search, department, status]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  async function removeEmployee(employee) {
    if (!window.confirm(`Delete ${employee.fullName}'s employee account? This cannot be undone.`)) return;
    try { await api.delete(`/employees/${employee._id}`); await load(); }
    catch (err) { setError(err.response?.data?.message || "Could not delete employee"); }
  }

  const departments = [...new Set(employees.map(e => e.department).filter(Boolean))];
  return <div>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-medium text-blue-600">People directory</p><h2 className="mt-1 text-3xl font-bold">Employees</h2><p className="mt-2 text-slate-500">Create and manage employee records.</p></div><Link to="/admin/employees/add" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"><FiPlus /> Add employee</Link></div>
    <div className="mb-5 grid gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm md:grid-cols-[1fr_190px_160px]">
      <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><FiSearch className="text-slate-400" /><input className="w-full py-2.5 outline-none" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or email…" /></label>
      <select className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={department} onChange={e => setDepartment(e.target.value)}><option value="">All departments</option>{departments.map(d => <option key={d}>{d}</option>)}</select>
      <select className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm" value={status} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option><option>Active</option><option>Inactive</option><option>On Leave</option></select>
    </div>
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-4">Employee</th><th className="px-5 py-4">Department</th><th className="px-5 py-4">Designation</th><th className="px-5 py-4">Status</th><th className="px-5 py-4 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">
        {loading ? <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-500">Loading employees…</td></tr> : employees.length === 0 ? <tr><td colSpan="5" className="px-5 py-12 text-center text-slate-500">No employees found. Try another search or add an employee.</td></tr> : employees.map(emp => <tr key={emp._id} className="hover:bg-slate-50/70"><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 font-bold text-blue-700">{emp.fullName?.slice(0,1)?.toUpperCase()}</div><div><p className="font-semibold text-slate-900">{emp.fullName}</p><p className="text-xs text-slate-500">{emp.email}</p></div></div></td><td className="px-5 py-4 text-slate-600">{emp.department}</td><td className="px-5 py-4 text-slate-600">{emp.designation}</td><td className="px-5 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold">{emp.employmentStatus}</span></td><td className="px-5 py-4"><div className="flex justify-end gap-1"><Link title="View" to={`/admin/employees/${emp._id}`} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><FiEye /></Link><Link title="Edit" to={`/admin/employees/${emp._id}/edit`} className="rounded-lg p-2 text-slate-500 hover:bg-blue-50 hover:text-blue-600"><FiEdit2 /></Link><button title="Delete" onClick={() => removeEmployee(emp)} className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"><FiTrash2 /></button></div></td></tr>)}
      </tbody></table></div>
      <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">{employees.length} employee{employees.length === 1 ? "" : "s"} shown</div>
    </div>
  </div>;
}
