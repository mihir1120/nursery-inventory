const express = require("express")
const cors = require("cors")
const sqlite3 = require("sqlite3").verbose()
const multer = require("multer")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads", express.static("uploads"))

const db = new sqlite3.Database("./server/database.db")

// CREATE TABLE
db.run(`
CREATE TABLE IF NOT EXISTS inventory(
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT,
type TEXT,
date TEXT,
delivered INTEGER,
sold INTEGER,
stock INTEGER,
photo TEXT
)
`)


// FILE STORAGE
const storage = multer.diskStorage({
destination: "uploads/",
filename: (req, file, cb) => {
cb(null, Date.now() + "-" + file.originalname)
}
})

const upload = multer({ storage })


// ADD ITEM
app.post("/add", upload.single("photo"), (req, res) => {

const { name, type, date, delivered } = req.body
const photo = req.file ? req.file.filename : ""

db.run(
`INSERT INTO inventory(name,type,date,delivered,sold,stock,photo)
VALUES(?,?,?,?,?,?,?)`,
[name, type, date, delivered, 0, delivered, photo],
function(err){
if(err){
res.status(500).send(err)
}else{
res.send("Item added")
}
})

})


// GET ALL ITEMS
app.get("/items", (req, res) => {

db.all("SELECT * FROM inventory", (err, rows) => {

if(err){
res.status(500).send(err)
}else{
res.json(rows)
}

})

})


// SELL ITEM (BULK SUPPORT)
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
res.status(500).send(err)
}else{
res.send("Items sold")
}

})

})


// DELETE ITEM
app.delete("/delete/:id", (req, res) => {

const id = req.params.id

db.run(
`DELETE FROM inventory WHERE id = ?`,
[id],
function(err){

if(err){
res.status(500).send(err)
}else{
res.send("Item deleted")
}

})

})



// ADMIN LOGIN
app.post("/login", (req, res) => {

const { username, password } = req.body;

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ashokvatika123";

if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {

res.json({
success: true,
message: "Login successful"
});

} else {

res.status(401).json({
success: false,
message: "Invalid login"
});

}

});

// START SERVER
app.listen(5000, () => {
console.log("Server running on port 5000")
})