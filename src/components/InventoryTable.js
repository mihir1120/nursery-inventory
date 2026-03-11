import React, { useState } from "react";

function InventoryTable({ data, sellItem, deleteItem }) {

const [sellQty,setSellQty] = useState({});

const handleChange = (id,value)=>{
setSellQty({
...sellQty,
[id]: value
});
};

return(

<table>

<thead>
<tr>
<th>Photo</th>
<th>Name</th>
<th>Date</th>
<th>Delivered</th>
<th>Sold</th>
<th>Stock</th>
<th>Sell Qty</th>
<th>Action</th>
</tr>
</thead>

<tbody>

{data.map(item=>(
<tr key={item.id}>

<td>
{item.photo && (
<img
src={`http://localhost:5000/uploads/${item.photo}`}
width="60"
alt={item.name}
/>
)}
</td>

<td>{item.name}</td>
<td>{item.date}</td>
<td>{item.delivered}</td>
<td>{item.sold}</td>
<td>{item.stock}</td>

<td>
<input
type="number"
placeholder="Qty"
style={{width:"70px"}}
onChange={(e)=>handleChange(item.id,e.target.value)}
/>
</td>

<td>

<button
onClick={()=>sellItem(item.id, Number(sellQty[item.id] || 1))}
style={{marginRight:"10px"}}
>
Sell
</button>

<button
onClick={()=>deleteItem(item.id)}
style={{background:"red",color:"white"}}
>
Delete
</button>

</td>

</tr>
))}

</tbody>

</table>

)

}

export default InventoryTable