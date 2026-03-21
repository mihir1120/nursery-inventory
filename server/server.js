const supabase = require("./supabase");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use("/uploads", express.static("uploads"));

// =======================
// FILE STORAGE
// =======================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// =======================
// ADD ITEM (SUPABASE)
// =======================
app.post("/add", upload.single("photo"), async (req, res) => {
  const {
    name,
    type,
    date,
    delivered,
    vendor_name,
    vendor_phone,
    vendor_address,
  } = req.body;

  const photo = req.file ? req.file.filename : "";

  const { data, error } = await supabase.from("inventory").insert([
    {
      name,
      type,
      date,
      delivered,
      sold: 0,
      stock: delivered,
      photo,
      vendor_name,
      vendor_phone,
      vendor_address,
    },
  ]);

  if (error) {
    console.log(error);
    return res.status(500).json(error);
  }

  res.json({ message: "Item added", data });
});

// =======================
// GET ITEMS
// =======================
app.get("/items", async (req, res) => {
  const { data, error } = await supabase.from("inventory").select("*");

  if (error) return res.status(500).json(error);

  res.json(data);
});

// =======================
// SELL
// =======================
app.put("/sell/:id", async (req, res) => {
  const id = req.params.id;
  const quantity = parseInt(req.body.quantity) || 1;

  // Get current item
  const { data: item } = await supabase
    .from("inventory")
    .select("*")
    .eq("id", id)
    .single();

  if (!item || item.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  const { error } = await supabase
    .from("inventory")
    .update({
      sold: item.sold + quantity,
      stock: item.stock - quantity,
    })
    .eq("id", id);

  if (error) return res.status(500).json(error);

  res.json({ message: "Items sold" });
});

// =======================
// EDIT ITEM
// =======================
app.put("/edit/:id", upload.single("photo"), async (req, res) => {
  const id = req.params.id;
  const {
    name,
    date,
    delivered,
    stock,
    vendor_name,
    vendor_phone,
    vendor_address,
  } = req.body;

  let updateData = {
    name,
    date,
    delivered,
    stock,
    vendor_name,
    vendor_phone,
    vendor_address,
  };

  if (req.file) {
    updateData.photo = req.file.filename;
  }

  const { error } = await supabase
    .from("inventory")
    .update(updateData)
    .eq("id", id);

  if (error) return res.status(500).json(error);

  res.json({ message: "Item updated" });
});

// =======================
// DELETE ITEM
// =======================
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;

  const { error } = await supabase
    .from("inventory")
    .delete()
    .eq("id", id);

  if (error) return res.status(500).json(error);

  res.json({ message: "Item deleted" });
});

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "ashokvatika123") {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false });
  }
});

// =======================
// SERVE REACT BUILD
// =======================
const buildPath = path.join(__dirname, "../build");

app.use(express.static(buildPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});