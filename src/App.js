import React, { useEffect, useState } from "react";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import VendorPanel from "./components/VendorPanel";
import RentalPanel from "./components/RentalPanel"; // ✅ keep this
import "./App.css";

const API =
  window.location.hostname.includes("render")
    ? "https://nursery-inventory.onrender.com"
    : "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null); // Vendor
  const [rentalItem, setRentalItem] = useState(null); // 🔥 IMPORTANT FIX

  /* ---------- FETCH ITEMS ---------- */
  const fetchItems = async () => {
    try {
      const res = await fetch(`${API}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  /* ---------- UPDATE VENDOR ---------- */
  const updateVendor = async (data) => {
    try {
      await fetch(`${API}/items/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      fetchItems();
      setSelectedItem(null);
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  return (
    <div className="app">

      {/* HEADER */}
      <div className="header">
        🌱 AshokVatika Nursery Inventory
      </div>

      {/* ADD ITEM */}
      <div className="form-box">
        <AddItem fetchItems={fetchItems} />
      </div>

      {/* TABLE */}
      <div className="section">
        <h2>Inventory</h2>

        <InventoryTable
          items={items}
          fetchItems={fetchItems}
          setSelectedItem={setSelectedItem}
          setRentalItem={setRentalItem}   
        />
      </div>

      {/* 🔥 VENDOR SIDEBAR */}
      {selectedItem && (
        <div className="sidebar">
          <div className="sidebar-header">
            <h2>Vendor Info</h2>
            <button
              className="close-btn"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
          </div>

          <VendorPanel
            item={selectedItem}
            updateVendor={updateVendor}
          />
        </div>
      )}

      {/* 🔥 RENTAL SIDEBAR */}
      {rentalItem && (
        <div className="sidebar">

          <div className="sidebar-header">
            <h2>Rental</h2>
            <button
              className="close-btn"
              onClick={() => setRentalItem(null)}
            >
              ✕
            </button>
          </div>

          <RentalPanel
            item={rentalItem}
            close={() => setRentalItem(null)}
            fetchItems={fetchItems}
          />

        </div>
      )}

    </div>
  );
}

export default App;