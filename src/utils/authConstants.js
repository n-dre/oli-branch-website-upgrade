// src/utils/authConstants.js

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'registeredUsers',
  CURRENT_USER: 'currentUser',
  SESSION: 'userSession',
  IS_LOGGED_IN: 'isLoggedIn',
  USER_EMAIL: 'userEmail',
  USER_NAME: 'userName',
  USER_COMPANY: 'userCompany',
  REMEMBER_ME: 'rememberMe',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
};

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

// Session config
export const SESSION_CONFIG = {
  DEFAULT_EXPIRY_HOURS: 24,
  REMEMBER_ME_EXPIRY_DAYS: 30,
};

// Error messages
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email address',
  EMAIL_REQUIRED: 'Email is required',
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`,
  INVALID_CREDENTIALS: "Invalid email or password. Please sign up if you don't have an account.",
  USER_EXISTS: 'An account with this email already exists',
  GENERIC_ERROR: 'An error occurred. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
};

// Success messages
export const AUTH_SUCCESS = {
  LOGIN: 'Welcome back! Redirecting...',
  REGISTER: 'Account created successfully! Redirecting...',
  LOGOUT: 'You have been logged out successfully.',
  PASSWORD_RESET: 'Password reset link sent to your email.',
};