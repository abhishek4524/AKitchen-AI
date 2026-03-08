import React, { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      rating,
      comment,
    });

    setComment("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xl">

      <label className="block mb-2 font-medium">Rating</label>
      <select
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        className="border p-2 rounded-lg w-full"
      >
        <option value="5">⭐⭐⭐⭐⭐</option>
        <option value="4">⭐⭐⭐⭐</option>
        <option value="3">⭐⭐⭐</option>
        <option value="2">⭐⭐</option>
        <option value="1">⭐</option>
      </select>

      <textarea
        placeholder="Write your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="border p-3 rounded-lg w-full mt-4"
        rows="4"
      />

      <button
        type="submit"
        className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:opacity-90"
      >
        Submit Review
      </button>
    </form>
  );
};

export default ReviewForm;