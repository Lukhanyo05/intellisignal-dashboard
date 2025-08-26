import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

const API_BASE_URL = 'http://localhost:5000';

/**
 * StockChart Component - Interactive price trend visualization with predictions
 * 
 * Displays historical stock data with a simple prediction model and engaging visuals
 * Features real-time data fetching, error handling, and user-friendly tooltips
 * 
 * @param {Object} props - Component properties
 * @param {string} props.symbol - Stock symbol to display (e.g., "AAPL")
 * 
 * @returns {JSX.Element} Rendered stock chart with historical data and predictions
 */
const StockChart = ({ symbol }) => {
  // State management for chart data and loading states
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * generateMockData - Creates realistic mock data when API is unavailable
   * Simulates 5 days of price movement with realistic fluctuations
   * 
   * @returns {Array} Mock historical data with realistic price movements
   */
  const generateMockData = () => {
    const basePrice = 180 + (Math.random() * 50); // Random base price between 180-230
    return [
      { name: 'Mon', price: basePrice, date: '2024-01-15', volume: 45201800 },
      { name: 'Tue', price: basePrice * (1 + (Math.random() * 0.02 - 0.01)), date: '2024-01-16', volume: 38921500 },
      { name: 'Wed', price: basePrice * (1 + (Math.random() * 0.02 - 0.01)), date: '2024-01-17', volume: 42178300 },
      { name: 'Thu', price: basePrice * (1 + (Math.random() * 0.03 - 0.015)), date: '2024-01-18', volume: 51240900 },
      { name: 'Fri', price: basePrice * (1 + (Math.random() * 0.02 - 0.01)), date: '2024-01-19', volume: 39871200 },
    ];
  };

  /**
   * predictNextDay - Simple prediction algorithm based on recent trends
   * Uses last two data points to predict next day's price movement
   * 
   * @param {Array} data - Historical data array
   * @returns {Object} Predicted data point with metadata
   */
  const predictNextDay = (data) => {
    if (data.length < 2) return data[0]; // Safety check
    
    const lastPoint = data[data.length - 1];
    const previousPoint = data[data.length - 2];
    
    // Simple trend analysis: continue the recent momentum
    const recentTrend = lastPoint.price - previousPoint.price;
    const predictedChange = recentTrend * (0.8 + Math.random() * 0.4); // Add some randomness
    
    return { 
      ...lastPoint, 
      name: 'Predict', 
      price: lastPoint.price + predictedChange, 
      predicted: true,
      confidence: Math.abs(recentTrend) > 1 ? 'High' : 'Medium'
    };
  };

  /**
   * fetchHistoricalData - Attempts to fetch real historical data from backend
 * Falls back to mock data if API is unavailable or errors occur
   */
  const fetchHistoricalData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Attempt to fetch real data from backend API
      const response = await axios.get(
        `${API_BASE_URL}/api/historical/${symbol}`
      );
      
      if (response.data && response.data.length > 0) {
        setChartData(response.data);
        console.log(`✅ Real historical data loaded for ${symbol}`);
      } else {
        throw new Error('No historical data received');
      }
      
    } catch (err) {
      console.warn(`📊 Using mock data for ${symbol}:`, err.message);
      setError('Using demonstration data - real data temporarily unavailable');
      
      // Generate and enhance mock data
      const mockData = generateMockData();
      const enhancedData = [...mockData, predictNextDay(mockData)];
      setChartData(enhancedData);
    } finally {
      setLoading(false);
    }
  };

  // useEffect hook to fetch data when component mounts or symbol changes
  useEffect(() => {
    if (symbol) {
      fetchHistoricalData();
    }
  }, [symbol]);

  /**
   * CustomTooltip - Enhanced tooltip component for better user experience
   * Displays formatted price information and additional context
   */
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPredicted = data.predicted;
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`Day: ${label}`}</p>
          <p className={isPredicted ? 'text-green-600' : 'text-blue-600'}>
            Price: <span className="font-bold">${data.price.toFixed(2)}</span>
          </p>
          {isPredicted && (
            <p className="text-xs text-green-500 mt-1">
              🎯 Predicted ({(data.confidence || 'Medium')} confidence)
            </p>
          )}
          {data.date && (
            <p className="text-xs text-gray-500 mt-1">Date: {data.date}</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing market patterns...</p>
            <p className="text-sm text-gray-500">Consulting the crystal ball for {symbol}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    /**
     * Chart Container - Main wrapper with styling and layout
     */
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      {/* Chart Header with Symbol and Status */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-800">
          {symbol} Price Journey
        </h3>
        <span className="text-xs bg-purple-100 text-purple-800 rounded-full px-3 py-1 font-medium">
          📊 Live Chart
        </span>
      </div>

      {/* Error Message Display */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <span className="text-yellow-600 mr-2">⚠️</span>
            <p className="text-sm text-yellow-700">{error}</p>
          </div>
        </div>
      )}

      {/* Chart Visualization Area */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
          >
            {/* Grid lines for better readability */}
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#f0f0f0" 
              strokeOpacity={0.5}
            />
            
            {/* X-axis for time/days */}
            <XAxis 
              dataKey="name" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            
            {/* Y-axis for price values */}
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            
            {/* Custom tooltip for enhanced information display */}
            <Tooltip content={<CustomTooltip />} />
            
            {/* Legend for chart series identification */}
            <Legend 
              verticalAlign="top" 
              height={36}
              iconType="circle"
              iconSize={10}
            />
            
            {/* Historical Data Line - Solid blue line */}
            <Line
              type="monotone"
              dataKey="price"
              name="Historical Prices"
              stroke="#3B82F6"
              strokeWidth={3}
              dot={{ 
                r: 5, 
                fill: '#3B82F6',
                strokeWidth: 2,
                stroke: '#ffffff'
              }}
              activeDot={{ 
                r: 8, 
                fill: '#2563EB',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              data={chartData.filter(point => !point.predicted)}
            />
            
            {/* Prediction Line - Dashed green line */}
            <Line
              type="monotone"
              dataKey="price"
              name="Predicted Trend"
              stroke="#10B981"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ 
                r: 6, 
                fill: '#10B981',
                stroke: '#ffffff',
                strokeWidth: 2
              }}
              data={chartData.filter(point => point.predicted)}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Footer with Information and Disclaimer */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>
            <span className="inline-block w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
            <span>Historical Data</span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            <span>Predicted Trend</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          🧠 Prediction algorithm based on recent momentum and market patterns | 
          💡 Hover over points for detailed information
        </p>
        
        <p className="text-[10px] text-gray-400 mt-1 text-center">
          Disclaimer: Predictions are simulated and for demonstration purposes only. 
          Past performance ≠ future results. Please consult a financial advisor.
        </p>
      </div>

      {/* Refresh Button for User Control */}
      <div className="mt-4 text-center">
        <button
          onClick={fetchHistoricalData}
          className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full transition-colors"
        >
          🔄 Refresh Chart
        </button>
      </div>
    </div>
  );
};

export default StockChart;