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

/* ---------- UPLOADS FOLDER ---------- */
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

app.use("/uploads", express.static(uploadPath));

/* ---------- DATABASE ---------- */
const db = new sqlite3.Database("./inventory.db", (err) => {
  if (err) console.error("❌ DB ERROR:", err.message);
  else console.log("✅ Connected to SQLite DB");
});

/* ---------- TABLE (UPDATED WITH RENTAL) ---------- */
db.run(`
CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  category TEXT,
  date TEXT,
  delivered INTEGER DEFAULT 0,
  price REAL DEFAULT 0,
  stock INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  image TEXT,

  vendor_name TEXT,
  vendor_phone TEXT,
  vendor_address TEXT,

  rental_name TEXT,
  rental_phone TEXT,
  rental_address TEXT
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

// Health
app.get("/api", (req, res) => {
  res.send("API is running 🚀");
});

// GET ITEMS
app.get("/items", (req, res) => {
  db.all("SELECT * FROM items ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      console.error("❌ GET ERROR:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows);
  });
});

// ADD ITEM
app.post("/items", upload.single("image"), (req, res) => {
  try {
    const {
      name,
      category,
      date,
      delivered,
      price,
      vendor_name,
      vendor_phone,
      vendor_address,
    } = req.body;

    if (!name || !category) {
      return res.status(400).json({ error: "Name & category required" });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const deliveredQty = Number(delivered) || 0;

    db.run(
      `INSERT INTO items 
      (name, category, date, delivered, price, stock, image, vendor_name, vendor_phone, vendor_address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        category,
        date || null,
        deliveredQty,
        Number(price) || 0,
        deliveredQty,
        image,
        vendor_name || "",
        vendor_phone || "",
        vendor_address || "",
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

/* ---------- UPDATE ITEM (🔥 WITH IMAGE + RENTAL) ---------- */
app.put("/items/:id", upload.single("image"), (req, res) => {
  const {
    name,
    category,
    date,
    delivered,
    price,
    stock,
    sold,

    vendor_name,
    vendor_phone,
    vendor_address,

    rental_name,
    rental_phone,
    rental_address,
  } = req.body;

  let image = null;

  if (req.file) {
    image = `/uploads/${req.file.filename}`;
  }

  db.get("SELECT image FROM items WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) {
      return res.status(500).json({ error: "Item not found" });
    }

    const finalImage = image || row.image;

    db.run(
      `UPDATE items SET
        name=?, category=?, date=?, delivered=?, price=?, stock=?, sold=?,
        image=?,
        vendor_name=?, vendor_phone=?, vendor_address=?,
        rental_name=?, rental_phone=?, rental_address=?
      WHERE id=?`,
      [
        name,
        category,
        date,
        delivered,
        price,
        stock,
        sold,
        finalImage,

        vendor_name,
        vendor_phone,
        vendor_address,

        rental_name,
        rental_phone,
        rental_address,

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
});

/* ---------- DELETE ---------- */
app.delete("/items/:id", (req, res) => {
  db.run("DELETE FROM items WHERE id = ?", [req.params.id], function (err) {
    if (err) {
      console.error("❌ DELETE ERROR:", err);
      return res.status(500).json({ error: "Delete failed" });
    }
    res.json({ deleted: true });
  });
});

/* ---------- SELL (SAFE) ---------- */
app.post("/sell/:id", (req, res) => {
  const quantity = Number(req.body.quantity);

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: "Valid quantity required" });
  }

  db.get("SELECT stock FROM items WHERE id = ?", [req.params.id], (err, row) => {
    if (err || !row) {
      return res.status(500).json({ error: "Item not found" });
    }

    if (row.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
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
});

/* ---------- SERVE FRONTEND ---------- */
const buildPath = path.join(__dirname, "../build");

if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  app.use((req, res) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

/* ---------- START ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});