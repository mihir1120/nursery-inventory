import React, { useState } from "react";

// ✅ AUTO SWITCH API (LOCAL + RENDER)
const API =
  window.location.hostname.includes("render")
    ? "https://nursery-inventory.onrender.com"
    : "http://localhost:5000";

function AddItem({ fetchItems }) {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    vendor_name: "",
    vendor_phone: "",
    vendor_address: "",
  });

  const [image, setImage] = useState(null);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 API:", API);
    console.log("📤 Sending Form:", form);

    try {
      // ✅ USE JSON (NO FormData → FIXES RENDER ISSUE)
      const res = await fetch(`${API}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      console.log("✅ Response:", result);

      if (res.ok) {
        alert("Item Added Successfully ✅");

        setForm({
          name: "",
          category: "",
          price: "",
          stock: "",
          vendor_name: "",
          vendor_phone: "",
          vendor_address: "",
        });

        setImage(null);

        fetchItems(); // 🔥 refresh table
      } else {
        alert("❌ Failed to add item");
      }
    } catch (err) {
      console.error("❌ ERROR:", err);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <input
        placeholder="Category"
        value={form.category}
        onChange={(e) => handleChange("category", e.target.value)}
      />

      <input
        placeholder="Price"
        type="number"
        value={form.price}
        onChange={(e) => handleChange("price", e.target.value)}
      />

      <input
        placeholder="Stock"
        type="number"
        value={form.stock}
        onChange={(e) => handleChange("stock", e.target.value)}
      />

      <h3>Vendor</h3>

      <input
        placeholder="Vendor Name"
        value={form.vendor_name}
        onChange={(e) => handleChange("vendor_name", e.target.value)}
      />

      <input
        placeholder="Phone"
        value={form.vendor_phone}
        onChange={(e) => handleChange("vendor_phone", e.target.value)}
      />

      <input
        placeholder="Address"
        value={form.vendor_address}
        onChange={(e) => handleChange("vendor_address", e.target.value)}
      />

      {/* 🔴 TEMP DISABLED IMAGE FOR STABILITY */}
      {/* <input type="file" onChange={(e) => setImage(e.target.files[0])} /> */}

      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItem;