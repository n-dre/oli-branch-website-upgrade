// src/utils/auth.js
// Simple local auth for Vite/React (no backend).
// Stores users + session in localStorage or sessionStorage based on rememberMe.

const KEYS = {
  USERS: "registeredUsers",     // array of users
  SESSION: "oliBranchLogin",    // current session payload { user, token, createdAt }
  TOKEN: "oliBranchToken",      // optional mirror
  USER: "oliBranchUser",        // optional mirror
};

function safeParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function makeUserId() {
  return "USR" + Date.now().toString(36).toUpperCase();
}

function readUsers() {
  return safeParse(localStorage.getItem(KEYS.USERS) || "[]", []);
}

function writeUsers(users) {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

function writeSession(session, rememberMe) {
  const store = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  const sessionStr = JSON.stringify(session);

  store.setItem(KEYS.SESSION, sessionStr);
  if (session.token) store.setItem(KEYS.TOKEN, session.token);
  store.setItem(KEYS.USER, JSON.stringify(session.user || {}));

  // avoid conflicts across stores
  other.removeItem(KEYS.SESSION);
  other.removeItem(KEYS.TOKEN);
  other.removeItem(KEYS.USER);
}

function readSession() {
  const s1 = safeParse(sessionStorage.getItem(KEYS.SESSION) || "null", null);
  if (s1?.user?.email) return s1;

  const s2 = safeParse(localStorage.getItem(KEYS.SESSION) || "null", null);
  if (s2?.user?.email) return s2;

  return null;
}

function clearSession() {
  [localStorage, sessionStorage].forEach((store) => {
    store.removeItem(KEYS.SESSION);
    store.removeItem(KEYS.TOKEN);
    store.removeItem(KEYS.USER);
  });
}

function userPublicShape(u) {
  // Never return password
  return {
    id: u.id,
    name: u.name || "",
    email: u.email,
    business_name: u.business_name || "",
    entity_type: u.entity_type || "",
    account_type: u.account_type || "",
    zip_code: u.zip_code || "",
    is_veteran: !!u.is_veteran,
    is_immigrant: !!u.is_immigrant,
    createdAt: u.createdAt,
    role: u.role || "user",
  };
}

export const auth = {
  // For AuthProvider initial state
  getCurrentUser() {
    const session = readSession();
    return session?.user || null;
  },

  // Register user into localStorage registeredUsers
  register(userData) {
    try {
      const users = readUsers();

      const email = normalizeEmail(userData?.email);
      const password = String(userData?.password || "");

      if (!email) return { success: false, message: "Email is required" };
      if (!password) return { success: false, message: "Password is required" };

      const exists = users.some((u) => normalizeEmail(u.email) === email);
      if (exists) return { success: false, message: "Email already registered" };

      const newUser = {
        id: makeUserId(),
        email,
        password, // stored for mock login only (not secure for real apps)
        name: userData?.name || "",
        business_name: userData?.business_name || "",
        entity_type: userData?.entity_type || "",
        monthly_revenue: Number(userData?.monthly_revenue || 0),
        account_type: userData?.account_type || "",
        monthly_banking_fees: Number(userData?.monthly_banking_fees || 0),
        zip_code: userData?.zip_code || "",
        cash_deposits: !!userData?.cash_deposits,
        funding_interest: !!userData?.funding_interest,
        is_veteran: !!userData?.is_veteran,
        is_immigrant: !!userData?.is_immigrant,
        createdAt: new Date().toISOString(),
        role: "user",
      };

      users.push(newUser);
      writeUsers(users);

      return { success: true, user: userPublicShape(newUser) };
    } catch (e) {
      return { success: false, message: String(e) };
    }
  },

  // Login by checking registeredUsers
  login(emailInput, passwordInput, rememberMe = false) {
    try {
      const email = normalizeEmail(emailInput);
      const password = String(passwordInput || "");

      const users = readUsers();
      const found = users.find((u) => normalizeEmail(u.email) === email);

      if (!found) return { success: false, message: "Invalid email or password" };
      if (String(found.password || "") !== password)
        return { success: false, message: "Invalid email or password" };

      const session = {
        token: "mock-token-" + Date.now().toString(36),
        user: userPublicShape(found),
        createdAt: new Date().toISOString(),
      };

      writeSession(session, rememberMe);

      return { success: true, session };
    } catch (e) {
      return { success: false, message: String(e) };
    }
  },

  logout() {
    clearSession();
  },

  // Debug helpers (optional)
  _keys: KEYS,
  _readUsers: readUsers,
  _readSession: readSession,
};
