import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import api from "../services/api";

const initial = { fullName: "", email: "", password: "", employeeId: "", phone: "", department: "", designation: "", joiningDate: "", employmentStatus: "Active" };

export default function EmployeeForm({ mode = "create" }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (mode === "edit" || mode === "view") {
      api.get(`/employees/${id}`).then(({ data }) => setForm({ ...initial, ...data.employee, joiningDate: data.employee.joiningDate ? data.employee.joiningDate.slice(0,10) : "", password: "" }))
        .catch(err => setError(err.response?.data?.message || "Could not load employee"));
    }
  }, [id, mode]);

  function update(e) { setForm(prev => ({ ...prev, [e.target.name]: e.target.value })); }

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    const payload = { ...form };
    if (mode === "edit") delete payload.password;
    try {
      if (mode === "create") await api.post("/employees", payload);
      else await api.put(`/employees/${id}`, payload);
      navigate("/admin/employees");
    } catch (err) { setError(err.response?.data?.message || "Unable to save employee"); }
    finally { setBusy(false); }
  }

  const readOnly = mode === "view";
  const fields = [
    ["fullName","Full name","text",true], ["email","Work email","email",true], ["employeeId","Employee ID","text",true],
    ["phone","Phone number","tel",false], ["department","Department","text",true], ["designation","Designation","text",true],
    ["joiningDate","Joining date","date",true]
  ];
  return <div className="mx-auto max-w-4xl">
    <Link to="/admin/employees" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600"><FiArrowLeft /> Back to employees</Link>
    <div className="mb-6"><p className="text-sm font-medium text-blue-600">Employee records</p><h2 className="mt-1 text-3xl font-bold">{mode === "create" ? "Add employee" : mode === "edit" ? "Edit employee" : "Employee details"}</h2></div>
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    <form onSubmit={submit} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map(([name,label,type,required]) => <label key={name} className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}{required && " *"}</span><input name={name} type={type} required={required && mode === "create"} readOnly={readOnly} value={form[name] || ""} onChange={update} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 read-only:bg-slate-50" /></label>)}
        {mode === "create" && <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Initial password *</span><input name="password" type="password" required minLength="8" value={form.password} onChange={update} className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50" /><span className="mt-1 block text-xs text-slate-400">At least 8 characters.</span></label>}
        <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">Employment status</span><select disabled={readOnly} name="employmentStatus" value={form.employmentStatus || "Active"} onChange={update} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3"><option>Active</option><option>Inactive</option><option>On Leave</option></select></label>
      </div>
      {!readOnly && <div className="mt-8 flex justify-end"><button disabled={busy} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"><FiSave />{busy ? "Saving…" : "Save employee"}</button></div>}
    </form>
  </div>;
}
