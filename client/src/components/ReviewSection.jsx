import React, { useState } from "react";
import ReviewForm from "./ReviewForm";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);

  const addReview = (review) => {
    setReviews([review, ...reviews]);
  };

  return (
    <div className="w-full bg-[#CBB9DF] py-16 flex flex-col items-center mt-16">

      <h2 className="text-3xl font-bold mb-8">User Reviews</h2>

      <div className="w-[90%] max-w-3xl space-y-6">

        {reviews.map((review, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow"
          >
            <div className="text-yellow-500 text-lg">
              {"⭐".repeat(review.rating)}
            </div>

            <p className="mt-2 text-gray-700">{review.comment}</p>
          </div>
        ))}

      </div>

      <ReviewForm onSubmit={addReview} />
    </div>
  );
};

export default ReviewSection;