const _ = require('lodash');

class AISuggestionGenerator {
  /**
   * Generate AI-powered suggestions based on detected modules
   * @param {Object} jsonSchema - The complete JSON schema
   * @param {Array} detectedModules - List of detected modules
   * @returns {Array} List of AI suggestions
   */
  static generateSuggestions(jsonSchema, detectedModules) {
    const suggestions = [];

    // Inventory Insights
    if (this.hasModule(detectedModules, 'Inventory')) {
      suggestions.push(...this.generateInventoryInsights(jsonSchema.inventory));
    }

    // Orders Insights
    if (this.hasModule(detectedModules, 'Orders')) {
      suggestions.push(...this.generateOrderInsights(jsonSchema.orders));
    }

    // Reviews Insights
    if (this.hasModule(detectedModules, 'Reviews')) {
      suggestions.push(...this.generateReviewInsights(jsonSchema.reviews));
    }

    // Staff Insights
    if (this.hasModule(detectedModules, 'Staff')) {
      suggestions.push(...this.generateStaffInsights(jsonSchema.staff));
    }

    return suggestions;
  }

  /**
   * Check if a specific module exists in detected modules
   * @param {Array} detectedModules - List of detected modules
   * @param {string} moduleName - Name of module to check
   * @returns {boolean} Whether module exists
   */
  static hasModule(detectedModules, moduleName) {
    return detectedModules.some(module => 
      module.module.toLowerCase() === moduleName.toLowerCase()
    );
  }

  /**
   * Generate inventory-related insights
   * @param {Array} inventory - Inventory data
   * @returns {Array} Inventory-related suggestions
   */
  static generateInventoryInsights(inventory) {
    if (!inventory || !Array.isArray(inventory)) return [];

    const suggestions = [];

    // Low stock detection
    const lowStockItems = inventory.filter(item => 
      item.stock !== undefined && item.stock < 10
    );

    if (lowStockItems.length > 0) {
      suggestions.push({
        type: 'warning',
        category: 'Inventory',
        message: `Low stock alert: ${lowStockItems.length} item(s) have stock below 10 units.`,
        details: lowStockItems.map(item => item.name || item.item_id)
      });
    }

    // Overstocked items detection
    const overStockedItems = inventory.filter(item => 
      item.stock !== undefined && item.stock > 50
    );

    if (overStockedItems.length > 0) {
      suggestions.push({
        type: 'info',
        category: 'Inventory',
        message: `Overstocking detected: ${overStockedItems.length} item(s) have stock above 50 units.`,
        details: overStockedItems.map(item => item.name || item.item_id)
      });
    }

    return suggestions;
  }

  /**
   * Generate orders-related insights
   * @param {Array} orders - Orders data
   * @returns {Array} Orders-related suggestions
   */
  static generateOrderInsights(orders) {
    if (!orders || !Array.isArray(orders)) return [];

    const suggestions = [];

    // Recent orders analysis
    const recentOrders = orders.slice(-30); // Last 30 orders
    
    // Cancellation rate
    const canceledOrders = recentOrders.filter(order => 
      order.status === 'canceled'
    );

    if (canceledOrders.length / recentOrders.length > 0.2) {
      suggestions.push({
        type: 'alert',
        category: 'Orders',
        message: `High cancellation rate: ${canceledOrders.length} out of ${recentOrders.length} recent orders were canceled.`
      });
    }

    // Average order value
    const averageOrderValue = _.meanBy(orders, 'total') || 0;
    
    if (averageOrderValue < 20) {
      suggestions.push({
        type: 'info',
        category: 'Orders',
        message: `Low average order value: $${averageOrderValue.toFixed(2)}`
      });
    }

    return suggestions;
  }

  /**
   * Generate reviews-related insights
   * @param {Array} reviews - Reviews data
   * @returns {Array} Reviews-related suggestions
   */
  static generateReviewInsights(reviews) {
    if (!reviews || !Array.isArray(reviews)) return [];

    const suggestions = [];

    // Recent reviews analysis
    const recentReviews = reviews.slice(-7); // Last 7 reviews
    
    // Average rating
    const averageRating = _.meanBy(recentReviews, 'rating') || 0;
    
    if (averageRating < 3.5) {
      suggestions.push({
        type: 'alert',
        category: 'Reviews',
        message: `Customer satisfaction drop: Average rating in last 7 reviews is ${averageRating.toFixed(2)}.`
      });
    }

    // Negative review detection
    const negativeReviews = recentReviews.filter(review => 
      review.rating !== undefined && review.rating < 3
    );

    if (negativeReviews.length > 2) {
      suggestions.push({
        type: 'warning',
        category: 'Reviews',
        message: `Multiple negative reviews detected: ${negativeReviews.length} reviews with rating below 3.`
      });
    }

    return suggestions;
  }

  /**
   * Generate staff-related insights
   * @param {Array} staff - Staff data
   * @returns {Array} Staff-related suggestions
   */
  static generateStaffInsights(staff) {
    if (!staff || !Array.isArray(staff)) return [];

    const suggestions = [];

    // Performance analysis
    const underperformingStaff = staff.filter(employee => 
      employee.performance_rating !== undefined && 
      employee.performance_rating < 3
    );

    if (underperformingStaff.length > 0) {
      suggestions.push({
        type: 'warning',
        category: 'Staff',
        message: `Performance concern: ${underperformingStaff.length} staff member(s) have low performance ratings.`,
        details: underperformingStaff.map(employee => employee.name)
      });
    }

    // Overtime detection
    const overworkedStaff = staff.filter(employee => 
      employee.hours_worked !== undefined && 
      employee.hours_worked > 45
    );

    if (overworkedStaff.length > 0) {
      suggestions.push({
        type: 'info',
        category: 'Staff',
        message: `Potential overtime: ${overworkedStaff.length} staff member(s) worked more than 45 hours.`,
        details: overworkedStaff.map(employee => employee.name)
      });
    }

    return suggestions;
  }
}

module.exports = AISuggestionGenerator;