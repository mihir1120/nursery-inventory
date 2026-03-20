import React, { useState, useEffect } from "react";

function VendorPanel(){

const [vendors,setVendors] = useState([]);
const [name,setName] = useState("");
const [phone,setPhone] = useState("");
const [editingId,setEditingId] = useState(null);

const loadVendors = async ()=>{
const res = await fetch("/vendors");
const data = await res.json();
setVendors(data);
};

useEffect(()=>{
loadVendors();
},[]);

// ADD / UPDATE
const saveVendor = async ()=>{

if(editingId){

await fetch(`/vendors/${editingId}`,{
method:"PUT",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,phone})
});

}else{

await fetch("/vendors",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,phone})
});

}

setName("");
setPhone("");
setEditingId(null);

loadVendors();
};

// EDIT CLICK
const editVendor = (v)=>{
setName(v.name);
setPhone(v.phone);
setEditingId(v.id);
};

return(

<div>

<input
placeholder="Vendor Name"
value={name}
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Phone"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<button onClick={saveVendor}>
{editingId ? "Update" : "Add"}
</button>

<hr/>

{vendors.map(v=>(
<div key={v.id} style={{marginBottom:"10px"}}>

<b>{v.name}</b><br/>
{v.phone}<br/>

<button onClick={()=>editVendor(v)}>
Edit
</button>

</div>
))}

</div>

);

}

export default VendorPanel;