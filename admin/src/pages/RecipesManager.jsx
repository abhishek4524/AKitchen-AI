import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { recipesAPI } from '../utils/api';

// Helper components (could be imported from a shared file)
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
    <div className="h-12 bg-gray-200 rounded"></div>
    <div className="h-64 bg-gray-200 rounded"></div>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 text-6xl mb-4">📭</div>
    <p className="text-gray-500">{message}</p>
  </div>
);

const useSortableTable = (items, defaultSortKey = 'title', defaultDirection = 'asc') => {
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
    return <EmptyState message="No recipes found" />;
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
                    onClick={() => row.onEdit?.(row)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    ✏️ Edit
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
const RecipesManager = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCuisine, setFilterCuisine] = useState('all');
  const [filterDiet, setFilterDiet] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
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
    ingredients: [{ name: '', quantity: '' }],
    steps: [''],
  });
  const abortControllerRef = useRef(null);

  // Fetch recipes with abort support
  const fetchRecipes = useCallback(async () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setLoading(true);
    setError('');
    try {
      const data = await recipesAPI.getAll({ signal });
      setRecipes(data);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err.message);
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
    return () => abortControllerRef.current?.abort();
  }, [fetchRecipes]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this recipe? This action cannot be undone.')) return;
    try {
      await recipesAPI.delete(id);
      setRecipes(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (recipe) => {
    // Prepare form data with ingredients and steps as arrays
    const ingredients = recipe.ingredients?.length ? recipe.ingredients : [{ name: '', quantity: '' }];
    const steps = recipe.steps?.length ? recipe.steps : [''];
    setFormData({
      title: recipe.title || '',
      description: recipe.description || '',
      cuisine: recipe.cuisine || '',
      diet: recipe.diet || '',
      time: recipe.time || '',
      difficulty: recipe.difficulty || '',
      image: recipe.image || '',
      ingredients: ingredients.map(i => ({ name: i.name || '', quantity: i.quantity || '' })),
      steps: steps.map(s => s || ''),
    });
    setEditingRecipe(recipe);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Filter out empty ingredients/steps
    const ingredients = formData.ingredients.filter(i => i.name.trim() !== '');
    const steps = formData.steps.filter(s => s.trim() !== '');
    const payload = { ...formData, ingredients, steps };
    try {
      if (editingRecipe) {
        const updated = await recipesAPI.update(editingRecipe._id, payload);
        setRecipes(prev => prev.map(r => r._id === updated._id ? updated : r));
      } else {
        const created = await recipesAPI.create(payload);
        setRecipes(prev => [created, ...prev]);
      }
      setShowForm(false);
      setEditingRecipe(null);
      setFormData({
        title: '', description: '', cuisine: '', diet: '', time: '', difficulty: '', image: '',
        ingredients: [{ name: '', quantity: '' }], steps: ['']
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...formData.ingredients];
    updated[index][field] = value;
    setFormData({ ...formData, ingredients: updated });
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: '' }]
    });
  };

  const removeIngredient = (index) => {
    const updated = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: updated });
  };

  const handleStepChange = (index, value) => {
    const updated = [...formData.steps];
    updated[index] = value;
    setFormData({ ...formData, steps: updated });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index) => {
    const updated = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: updated });
  };

  // Filter recipes
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch =
      recipe.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filterCuisine !== 'all' && recipe.cuisine !== filterCuisine) return false;
    if (filterDiet !== 'all' && recipe.diet !== filterDiet) return false;
    if (filterDifficulty !== 'all' && recipe.difficulty !== filterDifficulty) return false;
    if (filterType === 'ai' && !recipe.aiGenerated) return false;
    if (filterType === 'original' && recipe.aiGenerated) return false;
    return true;
  });

  // Sorting for table
  const { sortedItems, sortKey, sortDirection, toggleSort } = useSortableTable(filteredRecipes, 'createdAt', 'desc');

  // Columns definition
  const columns = useMemo(() => [
    { key: 'title', label: 'Title', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => (
        <div className="flex items-center gap-3">
          <img src={row.image || 'https://via.placeholder.com/40'} alt={row.title} className="w-10 h-10 rounded object-cover" />
          <span className="font-medium text-gray-800">{row.title}</span>
        </div>
      )
    },
    { key: 'cuisine', label: 'Cuisine', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => row.cuisine || '-'
    },
    { key: 'diet', label: 'Diet', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => row.diet || '-'
    },
    { key: 'time', label: 'Time', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => row.time || '-'
    },
    { key: 'difficulty', label: 'Difficulty', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => row.difficulty || '-'
    },
    { key: 'aiGenerated', label: 'Type', sortable: true, onSort: toggleSort, sortKey, sortDirection,
      render: row => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${row.aiGenerated ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {row.aiGenerated ? '🤖 AI' : '👨‍🍳 Original'}
        </span>
      )
    },
  ], [toggleSort, sortKey, sortDirection]);

  // Attach edit/delete to each row
  const tableData = sortedItems.map(item => ({
    ...item,
    onEdit: handleEdit,
    onDelete: handleDelete,
  }));

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Recipes Manager</h1>
          <p className="text-gray-500 mt-1">Manage all recipes – add, edit, or delete.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchRecipes}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => {
              setEditingRecipe(null);
              setFormData({
                title: '', description: '', cuisine: '', diet: '', time: '', difficulty: '', image: '',
                ingredients: [{ name: '', quantity: '' }], steps: ['']
              });
              setShowForm(!showForm);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-all"
          >
            {showForm ? '✕ Close Form' : '+ Add Recipe'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg border-l-4 border-red-500">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search by title, cuisine, description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        />
        <select value={filterCuisine} onChange={(e) => setFilterCuisine(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Indian">Indian</option>
          <option value="Chinese">Chinese</option>
          <option value="American">American</option>
          <option value="Other">Other</option>
        </select>
        <select value={filterDiet} onChange={(e) => setFilterDiet(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Diets</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Vegan">Vegan</option>
          <option value="Gluten-Free">Gluten-Free</option>
          <option value="Keto">Keto</option>
          <option value="Paleo">Paleo</option>
        </select>
        <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg">
          <option value="all">All Types</option>
          <option value="ai">AI Generated</option>
          <option value="original">Original</option>
        </select>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="border rounded-lg p-2" />
              <input type="text" placeholder="Cuisine" value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="border rounded-lg p-2" />
              <input type="text" placeholder="Diet" value={formData.diet} onChange={e => setFormData({...formData, diet: e.target.value})} className="border rounded-lg p-2" />
              <input type="text" placeholder="Time (e.g., 30 mins)" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="border rounded-lg p-2" />
              <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value})} className="border rounded-lg p-2">
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <input type="text" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="border rounded-lg p-2" />
            </div>
            <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows="3" className="border rounded-lg p-2 w-full" />
            <div>
              <h3 className="font-semibold mb-2">Ingredients</h3>
              {formData.ingredients.map((ing, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input type="text" placeholder="Name" value={ing.name} onChange={e => handleIngredientChange(idx, 'name', e.target.value)} className="border rounded-lg p-2 flex-1" />
                  <input type="text" placeholder="Quantity" value={ing.quantity} onChange={e => handleIngredientChange(idx, 'quantity', e.target.value)} className="border rounded-lg p-2 w-32" />
                  <button type="button" onClick={() => removeIngredient(idx)} className="text-red-600">✖</button>
                </div>
              ))}
              <button type="button" onClick={addIngredient} className="text-blue-600 text-sm">+ Add Ingredient</button>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Steps</h3>
              {formData.steps.map((step, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <textarea value={step} onChange={e => handleStepChange(idx, e.target.value)} placeholder={`Step ${idx+1}`} rows="2" className="border rounded-lg p-2 flex-1" />
                  <button type="button" onClick={() => removeStep(idx)} className="text-red-600">✖</button>
                </div>
              ))}
              <button type="button" onClick={addStep} className="text-blue-600 text-sm">+ Add Step</button>
            </div>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 bg-gray-200 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingRecipe ? 'Update' : 'Create'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Recipes Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <PaginatedTable columns={columns} data={tableData} rowsPerPage={10} />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-600">
          <h3 className="font-semibold text-gray-800">Total Recipes</h3>
          <p className="text-3xl font-bold text-blue-600">{recipes.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-600">
          <h3 className="font-semibold text-gray-800">AI Generated</h3>
          <p className="text-3xl font-bold text-purple-600">{recipes.filter(r => r.aiGenerated).length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-600">
          <h3 className="font-semibold text-gray-800">Original</h3>
          <p className="text-3xl font-bold text-green-600">{recipes.filter(r => !r.aiGenerated).length}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipesManager;