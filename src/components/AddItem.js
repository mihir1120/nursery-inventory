import React, { useState } from "react";

function AddItem({ addItem }) {

  const [type, setType] = useState("plant");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [delivered, setDelivered] = useState("");
  const [photo, setPhoto] = useState(null);

  const submit = () => {

    // validation
    if (!name || !date || !delivered) {
      alert("Please fill all fields");
      return;
    }

    const item = {
      name,
      date,
      delivered,
      photo
    };

    addItem(item, type);

    // clear form
    setName("");
    setDate("");
    setDelivered("");
    setPhoto(null);
  };

  return (
    <div className="form">

    <select onChange={(e)=>setType(e.target.value)}>

<option value="plant">Plant</option>
<option value="pot">Pot</option>
<option value="soil">Soil</option>
<option value="fertilizer">Fertilizer</option>

</select>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="number"
        placeholder="Delivered Quantity"
        value={delivered}
        onChange={(e) => setDelivered(e.target.value)}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
      />

      <button onClick={submit}>
        Add Item
      </button>

    </div>
  );
}

export default AddItem;