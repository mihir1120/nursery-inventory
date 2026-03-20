import React, { useState } from "react";

function AddItem({ addItem }) {

  const [type, setType] = useState("plant");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [delivered, setDelivered] = useState("");
  const [photo, setPhoto] = useState(null);

  // 🔥 NEW VENDOR STATES
  const [vendorName, setVendorName] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorAddress, setVendorAddress] = useState("");

  const submit = () => {

    if (!name || !date || !delivered || !vendorName) {
      alert("Please fill all required fields");
      return;
    }

    const item = {
      name,
      date,
      delivered,
      photo,
      vendor_name: vendorName,
      vendor_phone: vendorPhone,
      vendor_address: vendorAddress
    };

    addItem(item, type);

    // clear form
    setName("");
    setDate("");
    setDelivered("");
    setPhoto(null);
    setVendorName("");
    setVendorPhone("");
    setVendorAddress("");
    setType("plant");
  };

  return (
    <div className="form">

      {/* TYPE */}
      <select
        value={type}
        onChange={(e)=>setType(e.target.value)}
      >
        <option value="plant">Plant</option>
        <option value="pot">Pot</option>
        <option value="soil">Soil</option>
        <option value="fertilizer">Fertilizer</option>
      </select>

      {/* ITEM DETAILS */}
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

      {/* 🔥 VENDOR SECTION */}
      <input
        placeholder="Vendor Name"
        value={vendorName}
        onChange={(e) => setVendorName(e.target.value)}
      />

      <input
        placeholder="Vendor Phone"
        value={vendorPhone}
        onChange={(e) => setVendorPhone(e.target.value)}
      />

      <input
        placeholder="Vendor Address"
        value={vendorAddress}
        onChange={(e) => setVendorAddress(e.target.value)}
      />

      <button onClick={submit}>
        Add Item
      </button>

    </div>
  );
}

export default AddItem;