import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import "./App.css";

function App() {

const [plants,setPlants] = useState([]);
const [pots,setPots] = useState([]);
const [loggedIn,setLoggedIn] = useState(false);

useEffect(()=>{
const auth = localStorage.getItem("loggedIn");
if(auth){
setLoggedIn(true);
}
loadItems();
},[]);

const loadItems = async ()=>{

const res = await fetch("/items");
const data = await res.json();

setPlants(data.filter(i=>i.type==="plant"));
setPots(data.filter(i=>i.type==="pot"));

};

// ADD ITEM
const addItem = async(item,type)=>{

const formData = new FormData();

formData.append("name",item.name);
formData.append("type",type);
formData.append("date",item.date);
formData.append("delivered",item.delivered);
formData.append("photo",item.photo);

await fetch("/add",{
method:"POST",
body:formData
});

loadItems();

};

// SELL
const sellItem = async(id,quantity)=>{

await fetch(`/sell/${id}`,{
method:"PUT",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({quantity})
});

loadItems();

};

// DELETE
const deleteItem = async(id)=>{

await fetch(`/delete/${id}`,{
method:"DELETE"
});

loadItems();

};

if(!loggedIn){
return <Login setLoggedIn={setLoggedIn}/>;
}

return(

<div className="app">

<h1>🌱 AshokVatika Nursery Inventory</h1>

<AddItem addItem={addItem}/>

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