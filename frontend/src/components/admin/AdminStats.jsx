import { useNavigate } from "react-router-dom";

export default function AdminStats({
  users = [],
  patients = [],
  physicians = [],
  sessions = [],
  auditLogs = [],
}) {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Users",
      value: users.length,
      path: "/admin/users",
    },
    {
      title: "Patients",
      value: patients.length,
      path: "/admin/patients",
    },
    {
      title: "Physicians",
      value: physicians.length,
      path: "/admin/physicians",
    },
    {
      title: "Sessions",
      value: sessions.length,
      path: "/admin/sessions",
    },
    {
      title: "Audit Logs",
      value: auditLogs.length,
      path: "/admin/audit-logs",
    },
  ];

  return (
    <div className="admin-stats">
      {stats.map((stat) => (
        <button
          type="button"
          key={stat.title}
          className="admin-stat-card admin-stat-clickable"
          onClick={() => navigate(stat.path)}
        >
          <span>
            {stat.title}
          </span>

          <strong>
            {stat.value}
          </strong>

          <small>
            View details →
          </small>
        </button>
      ))}
    </div>
  );
}