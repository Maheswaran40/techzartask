import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiBriefcase, FiLock, FiMail, FiArrowRight } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, checking, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!checking && user)
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/employee/dashboard"}
        replace
      />
    );

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const loggedInUser = await login(email, password);
      const target =
        loggedInUser.role === "admin"
          ? "/admin/dashboard"
          : "/employee/dashboard";
      navigate(location.state?.from?.pathname || target, { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Check the API server.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden flex-col justify-between bg-slate-950 p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-500">
            <FiBriefcase size={22} />
          </div>
          <span className="text-xl font-bold">PeopleDesk</span>
        </div>
        <div className="max-w-lg">
          <p className="mb-5 inline-flex rounded-full border border-blue-400/30 bg-blue-400/10 px-3 py-1 text-sm text-blue-200">
            People-first workspace
          </p>
          <h1 className="text-5xl font-bold leading-tight">
            Manage your people, <span className="text-blue-400">simply.</span>
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-400">
            A clear workspace for employee records, profiles, and everyday HR
            tasks.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Secure access for administrators and employees.
        </p>
      </section>
      <section className="grid place-items-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-5 grid h-12 w-12 place-items-center rounded-xl bg-blue-600 text-white">
              <FiBriefcase size={23} />
            </div>
            <h1 className="text-2xl font-bold">PeopleDesk</h1>
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Welcome back
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-slate-500">
            Enter your work credentials to continue.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Work email
              </span>
              <span className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                <FiMail className="text-slate-400" />
                <input
                  required
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full border-0 py-3 outline-none"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </span>
              <span className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50">
                <FiLock className="text-slate-400" />
                <input
                  required
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border-0 py-3 outline-none"
                />
              </span>
            </label>
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"} {!busy && <FiArrowRight />}
            </button>
          </form>
          <p className="mt-8 text-center text-xs leading-5 text-slate-400">
            Access is managed by your organization. Contact your administrator
            if you need an account.
          </p>
          <p className="text-gray-500 text-center">admin : admin@techzarinfo.com <br /> password :techzarinfoMahes</p>
        </div>
      </section>
    </div>
  );
}
