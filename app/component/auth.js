// Simple authentication utility using localStorage
const AUTH_KEY = 'nzeoma_admin_auth';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Get admin credentials from environment variables with fallback
const getCredentialsFromEnv = () => {
  const envUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  
  return {
    username: envUsername || 'nzeoma_admin', // fallback
    password: envPassword || 'MarketGood25'  // fallback
  };
};

export const login = (username, password) => {
  const credentials = getCredentialsFromEnv();
  
  if (username === credentials.username && password === credentials.password) {
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