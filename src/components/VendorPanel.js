import React, { useState, useEffect } from "react";

function VendorPanel({ item, updateVendor }) {

  const [data, setData] = useState({});

  useEffect(()=>{
    setData(item);
  },[item]);

  if(!item) return null;

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value
    });
  };

  const save = () => {
    updateVendor(data);
  };

  return (

    <div>

      <h3>{item.name}</h3>

      <input
        placeholder="Vendor Name"
        value={data.vendor_name || ""}
        onChange={(e)=>handleChange("vendor_name",e.target.value)}
      />

      <input
        placeholder="Phone"
        value={data.vendor_phone || ""}
        onChange={(e)=>handleChange("vendor_phone",e.target.value)}
      />

      <input
        placeholder="Address"
        value={data.vendor_address || ""}
        onChange={(e)=>handleChange("vendor_address",e.target.value)}
      />

      <button
        onClick={save}
        style={{
          marginTop:"10px",
          background:"green",
          color:"white",
          padding:"8px",
          border:"none"
        }}
      >
        Save Vendor
      </button>

    </div>

  );
}

export default VendorPanel;