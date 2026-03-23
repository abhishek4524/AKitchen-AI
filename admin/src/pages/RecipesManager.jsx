import React, { useState, useEffect } from 'react';
import { recipesAPI } from '../utils/api';

const RecipesManager = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cuisine: '',
    diet: '',
    time: '',
    difficulty: '',
    image: '',
    ingredients: [],
    steps: [],
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await recipesAPI.getAll();
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;

    try {
      await recipesAPI.delete(id);
      setRecipes(recipes.filter((r) => r._id !== id));
      alert('Recipe deleted successfully');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === 'ai') return matchesSearch && recipe.aiGenerated;
    if (filterType === 'original') return matchesSearch && !recipe.aiGenerated;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Recipes Manager</h1>
          <p className="text-gray-500 mt-1">Total: {recipes.length} recipes</p>
        </div>
        <button
          onClick={() => {
            setEditingRecipe(null);
            setFormData({
              title: '',
              description: '',
              cuisine: '',
              diet: '',
              time: '',
              difficulty: '',
              image: '',
              ingredients: [],
              steps: [],
            });
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
        >
          {showForm ? '✕ Close Form' : '+ Add Recipe'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-64 px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        >
          <option value="all">All Recipes</option>
          <option value="ai">AI Generated</option>
          <option value="original">Original</option>
        </select>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <p className="text-gray-500 text-sm mb-4">
            Note: Use comma-separated values for ingredients and steps
          </p>
          <div className="bg-blue-50 p-4 rounded-lg text-blue-700">
            <p>📝 Recipe form is available via API. To add recipes, use the client app or API directly.</p>
          </div>
        </div>
      )}

      {/* Recipes Table */}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Cuisine</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Diet</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Type</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">Actions</th>
                 </tr>
              </thead>
              <tbody>
                {filteredRecipes.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No recipes found
                    </td>
                  </tr>
                ) : (
                  filteredRecipes.map((recipe) => (
                    <tr key={recipe._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={recipe.image || 'https://via.placeholder.com/40'}
                            alt={recipe.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <span className="font-medium text-gray-800">{recipe.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{recipe.cuisine || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{recipe.diet || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{recipe.time || '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            recipe.aiGenerated
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {recipe.aiGenerated ? '🤖 AI' : '👨‍🍳 Original'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleDelete(recipe._id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm transition-colors"
                        >
                          🗑️ Delete
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

      {/* Summary */}
      <div className="bg-gray-50 rounded-xl p-6 border-l-4 border-blue-600">
        <h3 className="font-semibold text-gray-800 mb-2">📊 Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Original Recipes</p>
            <p className="text-2xl font-bold text-blue-600">
              {recipes.filter((r) => !r.aiGenerated).length}
            </p>
          </div>
          <div>
            <p className="text-gray-500">AI Generated</p>
            <p className="text-2xl font-bold text-purple-600">
              {recipes.filter((r) => r.aiGenerated).length}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total</p>
            <p className="text-2xl font-bold text-gray-800">{recipes.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesManager;