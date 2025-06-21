// API Configuration and utility functions

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper function to get auth token
const getAuthToken = () => {
  return localStorage.getItem("skytraining_token");
};

// Helper function to create request headers
const createHeaders = (includeAuth = false) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: createHeaders(options.includeAuth),
    ...options,
  };

  console.log(`API Request: ${config.method || "GET"} ${url}`);

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error for ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Get current user
  getMe: async () => {
    return apiRequest("/auth/me", {
      includeAuth: true,
    });
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    return apiRequest("/auth/users", {
      includeAuth: true,
    });
  },
};

// Courses API calls
export const coursesAPI = {
  // Get all courses
  getAll: async () => {
    return apiRequest("/courses");
  },

  // Get course by ID
  getById: async (id) => {
    return apiRequest(`/courses/${id}`);
  },

  // Create new course (admin only)
  create: async (courseData) => {
    return apiRequest("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
      includeAuth: true,
    });
  },

  // Update course (admin only)
  update: async (id, courseData) => {
    return apiRequest(`/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(courseData),
      includeAuth: true,
    });
  },

  // Delete course (admin only)
  delete: async (id) => {
    return apiRequest(`/courses/${id}`, {
      method: "DELETE",
      includeAuth: true,
    });
  },
};

// Enrollment API calls
export const enrollmentAPI = {
  // Create new enrollment
  create: async (enrollmentData) => {
    return apiRequest("/enrollments", {
      method: "POST",
      body: JSON.stringify(enrollmentData),
      includeAuth: true,
    });
  },

  // Get user's enrollments
  getMyEnrollments: async () => {
    return apiRequest("/enrollments/my", {
      includeAuth: true,
    });
  },

  // Get all enrollments (admin only)
  getAll: async () => {
    return apiRequest("/enrollments", {
      includeAuth: true,
    });
  },

  // Update enrollment status (admin only)
  updateStatus: async (id, status) => {
    return apiRequest(`/enrollments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      includeAuth: true,
    });
  },
};

// Admin API calls
export const adminAPI = {
  // Get dashboard statistics
  getDashboard: async () => {
    return apiRequest("/admin/dashboard", {
      includeAuth: true,
    });
  },

  // Get all students
  getStudents: async () => {
    return apiRequest("/admin/students", {
      includeAuth: true,
    });
  },

  // Get analytics data
  getAnalytics: async () => {
    return apiRequest("/admin/analytics", {
      includeAuth: true,
    });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return apiRequest("/health");
  },
};

// Export API base URL for direct use if needed
export { API_BASE_URL };
