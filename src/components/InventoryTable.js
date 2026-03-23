import React, { useState } from "react";

const API = process.env.REACT_APP_API || "http://localhost:5000";

function InventoryTable({ items, fetchItems }) {
  const [selectedVendor, setSelectedVendor] = useState(null);

  const sellItem = async (id) => {
    const qty = prompt("Enter quantity");
    if (!qty) return;

    await fetch(`${API}/sell/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: Number(qty) }),
    });

    fetchItems();
  };

  return (
    <div>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Stock</th>
            <th>Sold</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.stock}</td>
              <td>{item.sold}</td>

              <td>
                <button onClick={() => sellItem(item.id)}>Sell</button>

                <button onClick={() => setSelectedVendor(item)}>
                  Vendor
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedVendor && (
        <div style={{ border: "1px solid black", padding: "10px" }}>
          <h3>Vendor Details</h3>
          <p>Name: {selectedVendor.vendor_name}</p>
          <p>Phone: {selectedVendor.vendor_phone}</p>
          <p>Address: {selectedVendor.vendor_address}</p>

          <button onClick={() => setSelectedVendor(null)}>Close</button>
        </div>
      )}
    </div>
  );
}

export default InventoryTable;