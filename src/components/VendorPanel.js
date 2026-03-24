import React from "react";

function VendorPanel({ item }) {
  if (!item) return null;

  return (
    <div className="vendor-info">

      <h3 className="vendor-title">{item.name}</h3>

      <div className="vendor-box">
        <p>
          <span>Name:</span>{" "}
          {item.vendor_name || "Not added"}
        </p>

        <p>
          <span>Phone:</span>{" "}
          {item.vendor_phone || "Not added"}
        </p>

        <p>
          <span>Address:</span>{" "}
          {item.vendor_address || "Not added"}
        </p>
      </div>

    </div>
  );
}

export default VendorPanel;