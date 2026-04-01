import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { usersAPI } from '../utils/api';

// Helper components (same as above)
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">👥</div>
    <p className="text-gray-500">{message}</p>
  </div>
);

const useSortableTable = (items, defaultSortKey = 'name', defaultDirection = 'asc') => {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDirection, setSortDirection] = useState(defaultDirection);

  const sortedItems = useMemo(() => {
    if (!items.length) return [];
    const sorted = [...items];
    sorted.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortKey, sortDirection]);

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  return { sortedItems, sortKey, sortDirection, toggleSort };
};

const PaginatedTable = ({ columns, data, rowsPerPage = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIdx = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIdx, startIdx + rowsPerPage);

  if (data.length === 0) {
    return <EmptyState message="No users found" />;
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100"
                  onClick={() => col.sortable && col.onSort?.(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && col.sortKey === col.key && (
                      <span>{col.sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition">
                {columns.map(col => (
                  <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => row.onView?.(row)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    👁️ View
                  </button>
                  <button
                    onClick={() => row.onDelete?.(row._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4 text-sm">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// Main component
const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterPlan, setFilterPlan] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchUsers = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    setError('');
    try {
      const data = await usersAPI.getAll({ signal });
      setUsers(data);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
    return () => abortControllerRef.current?.abort();
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user? This action cannot be undone.')) return;
    try {
      // Assuming usersAPI has a delete method
      await usersAPI.delete(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      if (selectedUser?._id === id) setSelectedUser(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change role to ${newRole}?`)) return;
    try {
      const updated = await usersAPI.update(user._id, { role: newRole });
      setUsers(prev => prev.map(u => u._id === updated._id ? updated : u));
      if (selectedUser?._id === updated._id) setSelectedUser(updated);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterRole !== 'all' && user.role !== filterRole) return false;
    if (filterPlan !== 'all' && user.plan !== filterPlan) return false;
    return true;
  });

  // Sorting
  const { sortedItems, sortKey, sortDirection, toggleSort } = useSortableTable(filteredUsers, 'name', 'asc');

  // Columns
  const columns = useMemo(() => [
    { key: 'name', label: 'Name', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
            {row.name?.charAt(0) || 'U'}
          </div>
          <span className="font-medium text-gray-800">{row.name || 'Unknown'}</span>
        </div>
      )
    },
    { key: 'email', label: 'Email', sortable: true, onSort: toggleSort, sortKey, sortDirection },
    { key: 'role', label: 'Role', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => (
        <span className={`px-2 py-1 rounded text-xs font-semibold ${row.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
          {row.role === 'admin' ? 'Admin' : 'User'}
        </span>
      )
    },
    { key: 'plan', label: 'Plan', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => row.plan || 'free'
    },
    { key: 'savedRecipes', label: 'Saved', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">{row.savedRecipes?.length || 0}</span>
    },
    { key: 'createdAt', label: 'Joined', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : '-'
    },
  ], [toggleSort, sortKey, sortDirection]);

  // Add view/delete handlers to rows
  const tableData = sortedItems.map(user => ({
    ...user,
    onView: setSelectedUser,
    onDelete: handleDelete,
  }));

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Users Manager</h1>
          <p className="text-gray-500 mt-1">Manage users, view details, and control roles.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
        >
          🔄 Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        <select value={filterPlan} onChange={(e) => setFilterPlan(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
          <option value="pro">Pro</option>
        </select>
      </div>

      {/* Users Table and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <PaginatedTable columns={columns} data={tableData} rowsPerPage={10} />
          </div>
        </div>

        {/* User Details Sidebar */}
        <div>
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-20">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">User Details</h2>
                <button onClick={() => setSelectedUser(null)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-3xl">
                  {selectedUser.name?.charAt(0) || 'U'}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-semibold text-gray-800">{selectedUser.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-semibold text-gray-800 break-all">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Role</p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                      {selectedUser.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                    <button
                      onClick={() => handleRoleToggle(selectedUser)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Toggle Role
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Plan</p>
                  <p className="font-semibold text-gray-800">{selectedUser.plan || 'free'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Saved Recipes</p>
                  <p className="font-semibold text-gray-800">{selectedUser.savedRecipes?.length || 0}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Joined</p>
                  <p className="font-semibold text-gray-800">
                    {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Settings</p>
                  <p className="text-gray-700 text-sm">
                    Theme: {selectedUser.settings?.theme || 'light'}<br />
                    Notifications: {selectedUser.settings?.notifications ? 'On' : 'Off'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleDelete(selectedUser._id)}
                className="w-full mt-6 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg font-medium transition-all"
              >
                Delete User
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 sticky top-20">
              <p className="text-4xl mb-2">👤</p>
              <p>Select a user to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-600">
          <h3 className="font-semibold text-gray-800">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-600">
          <h3 className="font-semibold text-gray-800">Admins</h3>
          <p className="text-3xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-600">
          <h3 className="font-semibold text-gray-800">Premium Users</h3>
          <p className="text-3xl font-bold text-green-600">{users.filter(u => u.plan !== 'free').length}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;