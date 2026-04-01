import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { recipesAPI, usersAPI, itemsAPI } from '../utils/api';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// ----------------------------------------------------------------------
// Custom hook to fetch dashboard data (adjusted for schemas)
// ----------------------------------------------------------------------
const useDashboardData = () => {
  const [data, setData] = useState({
    stats: {
      totalRecipes: 0,
      aiRecipes: 0,
      totalUsers: 0,
      totalItems: 0,
      totalReviews: 0,
    },
    userRecipes: [],
    reviews: [],
    users: [],
    allRecipesDetail: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    setError(null);

    try {
      // 1. Fetch recipes, users, items in parallel
      const [recipes, usersData, items] = await Promise.all([
        recipesAPI.getAll({ signal }),
        usersAPI.getAll({ signal }),
        itemsAPI.getAll({ signal }),
      ]);

      // 2. Fetch reviews
      const reviewsRes = await fetch(`${API_URL}/reviews`, { signal })
        .then(r => r.json())
        .catch(() => []);

      // 3. Compute derived stats
      const aiRecipes = recipes.filter(r => r.aiGenerated).length;
      const totalReviews = Array.isArray(reviewsRes) ? reviewsRes.length : 0;

      // 4. Build user recipe map using 'createdBy' (populated or ID)
      const userRecipeMap = new Map();
      recipes.forEach(recipe => {
        // If createdBy is populated, it will be an object with _id; else it's just the ID string
        const userId = recipe.createdBy?._id || recipe.createdBy;
        if (userId) {
          if (!userRecipeMap.has(userId)) userRecipeMap.set(userId, []);
          userRecipeMap.get(userId).push(recipe);
        }
      });

      // 5. Create sorted list of users with recipe counts
      const sortedUserRecipes = Array.from(userRecipeMap.entries())
        .map(([userId, recipeList]) => {
          // Find user info from usersData (if not already populated in recipe)
          const user = usersData.find(u => u._id === userId) || {};
          return {
            userId,
            userName: user.name || 'Unknown',
            userEmail: user.email || 'N/A',
            recipeCount: recipeList.length,
            aiRecipeCount: recipeList.filter(r => r.aiGenerated).length,
            recipes: recipeList,
          };
        })
        .sort((a, b) => b.recipeCount - a.recipeCount);

      // 6. Detailed recipe list with user info (from populated createdBy or usersData)
      const detailedRecipes = recipes.map(recipe => {
        let userName = 'Unknown User';
        let userEmail = 'N/A';
        if (recipe.createdBy) {
          if (typeof recipe.createdBy === 'object') {
            userName = recipe.createdBy.name || 'Unknown User';
            userEmail = recipe.createdBy.email || 'N/A';
          } else {
            const user = usersData.find(u => u._id === recipe.createdBy);
            if (user) {
              userName = user.name;
              userEmail = user.email;
            }
          }
        }
        return {
          ...recipe,
          userName,
          userEmail,
        };
      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // 7. Sort reviews by date (newest first) and attach user names if populated
      const sortedReviews = Array.isArray(reviewsRes)
        ? reviewsRes
            .map(review => ({
              ...review,
              // If review.user is populated, use its name; otherwise fallback to review.name
              displayName: review.user?.name || review.name || 'Anonymous',
            }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];

      setData({
        stats: {
          totalRecipes: recipes.length,
          aiRecipes,
          totalUsers: usersData.length,
          totalItems: items.length,
          totalReviews,
        },
        userRecipes: sortedUserRecipes,
        reviews: sortedReviews,
        users: usersData,
        allRecipesDetail: detailedRecipes,
      });
      setLastUpdated(new Date());
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Failed to fetch dashboard data');
        console.error('Dashboard data error:', err);
      }
    } finally {
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  return { ...data, loading, error, refetch: fetchData, lastUpdated };
};

// ----------------------------------------------------------------------
// Helper components
// ----------------------------------------------------------------------
const StatCard = ({ title, value, icon, color, gradient }) => (
  <div className={`bg-gradient-to-br ${gradient} rounded-2xl shadow-lg p-6 transition-all hover:scale-105 hover:shadow-xl`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-white/80 text-sm font-medium">{title}</p>
        <p className="text-3xl font-bold text-white mt-2">{value}</p>
      </div>
      <div className="text-5xl text-white/90">{icon}</div>
    </div>
  </div>
);

const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gray-200 rounded-2xl h-28"></div>
      ))}
    </div>
    <div className="h-64 bg-gray-200 rounded-xl"></div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">📭</div>
    <p className="text-gray-500">{message}</p>
  </div>
);

// Simple donut chart to show AI vs Manual
const DonutChart = ({ aiCount, manualCount }) => {
  const total = aiCount + manualCount;
  if (total === 0) return <div className="text-center text-gray-500">No recipes</div>;
  const aiPercent = (aiCount / total) * 100;
  const manualPercent = (manualCount / total) * 100;

  // SVG donut
  const size = 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const aiOffset = circumference - (aiPercent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={aiOffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div className="mt-2 text-sm">
        <span className="inline-block w-3 h-3 bg-purple-500 rounded-full mr-1"></span> AI ({aiCount})
        <span className="ml-2 inline-block w-3 h-3 bg-gray-300 rounded-full mr-1"></span> Manual ({manualCount})
      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// Table components with sorting & pagination (unchanged but reusable)
// ----------------------------------------------------------------------
const useSortableTable = (items, defaultSortKey = 'recipeCount', defaultDirection = 'desc') => {
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
    return <EmptyState message="No data available" />;
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
          <span>
            Page {currentPage} of {totalPages}
          </span>
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

// ----------------------------------------------------------------------
// Main Dashboard Component
// ----------------------------------------------------------------------
const Dashboard = () => {
  const {
    stats,
    userRecipes,
    reviews,
    allRecipesDetail,
    loading,
    error,
    refetch,
    lastUpdated,
  } = useDashboardData();

  // Sorting for user recipes table
  const {
    sortedItems: sortedUserRecipes,
    sortKey: userSortKey,
    sortDirection: userSortDirection,
    toggleSort: toggleUserSort,
  } = useSortableTable(userRecipes, 'recipeCount', 'desc');

  // Sorting for recipes table
  const {
    sortedItems: sortedRecipes,
    sortKey: recipeSortKey,
    sortDirection: recipeSortDirection,
    toggleSort: toggleRecipeSort,
  } = useSortableTable(allRecipesDetail, 'createdAt', 'desc');

  // Columns definitions for user recipes table
  const userColumns = useMemo(() => [
    { key: 'userName', label: 'User Name', sortable: true, onSort: toggleUserSort, sortKey: userSortKey, sortDirection: userSortDirection },
    { key: 'userEmail', label: 'Email', sortable: true, onSort: toggleUserSort, sortKey: userSortKey, sortDirection: userSortDirection, className: 'text-xs' },
    { key: 'recipeCount', label: 'Total Recipes', sortable: true, onSort: toggleUserSort, sortKey: userSortKey, sortDirection: userSortDirection, className: 'text-center',
      render: row => <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">{row.recipeCount}</span>
    },
    { key: 'aiRecipeCount', label: 'AI Generated', sortable: true, onSort: toggleUserSort, sortKey: userSortKey, sortDirection: userSortDirection, className: 'text-center',
      render: row => <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-semibold">{row.aiRecipeCount}</span>
    },
    { key: 'recipes', label: 'Recipe Titles', sortable: false,
      render: row => (
        <div className="text-xs text-gray-600 max-h-16 overflow-y-auto">
          {row.recipes.slice(0, 3).map((recipe, i) => (
            <div key={i} className="mb-1">
              • {recipe.title} {recipe.aiGenerated ? '🤖' : ''}
            </div>
          ))}
          {row.recipes.length > 3 && (
            <div className="text-gray-500 italic">+{row.recipes.length - 3} more</div>
          )}
        </div>
      )
    },
  ], [toggleUserSort, userSortKey, userSortDirection]);

  // Columns for all recipes table
  const recipeColumns = useMemo(() => [
    { key: 'title', label: 'Recipe Title', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'max-w-xs truncate' },
    { key: 'userName', label: 'Generated By', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'font-medium' },
    { key: 'userEmail', label: 'Email', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'text-xs' },
    { key: 'aiGenerated', label: 'Type', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'text-center',
      render: row => (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
          row.aiGenerated ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {row.aiGenerated ? '🤖 AI' : '👤 Manual'}
        </span>
      )
    },
    { key: 'cuisine', label: 'Cuisine', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'text-center' },
    { key: 'difficulty', label: 'Difficulty', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'text-center',
      render: row => row.difficulty ? (
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
          row.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
          row.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.difficulty}
        </span>
      ) : '-'
    },
    { key: 'time', label: 'Time', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'text-center' },
    { key: 'createdAt', label: 'Created', sortable: true, onSort: toggleRecipeSort, sortKey: recipeSortKey, sortDirection: recipeSortDirection, className: 'text-xs whitespace-nowrap',
      render: row => row.createdAt ? new Date(row.createdAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }) : '-'
    },
  ], [toggleRecipeSort, recipeSortKey, recipeSortDirection]);

  if (loading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header with refresh button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Monitor your platform's activity at a glance.</p>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-1">Last updated: {lastUpdated.toLocaleString()}</p>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-sm"
        >
          🔄 Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Stats Grid with gradient cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Recipes" value={stats.totalRecipes} icon="🍳" gradient="from-blue-500 to-blue-600" />
        <StatCard title="AI Generated" value={stats.aiRecipes} icon="🤖" gradient="from-purple-500 to-purple-600" />
        <StatCard title="Total Users" value={stats.totalUsers} icon="👥" gradient="from-green-500 to-green-600" />
        <StatCard title="Grocery Items" value={stats.totalItems} icon="🛒" gradient="from-orange-500 to-orange-600" />
        <StatCard title="Total Reviews" value={stats.totalReviews} icon="⭐" gradient="from-yellow-500 to-yellow-600" />
      </div>

      {/* Quick Actions and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
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
          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
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
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Recipe Distribution</h2>
          <DonutChart aiCount={stats.aiRecipes} manualCount={stats.totalRecipes - stats.aiRecipes} />
        </div>
      </div>

      {/* User Recipe Statistics */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📊 User Recipe Generation Stats
        </h2>
        <PaginatedTable
          columns={userColumns}
          data={sortedUserRecipes}
          rowsPerPage={5}
        />
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          ⭐ Recent Reviews ({stats.totalReviews})
        </h2>
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.slice(0, 8).map((review, idx) => (
              <div key={idx} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{review.displayName}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className="text-lg font-bold text-yellow-500">
                    {'⭐'.repeat(review.rating || 5)}
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{review.comment || 'No comment'}</p>
              </div>
            ))
          ) : (
            <EmptyState message="No reviews yet" />
          )}
          {reviews.length > 8 && (
            <div className="text-center text-gray-600 text-sm pt-4">
              Showing 8 of {reviews.length} reviews
            </div>
          )}
        </div>
      </div>

      {/* Detailed Recipe Records */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📖 Detailed Recipe Generator Records
        </h2>
        <PaginatedTable
          columns={recipeColumns}
          data={sortedRecipes}
          rowsPerPage={10}
        />
      </div>

      {/* System Info */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
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
            <p className="text-lg font-semibold text-gray-800">{lastUpdated ? lastUpdated.toLocaleDateString() : '-'}</p>
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