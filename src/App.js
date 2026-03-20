import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import Vendor from "./components/VendorPanel";
import "./App.css";

function App() {

const [plants,setPlants] = useState([]);
const [pots,setPots] = useState([]);
const [soils,setSoils] = useState([]);
const [fertilizers,setFertilizers] = useState([]);

const [loggedIn,setLoggedIn] = useState(false);

// 🔥 SEARCH + FILTER
const [search,setSearch] = useState("");
const [filterType,setFilterType] = useState("all");

// 🔥 VENDOR SIDEBAR
const [showVendor,setShowVendor] = useState(false);
const [selectedItem,setSelectedItem] = useState(null);

// LOAD ITEMS
const loadItems = async ()=>{
const res = await fetch("/items");
const data = await res.json();

setPlants(data.filter(i=>i.type==="plant"));
setPots(data.filter(i=>i.type==="pot"));
setSoils(data.filter(i=>i.type==="soil"));
setFertilizers(data.filter(i=>i.type==="fertilizer"));
};

useEffect(()=>{

const auth = localStorage.getItem("loggedIn");
if(auth) setLoggedIn(true);

loadItems();

// AUTO REFRESH
const interval = setInterval(loadItems,3000);
return ()=>clearInterval(interval);

},[]);

// =======================
// ADD ITEM (UPDATED)
// =======================
const addItem = async(item,type)=>{
const formData = new FormData();

formData.append("name",item.name);
formData.append("type",type);
formData.append("date",item.date);
formData.append("delivered",item.delivered);

// 🔥 VENDOR DATA
formData.append("vendor_name",item.vendor_name);
formData.append("vendor_phone",item.vendor_phone);
formData.append("vendor_address",item.vendor_address);

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

// 🔥 VENDOR UPDATE
formData.append("vendor_name",item.vendor_name);
formData.append("vendor_phone",item.vendor_phone);
formData.append("vendor_address",item.vendor_address);

if(item.photo instanceof File){
formData.append("photo",item.photo);
}

await fetch(`/edit/${item.id}`,{
method:"PUT",
body:formData
});

loadItems();
};

// 🔥 OPEN VENDOR (IMPORTANT)
const openVendor = (item)=>{
setSelectedItem(item);
setShowVendor(true);
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

// FILTER
const filterData = (data)=>{
return data.filter(item=>{
return item.name.toLowerCase().includes(search.toLowerCase());
});
};

return(

<div className="app">

{/* HEADER */}
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>

<h1>🌱 AshokVatika Nursery Inventory</h1>

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

{/* SEARCH */}
<div style={{display:"flex",gap:"10px",margin:"20px 0"}}>

<input
placeholder="Search..."
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
<option value="soil">Soil</option>
<option value="fertilizer">Fertilizer</option>
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
openVendor={openVendor}
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
openVendor={openVendor}
/>
</>
)}

{/* SOIL */}
{(filterType==="all" || filterType==="soil") && (
<>
<h2>Soil</h2>
<InventoryTable
data={filterData(soils)}
sellItem={sellItem}
editItem={editItem}
openVendor={openVendor}
/>
</>
)}

{/* FERTILIZER */}
{(filterType==="all" || filterType==="fertilizer") && (
<>
<h2>Fertilizer</h2>
<InventoryTable
data={filterData(fertilizers)}
sellItem={sellItem}
editItem={editItem}
openVendor={openVendor}
/>
</>
)}

{/* 🔥 VENDOR SIDEBAR */}
{showVendor && selectedItem && (
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
marginBottom:"15px"
}}
>
Close
</button>

<Vendor item={selectedItem}/>

</div>
)}

</div>

);

}

export default App;