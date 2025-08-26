// ===== GITLAB API ROUTES =====

/**
 * @route   GET /api/gitlab/user/:username
 * @desc    Get GitLab user information by username
 * @access  Public
 */
app.get("/api/gitlab/user/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // GitLab API endpoint to search for users by username
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
      // Return the first matching user
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
 * @route   GET /api/gitlab/search/:username
 * @desc    Search for GitLab user and return their data with projects
 * @access  Public
 */
app.get("/api/gitlab/search/:username", async (req, res) => {
  const { username } = req.params;

  try {
    // First, search for the user
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

    // Then get their projects
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
