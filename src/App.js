import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import "./App.css";

function App() {

  const [loggedIn, setLoggedIn] = useState(false);
  const [plants, setPlants] = useState([]);
  const [pots, setPots] = useState([]);

  // LOAD DATA FROM DATABASE
  const loadItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/items");
      const data = await res.json();

      setPlants(data.filter(item => item.type === "plant"));
      setPots(data.filter(item => item.type === "pot"));
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      loadItems();
    }
  }, [loggedIn]);

  // ADD ITEM
  const addItem = async (item, type) => {

    const formData = new FormData();

    formData.append("name", item.name);
    formData.append("type", type);
    formData.append("date", item.date);
    formData.append("delivered", item.delivered);

    if (item.photo) {
      formData.append("photo", item.photo);
    }

    await fetch("http://localhost:5000/add", {
      method: "POST",
      body: formData
    });

    loadItems();
  };

  // SELL ITEM (BULK SUPPORT)
  const sellItem = async (id, quantity) => {

    const qty = quantity && quantity > 0 ? quantity : 1;

    await fetch(`http://localhost:5000/sell/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: qty
      })
    });

    loadItems();
  };

  // DELETE ITEM
  const deleteItem = async (id) => {

    await fetch(`http://localhost:5000/delete/${id}`, {
      method: "DELETE"
    });

    loadItems();
  };

  // SHOW LOGIN PAGE FIRST
  if (!loggedIn) {
    return <Login onLogin={setLoggedIn} />;
  }

  return (

    <div className="app">

      <h1>🌱 AshokVatika Nursery Inventory</h1>

      <AddItem addItem={addItem} />

      <h2>Plants</h2>

      <InventoryTable
        data={plants}
        sellItem={sellItem}
        deleteItem={deleteItem}
      />

      <h2>Pots</h2>

      <InventoryTable
        data={pots}
        sellItem={sellItem}
        deleteItem={deleteItem}
      />

    </div>

  );
}

export default App;