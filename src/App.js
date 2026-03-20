import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import "./App.css";

function App() {

const [plants,setPlants] = useState([]);
const [pots,setPots] = useState([]);
const [loggedIn,setLoggedIn] = useState(false);

// 🔥 NEW STATES
const [search,setSearch] = useState("");
const [filterType,setFilterType] = useState("all");

// LOAD ITEMS
const loadItems = async ()=>{
const res = await fetch("/items");
const data = await res.json();

setPlants(data.filter(i=>i.type==="plant"));
setPots(data.filter(i=>i.type==="pot"));
};

useEffect(()=>{

const auth = localStorage.getItem("loggedIn");
if(auth) setLoggedIn(true);

loadItems();

const interval = setInterval(loadItems,3000);
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

await fetch("/add",{method:"POST",body:formData});
loadItems();
};

// SELL
const sellItem = async(id,quantity)=>{
await fetch(`/sell/${id}`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({quantity})
});
loadItems();
};

// EDIT
const editItem = async(item)=>{
const formData = new FormData();

formData.append("name",item.name);
formData.append("date",item.date);
formData.append("delivered",item.delivered);
formData.append("stock",item.stock);

if(item.photo instanceof File){
formData.append("photo",item.photo);
}

await fetch(`/edit/${item.id}`,{
method:"PUT",
body:formData
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

// 🔥 FILTER LOGIC
const filterData = (data)=>{
return data.filter(item=>{
const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
return matchSearch;
});
};

return(

<div className="app">

<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<h1>🌱 AshokVatika Nursery Inventory</h1>

<button onClick={logout} style={{
background:"red",color:"white",border:"none",padding:"8px 15px"
}}>
Logout
</button>
</div>

{/* 🔥 SEARCH + FILTER UI */}
<div style={{display:"flex",gap:"10px",margin:"20px 0"}}>

<input
placeholder="Search plant/pot..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
style={{padding:"8px",width:"200px"}}
/>

<select
value={filterType}
onChange={(e)=>setFilterType(e.target.value)}
style={{padding:"8px"}}
>
<option value="all">All</option>
<option value="plant">Plants</option>
<option value="pot">Pots</option>
</select>

</div>

<AddItem addItem={addItem}/>

{/* PLANTS */}
{(filterType==="all" || filterType==="plant") && (
<>
<h2>Plants</h2>
<InventoryTable
data={filterData(plants)}
sellItem={sellItem}
editItem={editItem}
/>
</>
)}

{/* POTS */}
{(filterType==="all" || filterType==="pot") && (
<>
<h2>Pots</h2>
<InventoryTable
data={filterData(pots)}
sellItem={sellItem}
editItem={editItem}
/>
</>
)}

</div>

);

}

export default App;