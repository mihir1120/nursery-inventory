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
  fs.mkdirSync(uploadPath);
}

/* ---------- STATIC ---------- */
app.use("/uploads", express.static(uploadPath));

/* ---------- DATABASE ---------- */
const db = new sqlite3.Database("./inventory.db", (err) => {
  if (err) console.error("DB ERROR:", err.message);
  else console.log("✅ Connected to SQLite DB");
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

/* ---------- ROUTES ---------- */

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ✅ GET ALL ITEMS
app.get("/items", (req, res) => {
  db.all("SELECT * FROM items ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.log("GET ERROR:", err);
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

// ✅ ADD ITEM (Works with BOTH JSON & FormData)
app.post("/items", upload.single("image"), (req, res) => {
  console.log("📥 Incoming Data:", req.body);

  const {
    name,
    category,
    price,
    stock,
    vendor_name,
    vendor_phone,
    vendor_address,
  } = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  const query = `
    INSERT INTO items 
    (name, category, price, stock, image, vendor_name, vendor_phone, vendor_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
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
        console.log("❌ DB INSERT ERROR:", err);
        return res.status(500).json(err);
      }

      console.log("✅ Item Inserted ID:", this.lastID);
      res.json({ success: true, id: this.lastID });
    }
  );
});

// ✅ UPDATE ITEM
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

  const query = `
    UPDATE items SET
      name=?, category=?, price=?, stock=?,
      delivered=?, sold=?,
      vendor_name=?, vendor_phone=?, vendor_address=?
    WHERE id=?
  `;

  db.run(
    query,
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
        console.log("❌ UPDATE ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ updated: true });
    }
  );
});

// ✅ SELL ITEM
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
        console.log("❌ SELL ERROR:", err);
        return res.status(500).json(err);
      }

      res.json({ sold: true });
    }
  );
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});