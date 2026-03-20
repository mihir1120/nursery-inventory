import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import Vendor from "./components/VendorPanel";
import "./App.css";

function App() {

const [plants,setPlants] = useState([]);
const [pots,setPots] = useState([]);
const [loggedIn,setLoggedIn] = useState(false);

// 🔥 SEARCH + FILTER
const [search,setSearch] = useState("");
const [filterType,setFilterType] = useState("all");

// 🔥 VENDOR SIDEBAR STATE
const [showVendor,setShowVendor] = useState(false);

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

// AUTO REFRESH
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

if(item.photo){
formData.append("photo",item.photo);
}

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

{/* HEADER */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

<h1>🌱 AshokVatika Nursery Inventory</h1>

<div>

{/* ✅ VENDOR BUTTON */}
<button
onClick={()=>setShowVendor(true)}
style={{
background:"#333",
color:"white",
border:"none",
padding:"8px 15px",
marginRight:"10px",
cursor:"pointer"
}}
>
Vendors
</button>

{/* LOGOUT */}
<button
onClick={logout}
style={{
background:"red",
color:"white",
border:"none",
padding:"8px 15px"
}}
>
Logout
</button>

</div>

</div>

{/* 🔥 SEARCH + FILTER */}
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

{/* ADD ITEM */}
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

{/* ===================== */}
{/* 🔥 VENDOR SIDEBAR */}
{/* ===================== */}
{showVendor && (
<div style={{
position:"fixed",
top:0,
left:0,
width:"320px",
height:"100%",
background:"#fff",
boxShadow:"2px 0 10px rgba(0,0,0,0.2)",
padding:"20px",
zIndex:1000,
overflowY:"auto"
}}>

<h2>Vendor Info</h2>

<button
onClick={()=>setShowVendor(false)}
style={{
background:"red",
color:"white",
border:"none",
padding:"5px 10px",
marginBottom:"15px",
cursor:"pointer"
}}
>
Close
</button>

{/* VENDOR COMPONENT */}
<Vendor/>

</div>
)}

</div>

);

}

export default App;