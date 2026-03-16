import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import "./App.css";

function App() {

const [plants,setPlants] = useState([]);
const [pots,setPots] = useState([]);
const [loggedIn,setLoggedIn] = useState(false);

// LOAD ITEMS FUNCTION
const loadItems = async ()=>{

try{

const res = await fetch("/items");
const data = await res.json();

setPlants(data.filter(i=>i.type==="plant"));
setPots(data.filter(i=>i.type==="pot"));

}catch(err){
console.log("Error loading items",err);
}

};

useEffect(()=>{

const auth = localStorage.getItem("loggedIn");

if(auth){
setLoggedIn(true);
}

// FIRST LOAD
loadItems();

// AUTO REFRESH EVERY 3 SECONDS
const interval = setInterval(()=>{
loadItems();
},3000);

return ()=>clearInterval(interval);

},[]);


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


// SELL ITEM
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


// DELETE ITEM
const deleteItem = async(id)=>{

await fetch(`/delete/${id}`,{
method:"DELETE"
});

loadItems();

};


// LOGOUT
const logout = ()=>{

localStorage.removeItem("loggedIn");
setLoggedIn(false);

};


// LOGIN SCREEN
if(!loggedIn){
return <Login setLoggedIn={setLoggedIn}/>;
}


return(

<div className="app">

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

<h1>🌱 AshokVatika Nursery Inventory</h1>

<button
onClick={logout}
style={{
background:"red",
color:"white",
border:"none",
padding:"8px 15px",
cursor:"pointer"
}}
>
Logout
</button>

</div>


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