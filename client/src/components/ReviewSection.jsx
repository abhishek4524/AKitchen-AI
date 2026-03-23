import React, { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm"; // Assume this is already clean

// Helper component for rating stars
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - Math.ceil(rating);

  return (
    <div className="flex items-center gap-0.5 text-yellow-400">
      {[...Array(fullStars)].map((_, i) => (
        <span key={`full-${i}`} className="text-sm">★</span>
      ))}
      {hasHalfStar && <span className="text-sm">½</span>}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-sm text-gray-300">★</span>
      ))}
    </div>
  );
};

// Review Card Component
const ReviewCard = ({ review }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
            {review.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <p className="font-medium text-gray-800">{review.name || 'Anonymous'}</p>
            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <Stars rating={review.rating} />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
    </div>
  );
};

const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
        <p className="text-gray-500">Be the first to try AKitchen AI 🚀</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reviews.map((review) => (
        <ReviewCard key={review._id || review.id} review={review} />
      ))}
    </div>
  );
};

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reviews");
        if (!response.ok) throw new Error("Unable to load reviews");
        const data = await response.json();
        setReviews(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, []);

  const addReview = async (review) => {
    const token = localStorage.getItem("token");
    const payload = {
      name: review.name || "Anonymous",
      rating: review.rating,
      comment: review.comment,
    };

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      const newReview = await response.json();
      setReviews((prev) => [newReview, ...prev]);
      return { success: true };
    } catch (err) {
      console.error("Error adding review:", err);
      return { success: false, message: err.message };
    }
  };

  // Compute average rating
  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">What Users Say</h2>
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-2 text-gray-600 mt-2">
              <Stars rating={averageRating} />
              <span className="text-sm font-medium">{averageRating} / 5</span>
              <span className="text-sm text-gray-500">({reviews.length} reviews)</span>
            </div>
          )}
        </div>

        {/* Reviews List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-pulse text-gray-400">Loading reviews...</div>
          </div>
        ) : (
          <ReviewList reviews={reviews} />
        )}

        {/* Review Form */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              Share Your Experience
            </h3>
            <ReviewForm onSubmit={addReview} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewSection;