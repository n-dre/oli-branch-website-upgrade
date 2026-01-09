// server.js
import path from "path";
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";

// For ES modules, we need to get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory users (demo). Replace with Google Sheets later.
const users = new Map(); // key=email -> user object

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist"))); // Changed to "dist" for Vite build

app.post("/api/auth/signup", (req, res) => {
  const { email, password, name, business_name, business_type } = req.body || {};

  if (!email || !password || !name || !business_name) {
    return res.status(400).json({ detail: "Missing required fields." });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (users.has(normalizedEmail)) {
    return res.status(409).json({ detail: "Email already registered." });
  }

  // Basic validation
  if (String(password).length < 6) {
    return res.status(400).json({ detail: "Password must be at least 6 characters." });
  }

  const id = cryptoRandomId();
  const token = cryptoRandomId() + "." + cryptoRandomId();

  const user = {
    id,
    email: normalizedEmail,
    name: String(name).trim(),
    business_name: String(business_name).trim(),
    business_type: business_type ? String(business_type) : "",
    created_at: new Date().toISOString(),
  };

  users.set(normalizedEmail, { ...user, password }); // For real use, hash passwords.

  return res.status(201).json({
    id: user.id,
    email: user.email,
    name: user.name,
    token,
  });
});

function cryptoRandomId() {
  return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
}

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});