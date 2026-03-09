import React, { useState, useEffect, useRef } from "react";
import ReviewForm from "./ReviewForm";
import { motion, AnimatePresence } from "framer-motion";

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const addReview = (review) => {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    };
    setReviews([newReview, ...reviews]);
  };

  return (
    <div 
      ref={sectionRef}
      className="relative w-full min-h-screen bg-gradient-to-b from-[#CBB9DF] to-[#b39bcb] py-20 px-4 overflow-hidden"
    >
      {/* Background Images with Animation */}
      <motion.div 
        initial={{ opacity: 0, x: -100 }}
        animate={isVisible ? { opacity: 0.15, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute left-0 top-0 w-64 h-full pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to right, black, transparent)",
        }}
      />
      
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={isVisible ? { opacity: 0.15, x: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
        className="absolute right-0 top-0 w-64 h-full pointer-events-none"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          maskImage: "linear-gradient(to left, black, transparent)",
        }}
      />

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            User Reviews
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            See what our customers are saying about their experience
          </p>
          <div className="w-24 h-1 bg-white/60 mx-auto mt-6 rounded-full" />
        </motion.div>

        {/* Reviews Grid */}
        <div className="max-w-4xl mx-auto mb-12">
          <AnimatePresence mode="popLayout">
            {reviews.length > 0 ? (
              <motion.div className="space-y-6">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -50, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group"
                  >
                    <div className="bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 transition-all duration-300 hover:shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <div className="flex text-yellow-400 text-xl">
                            {[...Array(5)].map((_, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                              >
                                {i < review.rating ? "★" : "☆"}
                              </motion.span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">
                            {review.rating}.0
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                          {review.date}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {review.comment}
                      </p>

                      {/* Optional user info placeholder */}
                      <div className="flex items-center text-sm text-gray-500 mt-4 pt-3 border-t border-gray-100">
                        <div className="w-6 h-6 bg-gradient-to-br from-[#CBB9DF] to-[#a58bc0] rounded-full mr-2" />
                        <span>Verified Customer</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center py-12"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                  <p className="text-gray-600 text-lg mb-2">
                    No reviews yet
                  </p>
                  <p className="text-gray-500">
                    Be the first to share your experience!
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Review Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute inset-0 bg-white/20 rounded-3xl blur-xl" />
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/50">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Share Your Experience
            </h3>
            <ReviewForm onSubmit={addReview} />
          </div>
        </motion.div>

        {/* Stats Counter (Optional) */}
        {reviews.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
          >
            <span className="text-sm font-medium text-gray-700">
              {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;