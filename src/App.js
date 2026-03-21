import React, { useState, useEffect } from "react";
import Login from "./Login";
import AddItem from "./components/AddItem";
import InventoryTable from "./components/InventoryTable";
import "./App.css";

const BASE_URL = "https://nursery-inventory.onrender.com";

function App() {

const [plants,setPlants] = useState([]);
const [pots,setPots] = useState([]);
const [soils,setSoils] = useState([]);
const [fertilizers,setFertilizers] = useState([]);

const [loggedIn,setLoggedIn] = useState(false);

// SEARCH + FILTER
const [search,setSearch] = useState("");
const [filterType,setFilterType] = useState("all");

// VENDOR SIDEBAR
const [showVendor,setShowVendor] = useState(false);
const [selectedItem,setSelectedItem] = useState(null);

// LOAD ITEMS
const loadItems = async ()=>{
const res = await fetch(`${BASE_URL}/items`);
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

formData.append("vendor_name",item.vendor_name || "");
formData.append("vendor_phone",item.vendor_phone || "");
formData.append("vendor_address",item.vendor_address || "");

if(item.photo){
formData.append("photo",item.photo);
}

await fetch(`${BASE_URL}/add`,{
method:"POST",
body:formData
});

loadItems();
};

// SELL
const sellItem = async(id,quantity)=>{
await fetch(`${BASE_URL}/sell/${id}`,{
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

formData.append("vendor_name",item.vendor_name || "");
formData.append("vendor_phone",item.vendor_phone || "");
formData.append("vendor_address",item.vendor_address || "");

if(item.photo instanceof File){
formData.append("photo",item.photo);
}

await fetch(`${BASE_URL}/edit/${item.id}`,{
method:"PUT",
body:formData
});

loadItems();
};

// OPEN VENDOR
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

<AddItem addItem={addItem}/>

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
zIndex:1000
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

<p><b>Name:</b> {selectedItem.vendor_name || "Not added"}</p>
<p><b>Phone:</b> {selectedItem.vendor_phone || "Not added"}</p>
<p><b>Address:</b> {selectedItem.vendor_address || "Not added"}</p>

</div>
)}

</div>
);
}

export default App;