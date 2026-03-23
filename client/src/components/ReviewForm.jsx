import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call delay while backend save happens in parent
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onSubmit({ name: name.trim(), rating, comment: comment.trim() });
    setName('');
    setRating(0);
    setComment('');
    setIsSubmitting(false);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm"
          >
            ✓ Thank you for your review!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rating Stars */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <svg
                className={`w-8 h-8 transition-colors duration-200 ${
                  star <= (hoveredRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating ? `${rating}.0` : 'Select rating'}
          </span>
        </div>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CBB9DF] focus:border-transparent transition-all duration-200"
          placeholder="Enter your name"
          required
        />
      </div>

      {/* Comment Field */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#CBB9DF] focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Share your experience with us..."
          required
        />
        <p className="text-xs text-gray-400 text-right">
          {comment.length}/500 characters
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3 px-4 bg-gradient-to-r from-[#CBB9DF] to-[#b39bcb] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ${
          isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
        ) : (
          'Submit Review'
        )}
      </motion.button>

      {/* Character limit note */}
      <p className="text-xs text-center text-gray-400 mt-4">
        Your review will be visible to other users after submission.
      </p>
    </form>
  );
};

export default ReviewForm;