/**
 * Calculate health score (0-100) based on nutritional data
 */
const calculateHealthScore = (nutrition) => {
  let score = 70; // Start neutral
  const { 
    saturatedFat, sugar, sodium, dietaryFiber, protein, calories 
  } = nutrition;

  // Penalties
  if (saturatedFat > 5) score -= (saturatedFat - 5) * 2;
  if (sugar > 15) score -= (sugar - 15) * 1.5;
  if (sodium > 400) score -= (sodium - 400) * 0.05;
  if (calories > 600) score -= (calories - 600) * 0.03;

  // Bonuses
  if (dietaryFiber > 5) score += (dietaryFiber - 5) * 2;
  if (protein > 15) score += (protein - 15) * 1;

  return Math.min(100, Math.max(0, Math.round(score)));
};

/**
 * Generate good points and bad points based on nutrition
 */
const generatePoints = (nutrition, foodName) => {
  const goodPoints = [];
  const badPoints = [];
  const healthyIngredients = [];
  const unhealthyIngredients = [];

  // Good points logic
  if (nutrition.dietaryFiber >= 5) {
    goodPoints.push(`High in fiber (${nutrition.dietaryFiber}g) – good for digestion`);
    healthyIngredients.push('Dietary Fiber');
  }
  if (nutrition.protein >= 15) {
    goodPoints.push(`Good protein source (${nutrition.protein}g) – supports muscle health`);
    healthyIngredients.push('Protein');
  }
  if (nutrition.saturatedFat <= 3) {
    goodPoints.push('Low in saturated fat – heart healthy');
  }
  if (nutrition.sodium <= 300) {
    goodPoints.push('Low sodium content – good for blood pressure');
  }
  if (nutrition.sugars <= 8) {
    goodPoints.push('Low in added sugars');
  }

  // Bad points logic
  if (nutrition.saturatedFat > 8) {
    badPoints.push(`High saturated fat (${nutrition.saturatedFat}g) – may increase cholesterol`);
    unhealthyIngredients.push('Saturated Fat');
  }
  if (nutrition.sugars > 20) {
    badPoints.push(`High sugar content (${nutrition.sugars}g) – may spike blood glucose`);
    unhealthyIngredients.push('Added Sugar');
  }
  if (nutrition.sodium > 800) {
    badPoints.push(`Excessive sodium (${nutrition.sodium}mg) – can raise blood pressure`);
    unhealthyIngredients.push('High Sodium');
  }
  if (nutrition.calories > 700) {
    badPoints.push(`Calorie-dense (${nutrition.calories} kcal) – watch portion size`);
  }
  if (nutrition.dietaryFiber < 2 && nutrition.protein < 8) {
    badPoints.push('Low in fiber and protein – less satiating');
  }

  // Add default points if needed
  if (goodPoints.length === 0) {
    goodPoints.push('Provides energy for daily activities');
    healthyIngredients.push('Basic Macronutrients');
  }
  if (badPoints.length === 0) {
    badPoints.push('Moderation recommended as part of balanced diet');
  }

  return { goodPoints, badPoints, healthyIngredients, unhealthyIngredients };
};

/**
 * Determine food category based on nutrition profile and name
 */
const determineCategory = (foodName, nutrition) => {
  const name = foodName.toLowerCase();
  if (name.includes('pizza') || name.includes('burger') || name.includes('fries')) return 'Fast Food';
  if (name.includes('salad') || name.includes('kale') || name.includes('lettuce')) return 'Salad / Vegetables';
  if (name.includes('sushi')) return 'Japanese / Seafood';
  if (name.includes('chip') || name.includes('bhujia') || name.includes('snack')) return 'Packaged Snack';
  if (nutrition.calories < 300 && nutrition.dietaryFiber > 3) return 'Light Meal / Healthy';
  if (nutrition.protein > 20) return 'High Protein';
  return 'General Food';
};

/**
 * Generate summary based on health score and nutrition
 */
const generateSummary = (healthScore, nutrition, foodName) => {
  if (healthScore >= 80) {
    return `${foodName} is an excellent choice! Packed with nutrients and low in unhealthy components. Great for maintaining a balanced diet.`;
  } else if (healthScore >= 60) {
    return `${foodName} is reasonably healthy with some good nutritional qualities. Consider pairing with vegetables or whole grains to boost its benefits.`;
  } else if (healthScore >= 40) {
    return `${foodName} has moderate nutritional value. While it provides energy and some nutrients, it contains elements that should be limited in a healthy diet.`;
  } else {
    return `${foodName} is high in calories, saturated fat, or sodium with limited nutritional density. Enjoy occasionally and in small portions.`;
  }
};

module.exports = {
  calculateHealthScore,
  generatePoints,
  determineCategory,
  generateSummary
};