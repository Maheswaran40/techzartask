
import { useEffect, useState } from "react";
import {
  FiUsers,
  FiUserCheck,
  FiLayers,
  FiClock,
  FiArrowUpRight,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import api from "../services/api";
import DashboardSkeleton from "../components/DashboardSkeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    api
      .get("/employees/stats")
      .then(({ data }) => {
        if (isMounted) {
          setStats(data);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(
            err.response?.data?.message ||
              "Could not load dashboard"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Show the dashboard skeleton while the API is loading
  if (loading) {
    return <DashboardSkeleton />;
  }

  const cards = stats
    ? [
        {
          label: "Total employees",
          value: stats.totalEmployees,
          icon: FiUsers,
          tint: "bg-blue-50 text-blue-600",
        },
        {
          label: "Active employees",
          value: stats.activeEmployees,
          icon: FiUserCheck,
          tint: "bg-emerald-50 text-emerald-600",
        },
        {
          label: "Departments",
          value: stats.totalDepartments,
          icon: FiLayers,
          tint: "bg-violet-50 text-violet-600",
        },
        {
          label: "Recently added",
          value: stats.recentEmployees?.length ?? 0,
          icon: FiClock,
          tint: "bg-amber-50 text-amber-600",
        },
      ]
    : [];

  return (
    <div>
      {/* Dashboard heading */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-blue-600">
            Overview
          </p>

          <h2 className="mt-1 text-3xl font-bold text-slate-900">
            Dashboard
          </h2>

          <p className="mt-2 text-slate-500">
            Here's what's happening with your team.
          </p>
        </div>

        <Link
          to="/admin/employees"
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Manage employees
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Statistic cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, tint }) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl ${tint}`}
              >
                <Icon size={21} />
              </span>

              <FiArrowUpRight className="text-slate-300" />
            </div>

            <p className="mt-5 text-sm text-slate-500">
              {label}
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Recently added employees */}
      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold">
          Recently added employees
        </h3>

        <div className="mt-4 divide-y divide-slate-100">
          {stats?.recentEmployees?.length ? (
            stats.recentEmployees.map((emp) => (
              <div
                key={emp._id}
                className="flex items-center justify-between gap-3 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-50 font-bold text-blue-700">
                    {emp.fullName?.slice(0, 1) || "?"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold">
                      {emp.fullName}
                    </p>

                    <p className="text-sm text-slate-500">
                      {emp.designation} · {emp.department}
                    </p>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    emp.employmentStatus === "Active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {emp.employmentStatus}
                </span>
              </div>
            ))
          ) : (
            <p className="py-5 text-sm text-slate-500">
              No employee records yet. Add your first employee
              from the employee management page.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
