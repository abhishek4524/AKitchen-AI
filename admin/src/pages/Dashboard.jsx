import React, { useState, useEffect } from 'react';
import { recipesAPI, usersAPI, itemsAPI } from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRecipes: 0,
    aiRecipes: 0,
    totalUsers: 0,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const [recipes, users, items] = await Promise.all([
        recipesAPI.getAll(),
        usersAPI.getAll(),
        itemsAPI.getAll(),
      ]);

      const aiRecipes = recipes.filter((r) => r.aiGenerated).length;

      setStats({
        totalRecipes: recipes.length,
        aiRecipes,
        totalUsers: users.length,
        totalItems: items.length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
        </div>
        <div className={`text-4xl ${color}`}>{icon}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your platform.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Recipes" value={stats.totalRecipes} icon="🍳" color="text-blue-600" />
        <StatCard title="AI Generated" value={stats.aiRecipes} icon="🤖" color="text-purple-600" />
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="text-green-600" />
        <StatCard title="Grocery Items" value={stats.totalItems} icon="🛒" color="text-orange-600" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recipes</h2>
            <span className="text-3xl">🍳</span>
          </div>
          <p className="text-gray-500 mb-4">Manage all recipes, add new ones, or delete existing entries.</p>
          <button
            onClick={() => (window.location.href = '/recipes')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
          >
            Manage Recipes
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Users</h2>
            <span className="text-3xl">👥</span>
          </div>
          <p className="text-gray-500 mb-4">View user details, monitor activity, and manage accounts.</p>
          <button
            onClick={() => (window.location.href = '/users')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-lg transition-all"
          >
            Manage Users
          </button>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-blue-600">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">📋 System Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">API Status</p>
            <p className="text-lg font-semibold text-green-600">✓ Connected</p>
          </div>
          <div>
            <p className="text-gray-600">Version</p>
            <p className="text-lg font-semibold text-gray-800">1.0.0</p>
          </div>
          <div>
            <p className="text-gray-600">Last Updated</p>
            <p className="text-lg font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Environment</p>
            <p className="text-lg font-semibold text-blue-600">Production</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;