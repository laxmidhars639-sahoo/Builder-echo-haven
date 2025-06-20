import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on component mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("skytraining_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("skytraining_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("skytraining_user");
    }
  }, [user]);

  const login = (userData) => {
    const userWithTimestamp = {
      ...userData,
      loginTime: new Date().toISOString(),
      enrolledCourses: userData.enrolledCourses || [],
      flightHours: userData.flightHours || 0,
      certificates: userData.certificates || 0,
    };
    setUser(userWithTimestamp);

    // Store token in localStorage for API requests
    if (userData.token) {
      localStorage.setItem("skytraining_token", userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skytraining_user");
  };

  const updateUser = (updatedData) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  const enrollInCourse = (courseData) => {
    if (user) {
      const updatedCourses = [...(user.enrolledCourses || []), courseData];
      updateUser({ enrolledCourses: updatedCourses });
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    updateUser,
    enrollInCourse,
    isLoggedIn: !!user,
    isStudent: user?.userType === "student",
    isAdmin: user?.userType === "admin",
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
