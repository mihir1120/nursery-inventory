const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

/* ---------- MIDDLEWARE ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- ENSURE UPLOADS FOLDER ---------- */
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

/* ---------- STATIC FILES ---------- */
app.use("/uploads", express.static(uploadPath));

/* ---------- DATABASE ---------- */
const db = new sqlite3.Database("./inventory.db", (err) => {
  if (err) {
    console.error("❌ DB ERROR:", err.message);
  } else {
    console.log("✅ Connected to SQLite DB");
  }
});

/* ---------- TABLE ---------- */
db.run(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  price REAL,
  stock INTEGER,
  delivered INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  image TEXT,
  vendor_name TEXT,
  vendor_phone TEXT,
  vendor_address TEXT
)
`);

/* ---------- FILE UPLOAD ---------- */
const storage = multer.diskStorage({
  destination: uploadPath,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ---------- API ROUTES ---------- */

// Health
app.get("/api", (req, res) => {
  res.send("API is running 🚀");
});

// Get items
app.get("/items", (req, res) => {
  db.all("SELECT * FROM items ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error("❌ GET ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// Add item
app.post("/items", upload.single("image"), (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      vendor_name,
      vendor_phone,
      vendor_address,
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    db.run(
      `INSERT INTO items 
      (name, category, price, stock, image, vendor_name, vendor_phone, vendor_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        price,
        stock,
        image,
        vendor_name,
        vendor_phone,
        vendor_address,
      ],
      function (err) {
        if (err) {
          console.error("❌ INSERT ERROR:", err);
          return res.status(500).json({ error: "Insert failed" });
        }

        res.json({ success: true, id: this.lastID });
      }
    );
  } catch (err) {
    console.error("❌ SERVER ERROR:", err);
    res.status(500).json({ error: "Server crash" });
  }
});

// Update
app.put("/items/:id", (req, res) => {
  const {
    name,
    category,
    price,
    stock,
    delivered,
    sold,
    vendor_name,
    vendor_phone,
    vendor_address,
  } = req.body;

  db.run(
    `UPDATE items SET
      name=?, category=?, price=?, stock=?,
      delivered=?, sold=?,
      vendor_name=?, vendor_phone=?, vendor_address=?
    WHERE id=?`,
    [
      name,
      category,
      price,
      stock,
      delivered,
      sold,
      vendor_name,
      vendor_phone,
      vendor_address,
      req.params.id,
    ],
    function (err) {
      if (err) {
        console.error("❌ UPDATE ERROR:", err);
        return res.status(500).json({ error: "Update failed" });
      }

      res.json({ updated: true });
    }
  );
});

// Sell
app.post("/sell/:id", (req, res) => {
  const { quantity } = req.body;

  if (!quantity) {
    return res.status(400).json({ error: "Quantity required" });
  }

  db.run(
    `UPDATE items 
     SET sold = sold + ?, stock = stock - ? 
     WHERE id = ?`,
    [quantity, quantity, req.params.id],
    function (err) {
      if (err) {
        console.error("❌ SELL ERROR:", err);
        return res.status(500).json({ error: "Sell failed" });
      }

      res.json({ sold: true });
    }
  );
});

/* ---------- SERVE FRONTEND ---------- */

const buildPath = path.join(__dirname, "../build");

if (fs.existsSync(buildPath)) {
  console.log("✅ Serving React build");

  app.use(express.static(buildPath));

  // ✅ FINAL FIX (NO CRASH EVER)
  app.use((req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});