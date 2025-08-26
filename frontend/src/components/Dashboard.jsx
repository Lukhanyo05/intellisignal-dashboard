import { useState, useEffect } from 'react';
import axios from 'axios';
import KpiCard from './Kpicard';
import GitHubCard from './GithubCard';
import GitLabCard from './GitLabCard';

// Dynamic API base URL for development vs production
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : 'https://your-heroku-app.herokuapp.com';

/**
 * Main Dashboard Component - DevSignal Analytics Dashboard
 * Displays financial data, GitHub stats, and GitLab insights in one unified view
 */
const Dashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [marketMood, setMarketMood] = useState('😴');
  const [activeTab, setActiveTab] = useState('financial'); // 'financial', 'github', 'gitlab'

  // Calculate market mood function (keep your existing function)
  const calculateMarketMood = (stocksData) => {
    const avgPerformance = stocksData.reduce((sum, stock) => sum + stock.changesPercentage, 0) / stocksData.length;
    if (avgPerformance > 2) return '🚀';
    if (avgPerformance > 1) return '😎';
    if (avgPerformance > 0) return '🙂';
    if (avgPerformance > -1) return '😐';
    if (avgPerformance > -2) return '😟';
    return '🔥';
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_BASE_URL}/api/dashboard-data`, {
          timeout: 8000
        });
        
        if (response.data && response.data.length > 0) {
          setStocks(response.data);
          setMarketMood(calculateMarketMood(response.data));
        } else {
          throw new Error('No data received from API');
        }
        
      } catch (err) {
        console.error('❌ API Error:', err);
        
        let errorMessage = 'Financial data temporarily unavailable ☕';
        if (err.code === 'ECONNABORTED') {
          errorMessage = 'Data request timeout 🚦';
        } else if (err.code === 'NETWORK_ERROR') {
          errorMessage = 'Network connection lost 🕊️';
        } else if (err.response?.status === 429) {
          errorMessage = 'API rate limit exceeded 🌬️';
        }
        
        setError(errorMessage);
        
        // Fallback data
        const mockData = [
          { symbol: 'AAPL', name: 'Apple Inc.', price: 227.76, change: 2.86, changesPercentage: 1.27 },
          { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.86, change: 5.32, changesPercentage: 1.30 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 175.24, change: -1.15, changesPercentage: -0.65 },
          { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.22, change: 3.45, changesPercentage: 1.97 },
          { symbol: 'META', name: 'Meta Platforms', price: 492.64, change: 8.72, changesPercentage: 1.80 }
        ];
        
        setStocks(mockData);
        setMarketMood(calculateMarketMood(mockData));
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const intervalId = setInterval(fetchDashboardData, 60000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-bounce mb-4">
            <span className="text-4xl">📊</span>
          </div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading DevSignal Dashboard...</h2>
          <p className="text-gray-600">Preparing your financial and developer insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full mb-4">
          <span className="text-2xl">{marketMood}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-blue-600 bg-clip-text text-transparent">
          DevSignal Analytics
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Financial markets + Developer insights in one dashboard
        </p>

        {/* Tab Navigation */}
        <div className="flex justify-center mt-6 mb-4">
          <div className="bg-white rounded-lg shadow-inner p-1 flex">
            {['financial', 'github', 'gitlab'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-500 text-white shadow'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab === 'financial' && '📈 Financial'}
                {tab === 'github' && '🐙 GitHub'}
                {tab === 'gitlab' && '🐊 GitLab'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mt-4 max-w-md mx-auto">
            <strong>Note: </strong>{error}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main>
        {activeTab === 'financial' && (
          <>
            {/* Financial Dashboard */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8">
              {stocks.map((stock) => (
                <KpiCard
                  key={stock.symbol}
                  title={stock.name}
                  symbol={stock.symbol}
                  value={stock.price}
                  change={stock.change}
                  changePercent={stock.changesPercentage}
                />
              ))}
            </section>

            <div className="bg-white rounded-2xl shadow-xl p-6 text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Financial Overview</h3>
              <p className="text-gray-600">Real-time market data and analysis</p>
            </div>
          </>
        )}

        {activeTab === 'github' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="lg:col-span-2">
              <GitHubCard username="Lukhanyo05" />
            </div>
          </section>
        )}

        {activeTab === 'gitlab' && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="lg:col-span-2">
              <GitLabCard username="LukhanyoN" />
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-gray-500">
          DevSignal Analytics • Financial + Developer Intelligence
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Connected to real-time APIs • Auto-refreshing every 60 seconds
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;