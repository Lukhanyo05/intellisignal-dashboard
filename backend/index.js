const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helmet = require("helmet"); // Added Helmet for security
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Added Helmet for security
app.use(cors());
app.use(express.json());

// Basic health check route
app.get("/", (req, res) => {
  res.json({
    message: "IntelliSignal Backend is running!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// ===== GITHUB API ROUTES =====

/**
 * @route   GET /api/github/user/:username
 * @desc    Get GitHub user information by username
 * @access  Public
 */
app.get("/api/github/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${encodeURIComponent(username)}`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "IntelliSignal-Dashboard",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("GitHub API error:", error.message);
    res.status(500).json({
      message: "Error fetching GitHub user data",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/github/user/:username/repos
 * @desc    Get GitHub user repositories
 * @access  Public
 */
app.get("/api/github/user/:username/repos", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/users/${encodeURIComponent(
        username
      )}/repos?sort=updated&per_page=10`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "IntelliSignal-Dashboard",
        },
      }
    );

    res.json(response.data || []);
  } catch (error) {
    console.error("GitHub repos error:", error.message);
    res.status(500).json({
      message: "Error fetching GitHub repositories",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/github/repos/:owner/:repo/commits
 * @desc    Get latest 5 commits for a GitHub repository
 * @access  Public
 */
app.get("/api/github/repos/:owner/:repo/commits", async (req, res) => {
  const { owner, repo } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=5`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "IntelliSignal-Dashboard",
        },
      }
    );

    res.json(response.data || []);
  } catch (error) {
    console.error("GitHub commits error:", error.message);
    res.status(500).json({
      message: "Error fetching GitHub commits",
      error: error.message,
    });
  }
});

// ===== GITLAB API ROUTES =====

/**
 * @route   GET /api/gitlab/user/:username
 * @desc    Get GitLab user information by username
 * @access  Public
 */
app.get("/api/gitlab/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const response = await axios.get(
      `https://gitlab.com/api/v4/users?username=${encodeURIComponent(
        username
      )}`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.data && response.data.length > 0) {
      res.json(response.data[0]);
    } else {
      res.status(404).json({
        message: `GitLab user "${username}" not found`,
        error: "User not found",
      });
    }
  } catch (error) {
    console.error("GitLab API error:", error.message);
    res.status(500).json({
      message: "Error fetching GitLab user data",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/gitlab/projects/:userid
 * @desc    Get GitLab user projects by user ID
 * @access  Public
 */
app.get("/api/gitlab/projects/:userid", async (req, res) => {
  const { userid } = req.params;

  try {
    const response = await axios.get(
      `https://gitlab.com/api/v4/users/${userid}/projects?order_by=updated_at&per_page=10`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    res.json(response.data || []);
  } catch (error) {
    console.error("GitLab API error:", error.message);
    res.status(500).json({
      message: "Error fetching GitLab projects",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/gitlab/projects/:projectId/commits
 * @desc    Get latest 5 commits for a GitLab project
 * @access  Public
 */
app.get("/api/gitlab/projects/:projectId/commits", async (req, res) => {
  const { projectId } = req.params;

  try {
    const response = await axios.get(
      `https://gitlab.com/api/v4/projects/${projectId}/repository/commits?per_page=5`,
      {
        timeout: 10000,
        headers: {
          Accept: "application/json",
        },
      }
    );

    res.json(response.data || []);
  } catch (error) {
    console.error("GitLab commits error:", error.message);
    res.status(500).json({
      message: "Error fetching GitLab commits",
      error: error.message,
    });
  }
});

/**
 * @route   GET /api/gitlab/search/:username
 * @desc    Search for GitLab user and return their data with projects
 * @access  Public
 */
app.get("/api/gitlab/search/:username", async (req, res) => {
  const { username } = req.params;

  try {
    const userResponse = await axios.get(
      `https://gitlab.com/api/v4/users?username=${encodeURIComponent(
        username
      )}`,
      {
        timeout: 10000,
      }
    );

    if (!userResponse.data || userResponse.data.length === 0) {
      return res.status(404).json({
        message: `GitLab user "${username}" not found`,
        suggestion: "Check the username or try a different GitLab username",
      });
    }

    const user = userResponse.data[0];
    const projectsResponse = await axios.get(
      `https://gitlab.com/api/v4/users/${user.id}/projects?order_by=updated_at&per_page=5`,
      {
        timeout: 10000,
      }
    );

    res.json({
      user: user,
      projects: projectsResponse.data || [],
      success: true,
    });
  } catch (error) {
    console.error("GitLab search error:", error.message);
    res.status(500).json({
      message: "Error searching GitLab user",
      error: error.message,
      suggestion: "The GitLab API might be temporarily unavailable",
    });
  }
});

// ===== ERROR HANDLING MIDDLEWARE =====
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
