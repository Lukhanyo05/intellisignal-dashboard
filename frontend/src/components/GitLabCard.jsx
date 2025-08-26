import { useState, useEffect } from 'react';
import axios from 'axios';

const GitLabCard = ({ username = "lukhanyoN" }) => {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [projectCommits, setProjectCommits] = useState({}); // Store commits for each project
  const [expandedProject, setExpandedProject] = useState(null); // Track which project is expanded
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(username);

  const fetchGitLabData = async (gitlabUsername) => {
    try {
      setLoading(true);
      setError(null);
      
      // Use your backend API for GitLab data
      const response = await axios.get(
        `https://intellisignal-dashboard-b5c144f215dd.herokuapp.com/api/gitlab/search/${gitlabUsername}`
      );
      
      setUserData(response.data.user);
      setProjects(response.data.projects);
      setProjectCommits({}); // Reset commits when user changes
      setExpandedProject(null); // Reset expanded project
      
    } catch (err) {
      console.log('GitLab API error:', err.message);
      setError('GitLab data temporarily unavailable - using demo data');
      // Fallback demo data
      setUserData({
        username: gitlabUsername,
        name: "Lukhanyo N",
        avatar_url: "https://gitlab.com/uploads/-/system/user/avatar/placeholder.png",
        id: 123456
      });
      setProjects([
        {
          id: 1,
          name: "intellisignal-dashboard",
          description: "Full-stack analytics dashboard",
          star_count: 8,
          forks_count: 2,
          web_url: "https://gitlab.com/lukhanyoN/intellisignal-dashboard",
          last_activity_at: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "devops-pipeline",
          description: "CI/CD automation setup",
          star_count: 5,
          forks_count: 1,
          web_url: "https://gitlab.com/lukhanyoN/devops-pipeline",
          last_activity_at: "2024-01-10T14:20:00Z"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectCommits = async (projectId) => {
    try {
      // Use your backend API for GitLab commits
      const response = await axios.get(
        `https://intellisignal-dashboard-b5c144f215dd.herokuapp.com/api/gitlab/projects/${projectId}/commits`
      );
      
      setProjectCommits(prev => ({
        ...prev,
        [projectId]: response.data
      }));
      
    } catch (err) {
      console.error('Error fetching GitLab commits:', err.message);
      setProjectCommits(prev => ({
        ...prev,
        [projectId]: [] // Set empty array on error
      }));
    }
  };

  const toggleProjectExpansion = (project) => {
    if (expandedProject === project.id) {
      setExpandedProject(null); // Collapse if already expanded
    } else {
      setExpandedProject(project.id); // Expand this project
      // Fetch commits if not already loaded
      if (!projectCommits[project.id]) {
        fetchProjectCommits(project.id);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchGitLabData(searchInput.trim());
    }
  };

  useEffect(() => {
    fetchGitLabData(username);
  }, [username]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Loading GitLab data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Search Header */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3 flex items-center">
          <span className="bg-orange-500 text-white p-1 rounded mr-2">🦊</span>
          GitLab Profile Search
        </h3>
        
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Enter GitLab username"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {userData && (
        <>
          {/* User Info */}
          <div className="mb-6 p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center mb-3">
              <img 
                src={userData.avatar_url} 
                alt={userData.name}
                className="w-16 h-16 rounded-full mr-4 border-2 border-orange-300"
              />
              <div>
                <h4 className="text-lg font-semibold">{userData.name || userData.username}</h4>
                <p className="text-sm text-gray-600">@{userData.username}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="bg-white text-gray-800 px-2 py-1 rounded border border-orange-200">
                📊 Projects: {projects.length}
              </span>
              <span className="bg-white text-gray-800 px-2 py-1 rounded border border-orange-200">
                🆔 ID: {userData.id}
              </span>
            </div>
          </div>

          {/* Projects */}
          <div>
            <h4 className="font-semibold mb-3 text-gray-700 border-b pb-2">
              Recent Projects {projects.length > 0 && `(${projects.length})`}
            </h4>
            
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map(project => (
                  <div key={project.id} className="p-3 border border-orange-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <a 
                        href={project.web_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-900 font-semibold block mb-1 flex-1"
                      >
                        {project.name}
                      </a>
                      <button
                        onClick={() => toggleProjectExpansion(project)}
                        className="ml-2 bg-orange-200 hover:bg-orange-300 text-orange-700 px-2 py-1 rounded text-sm"
                      >
                        {expandedProject === project.id ? 'Hide Commits' : 'Show Commits'}
                      </button>
                    </div>
                    
                    {project.description && (
                      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    )}
                    
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>⭐ {project.star_count || 0}</span>
                      <span>🍴 {project.forks_count || 0}</span>
                      <span>🔄 {project.last_activity_at?.split('T')[0]}</span>
                    </div>

                    {/* Commit Section */}
                    {expandedProject === project.id && (
                      <div className="mt-3 pt-3 border-t border-orange-200">
                        <h5 className="font-medium text-sm mb-2">Latest Commits:</h5>
                        {projectCommits[project.id] ? (
                          projectCommits[project.id].length > 0 ? (
                            projectCommits[project.id].slice(0, 5).map(commit => (
                              <div key={commit.id} className="mb-2 p-2 bg-orange-50 rounded text-sm">
                                <p className="text-gray-800">{commit.title || commit.message}</p>
                                <small className="text-gray-500">
                                  {new Date(commit.created_at || commit.committed_date).toLocaleDateString()}
                                </small>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No commits found</p>
                          )
                        ) : (
                          <p className="text-gray-500 text-sm">Loading commits...</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-orange-50 rounded-lg">
                <p className="text-gray-500">No projects found</p>
              </div>
            )}
          </div>

          {/* Profile Link */}
          <div className="mt-4 pt-3 border-t">
            <a 
              href={`https://gitlab.com/${userData.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-700 hover:text-orange-900 text-sm flex items-center justify-center"
            >
              🦊 View full GitLab profile →
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default GitLabCard;