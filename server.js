// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Stripe from "stripe";
import pg from "pg";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const { Pool } = pg;

// ✅ REQUIRED env vars:
// DATABASE_URL=postgresql://user:pass@host:5432/db
// JWT_SECRET=superlongsecret
// STRIPE_SECRET_KEY=sk_live_...
// STRIPE_PRICE_OLI_LITE=price_...
// STRIPE_PRICE_OLI_ASSIST=price_...
// STRIPE_PRICE_OLI_OVERSIGHT=price_...
// STRIPE_PRICE_OLI_PRO=price_...

if (!process.env.DATABASE_URL) throw new Error("Missing DATABASE_URL in .env");
if (!process.env.JWT_SECRET) throw new Error("Missing JWT_SECRET in .env");
if (!process.env.STRIPE_SECRET_KEY) throw new Error("Missing STRIPE_SECRET_KEY in .env");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

/* -----------------------------
   Helpers
------------------------------ */

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function signToken(user_id) {
  return jwt.sign({ user_id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

/* -----------------------------
   Auth Middleware
------------------------------ */

function auth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) return res.status(401).json({ error: "Missing token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.user_id) return res.status(401).json({ error: "Invalid token" });
    req.user_id = decoded.user_id;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

/* -----------------------------
   Health
------------------------------ */

app.get("/api/health", async (_req, res) => {
  try {
    const r = await pool.query("SELECT 1 as ok");
    return res.json({ ok: true, db: r.rows?.[0]?.ok === 1 });
  } catch {
    return res.status(500).json({ ok: false, db: false });
  }
});

/* -----------------------------
   SIGNUP (canonical user + profile transaction)
   POST /api/auth/signup
   body: { email, password, full_name, business_name, business_type, zip_code }
------------------------------ */

app.post("/api/auth/signup", async (req, res) => {
  const {
    email,
    password,
    full_name,
    business_name,
    business_type,
    zip_code,
  } = req.body || {};

  if (!email || !password || !full_name || !business_name || !business_type || !zip_code) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  if (String(password).length < 8) {
    return res.status(400).json({ error: "Password must be at least 8 characters" });
  }

  const normalizedEmail = normalizeEmail(email);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const password_hash = await bcrypt.hash(String(password), 12);

    const userRes = await client.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING user_id, email, created_at`,
      [normalizedEmail, password_hash]
    );

    const user = userRes.rows[0];

    await client.query(
      `INSERT INTO profiles (
         user_id, full_name, business_name, business_type, zip_code, profile_photo_url
       ) VALUES ($1, $2, $3, $4, $5, NULL)`,
      [
        user.user_id,
        String(full_name).trim(),
        String(business_name).trim(),
        String(business_type).trim(),
        String(zip_code).trim(),
      ]
    );

    await client.query("COMMIT");

    const token = signToken(user.user_id);

    return res.status(201).json({
      user_id: user.user_id,
      email: user.email,
      token,
    });
  } catch (e) {
    await client.query("ROLLBACK");

    // Postgres unique violation
    if (e?.code === "23505") {
      return res.status(409).json({ error: "Email already exists" });
    }

    console.error("Signup error:", e);
    return res.status(500).json({ error: "Signup failed" });
  } finally {
    client.release();
  }
});

/* -----------------------------
   LOGIN
   POST /api/auth/login
   body: { email, password }
------------------------------ */

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Missing email or password" });
  }

  const normalizedEmail = normalizeEmail(email);

  try {
    const r = await pool.query(
      `SELECT user_id, email, password_hash
       FROM users
       WHERE email = $1`,
      [normalizedEmail]
    );

    if (r.rowCount === 0) return res.status(401).json({ error: "Invalid credentials" });

    const user = r.rows[0];
    const ok = await bcrypt.compare(String(password), user.password_hash);

    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user.user_id);

    return res.json({
      user_id: user.user_id,
      email: user.email,
      token,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ error: "Login failed" });
  }
});

/* -----------------------------
   ME (canonical profile fetch for dashboard auto-population)
   GET /api/me (auth)
------------------------------ */

app.get("/api/me", auth, async (req, res) => {
  try {
    const r = await pool.query(
      `SELECT
         p.user_id,
         u.email,
         p.full_name,
         p.business_name,
         p.business_type,
         p.zip_code,
         p.profile_photo_url
       FROM profiles p
       JOIN users u ON u.user_id = p.user_id
       WHERE p.user_id = $1`,
      [req.user_id]
    );

    if (r.rowCount === 0) return res.status(404).json({ error: "Profile not found" });

    return res.json({ profile: r.rows[0] });
  } catch (e) {
    console.error("Me error:", e);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
});

/* -----------------------------
   Stripe Checkout Session
   POST /api/stripe/checkout-session (auth)
   body:
     { type: "subscription", planKey: "oli_lite" }
     OR
     { type: "one_time", amount: 29.99 }
------------------------------ */

app.post("/api/stripe/checkout-session", auth, async (req, res) => {
  try {
    const { type, planKey, amount } = req.body || {};

    const PRICE_IDS = {
      oli_lite: process.env.STRIPE_PRICE_OLI_LITE,
      oli_assist: process.env.STRIPE_PRICE_OLI_ASSIST,
      oli_oversight: process.env.STRIPE_PRICE_OLI_OVERSIGHT,
      oli_pro: process.env.STRIPE_PRICE_OLI_PRO,
    };

    // IMPORTANT:
    // In production, set FRONTEND_ORIGIN explicitly (avoid trusting headers).
    // Example: FRONTEND_ORIGIN=https://app.olibranch.com
    const origin =
      process.env.FRONTEND_ORIGIN ||
      req.headers.origin ||
      "http://localhost:5173";

    const sessionParams = {
      success_url: `${origin}/payment/success`,
      cancel_url: `${origin}/payment?canceled=1`,
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      // Optional metadata
      metadata: {
        user_id: String(req.user_id),
        checkout_type: String(type || ""),
      },
    };

    if (type === "subscription") {
      const key = String(planKey || "").trim();
      const priceId = PRICE_IDS[key];

      if (!priceId) {
        return res.status(400).json({
          error: "Invalid planKey or missing STRIPE_PRICE_* env var",
        });
      }

      sessionParams.mode = "subscription";
      sessionParams.line_items = [{ price: priceId, quantity: 1 }];
    } else if (type === "one_time") {
      const cents = Math.round(Number(amount) * 100);
      if (!Number.isFinite(cents) || cents <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      sessionParams.mode = "payment";
      sessionParams.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Oli-Branch One-Time Payment" },
            unit_amount: cents,
          },
          quantity: 1,
        },
      ];
    } else {
      return res.status(400).json({ error: "Invalid type (subscription|one_time)" });
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    return res.json({ url: session.url });
  } catch (e) {
    console.error("Stripe error:", e);
    return res.status(500).json({ error: e?.message || "Stripe error" });
  }
});

/* -----------------------------
   Start server
------------------------------ */

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
