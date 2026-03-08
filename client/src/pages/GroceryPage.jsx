import React, { useState } from "react";

const GroceryPage = () => {
  const [item, setItem] = useState("");
  const [list, setList] = useState([]);

  const addItem = () => {
    if (!item.trim()) return;

    setList([
      ...list,
      {
        id: Date.now(),
        name: item,
        done: false,
      },
    ]);

    setItem("");
  };

  const toggleItem = (id) => {
    setList(
      list.map((g) =>
        g.id === id ? { ...g, done: !g.done } : g
      )
    );
  };

  const deleteItem = (id) => {
    setList(list.filter((g) => g.id !== id));
  };

  const clearList = () => {
    setList([]);
  };

  return (
    <div >
  
    <div className="w-full flex flex-col items-center mt-24">

      {/* Heading */}
      <h1 className="text-4xl font-bold">Grocery List</h1>
      <p className="text-gray-500 mt-2">
        Manage ingredients you need for your recipes
      </p>

      {/* Add Input */}
      <div className="flex gap-3 mt-8 w-[90%] max-w-xl">
        <input
          type="text"
          placeholder="Add grocery item..."
          value={item}
          onChange={(e) => setItem(e.target.value)}
          className="flex-1 border p-3 rounded-lg"
          />

        <button
          onClick={addItem}
          className="bg-green-500 text-white px-6 rounded-lg hover:bg-green-600"
          >
          Add
        </button>
      </div>

      {/* Grocery List */}
      <div className="w-[90%] max-w-xl mt-8 space-y-3">

        {list.map((g) => (
          <div
          key={g.id}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >

            <div className="flex items-center gap-3">

              <input
                type="checkbox"
                checked={g.done}
                onChange={() => toggleItem(g.id)}
                />

              <span
                className={`${
                  g.done ? "line-through text-gray-400" : ""
                }`}
                >
                {g.name}
              </span>

            </div>

            <button
              onClick={() => deleteItem(g.id)}
              className="text-red-500"
              >
              Delete
            </button>

          </div>
        ))}

      </div>

      {/* Clear Button */}
      {list.length > 0 && (
        <button
        onClick={clearList}
        className="mt-8 bg-black text-white px-6 py-2 rounded-lg"
        >
          Clear List
        </button>
      )}
    </div>
      </div>
  );
};

export default GroceryPage;