import React, { useState } from "react";

const API = process.env.REACT_APP_API || "http://localhost:5000";

function AddItem({ fetchItems }) {
  const [form, setForm] = useState({
    name: "",
    category: "Plant",
    date: "",
    delivered: "",
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

    const data = new FormData();
    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    if (image) data.append("image", image);

    await fetch(`${API}/items`, {
      method: "POST",
      body: data,
    });

    fetchItems();
  };

  return (
    <form onSubmit={handleSubmit}>

      {/* CATEGORY */}
      <select
        value={form.category}
        onChange={(e) => handleChange("category", e.target.value)}
      >
        <option>Plant</option>
        <option>Pots</option>
        <option>Soil</option>
        <option>Fertilizer</option>
      </select>

      <input
        placeholder="Name"
        onChange={(e) => handleChange("name", e.target.value)}
      />

      {/* DATE */}
      <input
  type="date"
  onChange={(e) => setForm({ ...form, date: e.target.value })}
/>

      <input
        placeholder="Delivered Quantity"
        type="number"
        onChange={(e) => handleChange("delivered", e.target.value)}
      />

      {/* IMAGE */}
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      {/* VENDOR */}
      <input
        placeholder="Vendor Name"
        onChange={(e) => handleChange("vendor_name", e.target.value)}
      />

      <input
        placeholder="Vendor Phone"
        onChange={(e) => handleChange("vendor_phone", e.target.value)}
      />

      <input
        placeholder="Vendor Address"
        onChange={(e) => handleChange("vendor_address", e.target.value)}
      />

      <button type="submit">Add Item</button>
    </form>
  );
}

export default AddItem;