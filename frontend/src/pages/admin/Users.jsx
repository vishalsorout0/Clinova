import {
  useEffect,
  useState,
} from "react";

import {
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../../services/adminService";

import UserTable from "../../components/admin/UserTable";


export default function Users() {
  const [users, setUsers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response =
        await getUsers();

      setUsers(
        Array.isArray(response)
          ? response
          : response?.users || []
      );

    } catch (err) {
      setError(
        err.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadUsers();
  }, []);


  async function handleRoleChange(
    user,
    role
  ) {
    if (role === user.role) {
      return;
    }

    try {
      await updateUserRole(
        user.id,
        role
      );

      await loadUsers();

    } catch (err) {
      setError(
        err.message ||
          "Unable to update role."
      );
    }
  }


  async function handleStatusChange(
    user,
    isActive
  ) {
    try {
      await updateUserStatus(
        user.id,
        isActive
      );

      await loadUsers();

    } catch (err) {
      setError(
        err.message ||
          "Unable to update status."
      );
    }
  }


  return (
    <div className="admin-dashboard">

      <header className="admin-header">

        <span>
          CLINOVA ADMIN
        </span>

        <h1>
          Users
        </h1>

        <p>
          Manage user roles and account
          status.
        </p>

      </header>


      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}


      {loading ? (
        <div className="loading-state">
          Loading users...
        </div>
      ) : (
        <section className="admin-section">

          <UserTable
            users={users}
            onRoleChange={
              handleRoleChange
            }
            onStatusChange={
              handleStatusChange
            }
          />

        </section>
      )}

    </div>
  );
}