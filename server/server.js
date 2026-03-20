const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const app = express()

app.use(cors())
app.use(express.json())

// Ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads")
}

app.use("/uploads", express.static("uploads"))

const db = new sqlite3.Database("./server/database.db")

// =======================
// CREATE TABLE (UPDATED)
// =======================
db.run(`
CREATE TABLE IF NOT EXISTS inventory(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
type TEXT,
date TEXT,
delivered INTEGER,
sold INTEGER,
stock INTEGER,
photo TEXT,
vendor_name TEXT,
vendor_phone TEXT,
vendor_address TEXT
)
`)

// =======================
// FILE STORAGE
// =======================
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const upload = multer({ storage })

// =======================
// ADD ITEM (UPDATED)
// =======================
app.post("/add", upload.single("photo"), (req, res) => {

  const { name, type, date, delivered, vendor_name, vendor_phone, vendor_address } = req.body
  const photo = req.file ? req.file.filename : ""

  db.run(
    `INSERT INTO inventory(name,type,date,delivered,sold,stock,photo,vendor_name,vendor_phone,vendor_address)
     VALUES(?,?,?,?,?,?,?,?,?,?)`,
    [name, type, date, delivered, 0, delivered, photo, vendor_name, vendor_phone, vendor_address],
    function(err){
      if(err){
        return res.status(500).json(err)
      }
      res.json({ message: "Item added" })
    }
  )

})

// =======================
// GET ITEMS
// =======================
app.get("/items", (req, res) => {

  db.all("SELECT * FROM inventory", (err, rows) => {

    if(err){
      return res.status(500).json(err)
    }

    res.json(rows)
  })

})

// =======================
// SELL
// =======================
app.put("/sell/:id", (req, res) => {

  const id = req.params.id
  const quantity = parseInt(req.body.quantity) || 1

  db.run(
    `UPDATE inventory
     SET sold = sold + ?,
         stock = stock - ?
     WHERE id = ? AND stock >= ?`,
    [quantity, quantity, id, quantity],
    function(err){

      if(err){
        return res.status(500).json(err)
      }

      res.json({ message: "Items sold" })
    }
  )

})

// =======================
// EDIT ITEM (UPDATED)
// =======================
app.put("/edit/:id", upload.single("photo"), (req, res) => {

  const id = req.params.id
  const { name, date, delivered, stock, vendor_name, vendor_phone, vendor_address } = req.body

  if(req.file){

    const newPhoto = req.file.filename

    db.get("SELECT photo FROM inventory WHERE id = ?", [id], (err, row) => {

      if(row && row.photo){
        const oldPath = path.join("uploads", row.photo)
        if(fs.existsSync(oldPath)){
          fs.unlinkSync(oldPath)
        }
      }

      db.run(
        `UPDATE inventory
         SET name=?, date=?, delivered=?, stock=?, photo=?, vendor_name=?, vendor_phone=?, vendor_address=?
         WHERE id=?`,
        [name, date, delivered, stock, newPhoto, vendor_name, vendor_phone, vendor_address, id],
        function(err){
          if(err){
            return res.status(500).json(err)
          }
          res.json({ message: "Item updated" })
        }
      )

    })

  } else {

    db.run(
      `UPDATE inventory
       SET name=?, date=?, delivered=?, stock=?, vendor_name=?, vendor_phone=?, vendor_address=?
       WHERE id=?`,
      [name, date, delivered, stock, vendor_name, vendor_phone, vendor_address, id],
      function(err){
        if(err){
          return res.status(500).json(err)
        }
        res.json({ message: "Item updated" })
      }
    )

  }

})

// =======================
// DELETE ITEM
// =======================
app.delete("/delete/:id", (req, res) => {

  const id = req.params.id

  db.run(
    `DELETE FROM inventory WHERE id = ?`,
    [id],
    function(err){
      if(err){
        return res.status(500).json(err)
      }
      res.json({ message: "Item deleted" })
    }
  )

})

// =======================
// LOGIN
// =======================
app.post("/login", (req, res) => {

  const { username, password } = req.body

  if(username === "admin" && password === "ashokvatika123"){
    res.json({ success: true })
  } else {
    res.status(401).json({ success: false })
  }

})

// =======================
// SERVE REACT BUILD
// =======================
const buildPath = path.join(__dirname, "../build")

app.use(express.static(buildPath))

app.get("/", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"))
})

// =======================
// START SERVER
// =======================
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log("Server running on port " + PORT)
})