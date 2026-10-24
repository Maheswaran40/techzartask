import { useEffect, useState } from "react";
import { FiBriefcase, FiCalendar, FiPhone, FiCamera, FiUser } from "react-icons/fi";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function EmployeePortal({ profileOnly = false }) {
  const { user, refreshUser } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try { const { data } = await api.get("/employees/me/profile"); setEmployee(data.employee); setPhone(data.employee.phone || ""); }
    catch (err) { setError(err.response?.data?.message || "Could not load your profile"); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);

  async function savePhone(e) {
    e.preventDefault(); setError(""); setMessage("");
    try { const { data } = await api.patch("/employees/me/profile", { phone }); setEmployee(data.employee); setMessage("Profile updated successfully."); }
    catch (err) { setError(err.response?.data?.message || "Could not update profile"); }
  }

  async function uploadImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg","image/png","image/webp"].includes(file.type)) { setError("Choose a JPEG, PNG, or WebP image."); return; }
    if (file.size > 2 * 1024 * 1024) { setError("Image must be 2 MB or smaller."); return; }
    const formData = new FormData(); formData.append("profileImage", file);
    setError(""); setMessage("");
    try { const { data } = await api.post("/employees/me/profile-image", formData); setEmployee(data.employee); setMessage("Profile image updated."); }
    catch (err) { setError(err.response?.data?.message || "Image upload failed"); }
  }

  if (loading) return <p className="text-slate-500">Loading your profile…</p>;
  if (!employee) return <p className="rounded-xl bg-amber-50 p-4 text-amber-800">{error || "Your employee profile has not been created. Contact your administrator."}</p>;

  const imageUrl = employee.profileImage?.filename ? `${import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") || "http://localhost:5000"}/uploads/${employee.profileImage.filename}` : "";
  return <div className="mx-auto max-w-5xl">
    {!profileOnly && <div className="mb-8"><p className="text-sm font-medium text-blue-600">Your workspace</p><h2 className="mt-1 text-3xl font-bold">Welcome back, {employee.fullName.split(" ")[0]}.</h2><p className="mt-2 text-slate-500">Here’s a quick overview of your employment profile.</p></div>}
    {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {message && <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
    <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
      <section className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
        {imageUrl ? <img src={imageUrl} alt="Profile" className="mx-auto h-24 w-24 rounded-full object-cover" /> : <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-blue-50 text-3xl font-bold text-blue-700">{employee.fullName?.slice(0,1)}</div>}
        <h3 className="mt-4 text-xl font-bold">{employee.fullName}</h3><p className="mt-1 text-sm text-slate-500">{employee.designation}</p><p className="mt-3 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{employee.employmentStatus}</p>
        <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-50"><FiCamera /> Change photo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={uploadImage} className="hidden" /></label>
        <p className="mt-2 text-xs text-slate-400">JPEG, PNG or WebP · max 2 MB</p>
      </section>
      <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
        <h3 className="text-lg font-bold">Employment details</h3>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Detail icon={FiUser} label="Employee ID" value={employee.employeeId} />
          <Detail icon={FiBriefcase} label="Department" value={employee.department} />
          <Detail icon={FiBriefcase} label="Designation" value={employee.designation} />
          <Detail icon={FiCalendar} label="Joining date" value={employee.joiningDate ? new Date(employee.joiningDate).toLocaleDateString() : "—"} />
          <Detail icon={FiUser} label="Work email" value={employee.email} />
        </div>
        <form onSubmit={savePhone} className="mt-8 border-t border-slate-100 pt-6">
          <h4 className="mb-4 font-semibold">Personal information</h4><label className="block max-w-md"><span className="mb-2 block text-sm font-medium text-slate-600">Phone number</span><span className="flex items-center gap-3 rounded-xl border border-slate-200 px-3"><FiPhone className="text-slate-400" /><input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Add phone number" className="w-full py-3 outline-none" /></span></label><button className="mt-4 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Save changes</button>
        </form>
      </section>
    </div>
  </div>;
}

function Detail({ icon: Icon, label, value }) {
  return <div className="flex items-start gap-3"><div className="rounded-lg bg-slate-100 p-2 text-slate-600"><Icon size={17} /></div><div><p className="text-xs text-slate-500">{label}</p><p className="mt-1 font-semibold text-slate-800">{value || "—"}</p></div></div>;
}
