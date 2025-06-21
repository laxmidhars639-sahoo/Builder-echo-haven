const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

// Simple file-based storage for development
const USERS_FILE = path.join(__dirname, "../data/users.json");
const DATA_DIR = path.join(__dirname, "../data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2));
}

class FileStorage {
  static getUsers() {
    try {
      const data = fs.readFileSync(USERS_FILE, "utf8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error reading users file:", error);
      return [];
    }
  }

  static saveUsers(users) {
    try {
      fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
      return true;
    } catch (error) {
      console.error("Error saving users file:", error);
      return false;
    }
  }

  static async createUser(userData) {
    try {
      const users = this.getUsers();

      // Check if user already exists
      const existingUser = users.find((user) => user.email === userData.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 12);

      // Create new user
      const newUser = {
        _id: Date.now().toString(), // Simple ID generation
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: hashedPassword,
        phone: userData.phone || "",
        userType: userData.userType,
        gender: userData.gender || "not-specified",
        flightHours: 0,
        certificates: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null,
        loginAttempts: 0,
        lockUntil: null,
      };

      users.push(newUser);
      this.saveUsers(users);

      // Return user without password
      const { password, ...userWithoutPassword } = newUser;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async findUserByCredentials(email, password) {
    try {
      const users = this.getUsers();
      const user = users.find((user) => user.email === email);

      if (!user) {
        throw new Error("Invalid login credentials");
      }

      // Check if account is locked
      if (user.lockUntil && new Date(user.lockUntil) > new Date()) {
        throw new Error(
          "Account temporarily locked due to too many failed attempts",
        );
      }

      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Increment login attempts
        user.loginAttempts = (user.loginAttempts || 0) + 1;

        // Lock account after 5 failed attempts for 30 minutes
        if (user.loginAttempts >= 5) {
          user.lockUntil = new Date(Date.now() + 30 * 60 * 1000).toISOString();
        }

        this.updateUser(user._id, {
          loginAttempts: user.loginAttempts,
          lockUntil: user.lockUntil,
        });

        throw new Error("Invalid login credentials");
      }

      // Reset login attempts on successful login
      user.loginAttempts = 0;
      user.lockUntil = null;
      user.lastLogin = new Date().toISOString();

      this.updateUser(user._id, {
        loginAttempts: 0,
        lockUntil: null,
        lastLogin: user.lastLogin,
      });

      // Return user without password
      const { password: userPassword, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static findUserById(id) {
    const users = this.getUsers();
    const user = users.find((user) => user._id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }

  static updateUser(id, updateData) {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user._id === id);

    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = { ...users[userIndex], ...updateData };
    this.saveUsers(users);

    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  }

  static deleteUser(id) {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user._id === id);

    if (userIndex === -1) {
      return false;
    }

    users.splice(userIndex, 1);
    return this.saveUsers(users);
  }

  static getAllUsers() {
    const users = this.getUsers();
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = FileStorage;
