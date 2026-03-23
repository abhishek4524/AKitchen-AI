import React, { useState, useEffect } from 'react';
import { usersAPI } from '../utils/api';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usersAPI.getAll();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Users Manager</h1>
        <p className="text-gray-500 mt-1">Total: {users.length} users</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
      </div>

      {/* Users Grid and Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Saved Recipes</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr
                          key={user._id}
                          className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedUser?._id === user._id ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                                {user.name?.charAt(0) || 'U'}
                              </div>
                              <span className="font-medium text-gray-800">{user.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                              {user.savedRecipes?.length || 0}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedUser(user);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* User Details Sidebar */}
        <div>
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-20">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">User Details</h2>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-3xl">
                    {selectedUser.name?.charAt(0) || 'U'}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Name</p>
                  <p className="font-semibold text-gray-800">{selectedUser.name || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-semibold text-gray-800 break-all">{selectedUser.email}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Saved Recipes</p>
                  <p className="font-semibold text-gray-800">{selectedUser.savedRecipes?.length || 0}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Created Recipes</p>
                  <p className="font-semibold text-gray-800">{selectedUser.createdRecipes?.length || 0}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Joined</p>
                  <p className="font-semibold text-gray-800">
                    {selectedUser.createdAt
                      ? new Date(selectedUser.createdAt).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">Status</p>
                  <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Active
                  </span>
                </div>

                <button
                  onClick={() => setSelectedUser(null)}
                  className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-6 text-center text-gray-500 sticky top-20">
              <p className="text-lg">👥</p>
              <p>Select a user to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
          <h3 className="font-semibold text-gray-800 mb-2">👥 Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-green-600">
          <h3 className="font-semibold text-gray-800 mb-2">❤️ Avg Saved Recipes</h3>
          <p className="text-3xl font-bold text-green-600">
            {users.length > 0
              ? (
                  users.reduce((sum, u) => sum + (u.savedRecipes?.length || 0), 0) / users.length
                ).toFixed(1)
              : '0'}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-purple-600">
          <h3 className="font-semibold text-gray-800 mb-2">🍳 Avg Created Recipes</h3>
          <p className="text-3xl font-bold text-purple-600">
            {users.length > 0
              ? (
                  users.reduce((sum, u) => sum + (u.createdRecipes?.length || 0), 0) / users.length
                ).toFixed(1)
              : '0'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;