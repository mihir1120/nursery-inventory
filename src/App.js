import React, { useEffect, useState } from "react";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";

const API = process.env.REACT_APP_API || "http://localhost:5000";

function App() {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    try {
      const res = await fetch(`${API}/items`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error("❌ Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>🌿 Nursery Inventory</h1>

      <AddItem fetchItems={fetchItems} />

      <InventoryTable items={items} fetchItems={fetchItems} />
    </div>
  );
}

export default App;