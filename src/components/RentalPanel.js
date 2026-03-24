import React, { useState } from "react";

const API = "https://nursery-inventory.onrender.com";

function RentalPanel({ item, close, fetchItems }) {

  const [data, setData] = useState({
    rental_name: item.rental_name || "",
    rental_phone: item.rental_phone || "",
    rental_address: item.rental_address || "",
    stock: item.stock,
    date: item.date,
  });

  const handleChange = (field, value) => {
    setData({ ...data, [field]: value });
  };

  const saveRental = async () => {
    await fetch(`${API}/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...item,
        ...data,
      }),
    });

    fetchItems();
    close();
  };

  return (
    <div>

      <h3>{item.name}</h3>

      <input
        type="date"
        value={data.date}
        onChange={(e) => handleChange("date", e.target.value)}
      />

      <input
        type="number"
        value={data.stock}
        onChange={(e) => handleChange("stock", e.target.value)}
      />

      <input
        placeholder="Rental Name"
        value={data.rental_name}
        onChange={(e) => handleChange("rental_name", e.target.value)}
      />

      <input
        placeholder="Phone"
        value={data.rental_phone}
        onChange={(e) => handleChange("rental_phone", e.target.value)}
      />

      <input
        placeholder="Address"
        value={data.rental_address}
        onChange={(e) => handleChange("rental_address", e.target.value)}
      />

      <button
        style={{ background: "purple", color: "white" }}
        onClick={saveRental}
      >
        Add to Rental
      </button>

    </div>
  );
}

export default RentalPanel;