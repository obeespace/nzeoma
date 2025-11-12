// Simple authentication utility using localStorage
const AUTH_KEY = 'nzeoma_admin_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Default admin credentials (you can change these)
const DEFAULT_CREDENTIALS = {
  username: 'nzeoma_admin',
  password: 'MarketGood25' // Updated to match the new credentials
};

export const login = (username, password) => {
  if (username === DEFAULT_CREDENTIALS.username && password === DEFAULT_CREDENTIALS.password) {
    const authData = {
      isAuthenticated: true,
      timestamp: Date.now(),
      username: username
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    return { success: true };
  }
  return { success: false, error: 'Invalid username or password' };
};

export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;
    
    const { isAuthenticated, timestamp } = JSON.parse(authData);
    
    // Check if session has expired
    if (Date.now() - timestamp > SESSION_DURATION) {
      logout();
      return false;
    }
    
    return isAuthenticated;
  } catch (error) {
    return false;
  }
};

export const getAuthUser = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return null;
    
    const { username, timestamp } = JSON.parse(authData);
    
    // Check if session has expired
    if (Date.now() - timestamp > SESSION_DURATION) {
      logout();
      return null;
    }
    
    return { username };
  } catch (error) {
    return null;
  }
};

export const refreshSession = () => {
  try {
    const authData = localStorage.getItem(AUTH_KEY);
    if (!authData) return false;
    
    const data = JSON.parse(authData);
    data.timestamp = Date.now();
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    return false;
  }
};