// src/utils/authHelpers.js

import { STORAGE_KEYS, VALIDATION, SESSION_CONFIG, AUTH_ERRORS } from './constants';

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  return VALIDATION.EMAIL_REGEX.test(email);
};

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  return password && password.length >= VALIDATION.PASSWORD_MIN_LENGTH;
};

/**
 * Validate login form inputs
 */
export const validateLoginForm = (email, password) => {
  const errors = {};

  if (!email) {
    errors.email = AUTH_ERRORS.EMAIL_REQUIRED;
  } else if (!isValidEmail(email)) {
    errors.email = AUTH_ERRORS.INVALID_EMAIL;
  }

  if (!password) {
    errors.password = AUTH_ERRORS.PASSWORD_REQUIRED;
  } else if (!isValidPassword(password)) {
    errors.password = AUTH_ERRORS.PASSWORD_TOO_SHORT;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate registration form inputs
 */
export const validateRegistrationForm = (userData) => {
  const errors = {};
  const { email, password, name, confirmPassword } = userData;

  if (!name || name.trim().length < VALIDATION.NAME_MIN_LENGTH) {
    errors.name = `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;
  }

  if (!email) {
    errors.email = AUTH_ERRORS.EMAIL_REQUIRED;
  } else if (!isValidEmail(email)) {
    errors.email = AUTH_ERRORS.INVALID_EMAIL;
  }

  if (!password) {
    errors.password = AUTH_ERRORS.PASSWORD_REQUIRED;
  } else if (!isValidPassword(password)) {
    errors.password = AUTH_ERRORS.PASSWORD_TOO_SHORT;
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generate session expiry timestamp
 */
export const getSessionExpiry = (rememberMe = false) => {
  const now = new Date();
  if (rememberMe) {
    now.setDate(now.getDate() + SESSION_CONFIG.REMEMBER_ME_EXPIRY_DAYS);
  } else {
    now.setHours(now.getHours() + SESSION_CONFIG.DEFAULT_EXPIRY_HOURS);
  }
  return now.getTime();
};

/**
 * Check if session is expired
 */
export const isSessionExpired = (expiryTimestamp) => {
  if (!expiryTimestamp) return true;
  return Date.now() > expiryTimestamp;
};

/**
 * Get users from localStorage
 */
export const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  } catch {
    return [];
  }
};

/**
 * Save users to localStorage
 */
export const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Find user by email
 */
export const findUserByEmail = (email) => {
  const users = getStoredUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

/**
 * Create user session object
 */
export const createSession = (user, rememberMe = false) => {
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      business_name: user.business_name,
    },
    expiresAt: getSessionExpiry(rememberMe),
    rememberMe,
  };
};

/**
 * Save session to localStorage
 */
export const saveSession = (session) => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
  localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
  localStorage.setItem(STORAGE_KEYS.USER_EMAIL, session.user.email);
  localStorage.setItem(STORAGE_KEYS.USER_NAME, session.user.name || '');
  localStorage.setItem(STORAGE_KEYS.USER_COMPANY, session.user.business_name || '');
};

/**
 * Get current session from localStorage
 */
export const getSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(STORAGE_KEYS.SESSION));
    if (session && !isSessionExpired(session.expiresAt)) {
      return session;
    }
    // Clear expired session
    clearSession();
    return null;
  } catch {
    return null;
  }
};

/**
 * Clear session from localStorage
 */
export const clearSession = () => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
  localStorage.removeItem(STORAGE_KEYS.USER_NAME);
  localStorage.removeItem(STORAGE_KEYS.USER_COMPANY);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Generate unique ID
 */
export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Hash password (simple for demo - use bcrypt in production)
 */
export const hashPassword = (password) => {
  // In production, use proper hashing on the backend
  return btoa(password);
};

/**
 * Verify password (simple for demo)
 */
export const verifyPassword = (inputPassword, storedPassword) => {
  // In production, use proper verification on the backend
  return btoa(inputPassword) === storedPassword || inputPassword === storedPassword;
};