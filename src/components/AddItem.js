import React,{useState} from "react"

function AddItem({addItem}){

const [type,setType]=useState("plant")
const [name,setName]=useState("")
const [date,setDate]=useState("")
const [delivered,setDelivered]=useState("")
const [photo,setPhoto]=useState(null)

const submit=()=>{

const item={
name,
date,
delivered,
photo
}

addItem(item,type)

}

return(

<div className="form">

<select onChange={(e)=>setType(e.target.value)}>
<option value="plant">Plant</option>
<option value="pot">Pot</option>
</select>

<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
type="date"
onChange={(e)=>setDate(e.target.value)}
/>

<input
type="number"
placeholder="Delivered Quantity"
onChange={(e)=>setDelivered(e.target.value)}
/>

<input
type="file"
onChange={(e)=>setPhoto(e.target.files[0])}
/>

<button onClick={submit}>
Add Item
</button>

</div>

)

}

export default AddItem