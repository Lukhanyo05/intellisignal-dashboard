/**
 * KpiCard Component - Individual stock performance card
 * 
 * Displays a single stock's key metrics in an attractive, informative card
 * Features color-coded performance indicators and smooth hover effects
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - Company name (e.g., "Apple Inc.")
 * @param {number} props.value - Current stock price (e.g., 227.76)
 * @param {number} props.change - Dollar amount change (e.g., 2.86)
 * @param {number} props.changePercent - Percentage change (e.g., 1.27)
 * @param {string} props.symbol - Stock symbol (e.g., "AAPL")
 * 
 * @returns {JSX.Element} Rendered stock performance card
 */
const KpiCard = ({ title, value, change, changePercent, symbol }) => {
    /**
     * determinePerformanceStyle - Sets visual styling based on stock performance
     * Green for positive growth, red for negative performance
     * Creates immediate visual feedback for users
     */
    const changeColor = change >= 0 ? 'text-green-600' : 'text-red-600';  // Text color based on performance
    const changeIcon = change >= 0 ? '▲' : '▼';                           // Arrow direction indicator
    const bgColor = change >= 0 ? 'bg-green-50' : 'bg-red-50';            // Background color for change indicator
  
    // Generate a fun status message based on performance
    const getPerformanceMessage = () => {
      if (changePercent > 3) return '🚀 To the moon!';
      if (changePercent > 1) return '📈 Looking good!';
      if (changePercent > 0) return '👍 Steady climb';
      if (changePercent > -1) return '🤔 Hanging in there';
      if (changePercent > -3) return '📉 Rough day';
      return '🔥 Grab the extinguisher!';
    };
  
    // Format large numbers with commas for better readability
    const formatPrice = (price) => {
      return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
  
    return (
      /**
       * Main Card Container
       * - White background for clean presentation
       * - Rounded corners and shadow for depth
       * - Hover effect for interactivity
       * - Flex column layout for organized content
       */
      <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
        
        {/* Header Section - Company name and symbol */}
        <div className="flex justify-between items-start mb-4">
          {/* Company Title - Truncated to prevent overflow */}
          <h3 className="text-lg font-semibold text-gray-800 truncate" title={title}>
            {title}
          </h3>
          
          {/* Stock Symbol Badge - Visual identifier */}
          <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-3 py-1 font-medium flex-shrink-0 ml-2">
            {symbol}
          </span>
        </div>
        
        {/* Current Price Display - Largest and most prominent element */}
        <div className="mb-4">
          <p className="text-3xl font-bold text-gray-900">
            ${formatPrice(value)}
          </p>
          <p className="text-xs text-gray-500 mt-1">Current price</p>
        </div>
        
        {/* Performance Indicator - Color-coded change information */}
        <div className={`text-sm font-semibold ${changeColor} ${bgColor} rounded-lg px-3 py-2 mb-3`}>
          <div className="flex items-center justify-between">
            <span>
              {changeIcon} ${Math.abs(change).toFixed(2)} ({Math.abs(changePercent).toFixed(2)}%)
            </span>
            <span className="text-lg">
              {change >= 0 ? '😊' : '😅'}
            </span>
          </div>
        </div>
        
        {/* Fun Performance Message - Adds personality to data */}
        <div className="text-xs text-center text-gray-600 bg-gray-50 rounded-md py-1 px-2 border border-gray-200">
          {getPerformanceMessage()}
        </div>
        
        {/* Mini Status Indicator - Visual performance summary */}
        <div className="mt-3 flex justify-center">
          <div className={`w-3 h-3 rounded-full ${change >= 0 ? 'bg-green-400' : 'bg-red-400'} shadow-sm`}></div>
          <div className="text-[10px] text-gray-500 ml-2">
            {change >= 0 ? 'Positive trend' : 'Needs attention'}
          </div>
        </div>
  
      </div>
    );
  };
  
  export default KpiCard;