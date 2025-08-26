import { useState, useEffect } from 'react';
import axios from 'axios';

const GitHubCard = ({ username = "Lukhanyo05" }) => {
  const [userData, setUserData] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(username);

  const fetchGitHubData = async (githubUsername) => {
    try {
      setLoading(true);
      setError(null);
      
      // Connect directly to GitHub API (no backend needed)
      const [userResponse, reposResponse] = await Promise.all([
        axios.get(`https://api.github.com/users/${githubUsername}`),
        axios.get(`https://api.github.com/users/${githubUsername}/repos?sort=updated&per_page=5`)
      ]);
      
      setUserData(userResponse.data);
      setRepos(reposResponse.data);
      
    } catch (err) {
      console.error('Error fetching GitHub data:', err.message);
      setError('Failed to fetch GitHub data. Please check the username and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchGitHubData(searchInput.trim());
    }
  };

  useEffect(() => {
    fetchGitHubData(username);
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500 mb-4"></div>
          <p className="text-gray-600">Loading GitHub data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Search Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <span className="bg-gray-800 text-white p-1 rounded mr-2">🐙</span>
          GitHub Profile Search
        </h3>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {userData && (
        <>
          {/* User Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center mb-3">
              <img 
                src={userData.avatar_url} 
                alt={userData.name}
                className="w-16 h-16 rounded-full mr-4 border-2 border-gray-300"
              />
              <div>
                <h4 className="text-lg font-semibold">{userData.name}</h4>
                <p className="text-sm text-gray-600">@{userData.login}</p>
                {userData.bio && <p className="text-sm text-gray-700 mt-1">{userData.bio}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-sm">
              <span className="bg-white text-gray-800 px-2 py-1 rounded border border-gray-200">
                📊 Repos: {userData.public_repos}
              </span>
              <span className="bg-white text-gray-800 px-2 py-1 rounded border border-gray-200">
                👥 Followers: {userData.followers}
              </span>
              <span className="bg-white text-gray-800 px-2 py-1 rounded border border-gray-200">
                🔄 Following: {userData.following}
              </span>
            </div>
          </div>

          {/* Repositories */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">
              Recent Repositories {repos.length > 0 && `(${repos.length})`}
            </h4>
            
            {repos.length > 0 ? (
              <div className="space-y-3">
                {repos.slice(0, 5).map(repo => (
                  <div key={repo.id} className="p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-800 hover:text-gray-900 font-semibold block mb-1"
                    >
                      {repo.name}
                    </a>
                    {repo.description && (
                      <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                    )}
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>⭐ {repo.stargazers_count || 0}</span>
                      <span>🍴 {repo.forks_count || 0}</span>
                      <span>{repo.language || 'Code'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No repositories found</p>
              </div>
            )}
          </div>

          {/* Profile Link */}
          <div className="mt-4 pt-3 border-t">
            <a 
              href={userData.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-gray-900 text-sm flex items-center justify-center"
            >
              🐙 View full GitHub profile →
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default GitHubCard;