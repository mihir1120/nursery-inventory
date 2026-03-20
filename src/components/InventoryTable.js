import React, { useState } from "react";

function InventoryTable({ data, sellItem, editItem, openVendor }) {

  const [sellQty, setSellQty] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleChange = (id, value) => {
    setSellQty({
      ...sellQty,
      [id]: value
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const handleEditChange = (field, value) => {
    setEditData({
      ...editData,
      [field]: value
    });
  };

  const saveEdit = () => {
    editItem(editData);
    setEditingId(null);
  };

  return (
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

        {data.map((item) => (

          <tr key={item.id}>

            {/* PHOTO */}
            <td>
              {editingId === item.id ? (
                <input
                  type="file"
                  onChange={(e)=>handleEditChange("photo", e.target.files[0])}
                />
              ) : (
                item.photo ? (
                  <img
                    src={`/uploads/${item.photo}`}
                    width="60"
                    alt={item.name}
                  />
                ) : "No Image"
              )}
            </td>

            {/* NAME */}
            <td>
              {editingId === item.id ? (
                <input
                  value={editData.name || ""}
                  onChange={(e)=>handleEditChange("name", e.target.value)}
                />
              ) : item.name}
            </td>

            {/* DATE */}
            <td>
              {editingId === item.id ? (
                <input
                  type="date"
                  value={editData.date || ""}
                  onChange={(e)=>handleEditChange("date", e.target.value)}
                />
              ) : item.date}
            </td>

            {/* DELIVERED */}
            <td>
              {editingId === item.id ? (
                <input
                  type="number"
                  value={editData.delivered || ""}
                  onChange={(e)=>handleEditChange("delivered", e.target.value)}
                />
              ) : item.delivered}
            </td>

            {/* SOLD */}
            <td>{item.sold}</td>

            {/* STOCK */}
            <td>
              {editingId === item.id ? (
                <input
                  type="number"
                  value={editData.stock || ""}
                  onChange={(e)=>handleEditChange("stock", e.target.value)}
                />
              ) : item.stock}
            </td>

            {/* SELL */}
            <td>
              <input
                type="number"
                placeholder="Qty"
                style={{ width: "70px" }}
                onChange={(e)=>handleChange(item.id, e.target.value)}
              />
            </td>

            {/* ACTION */}
            <td>

              {editingId === item.id ? (
                <div style={{display:"flex",flexDirection:"column",gap:"5px"}}>

                  {/* 🔥 VENDOR EDIT */}
                  <input
                    placeholder="Vendor Name"
                    value={editData.vendor_name || ""}
                    onChange={(e)=>handleEditChange("vendor_name", e.target.value)}
                  />

                  <input
                    placeholder="Phone"
                    value={editData.vendor_phone || ""}
                    onChange={(e)=>handleEditChange("vendor_phone", e.target.value)}
                  />

                  <input
                    placeholder="Address"
                    value={editData.vendor_address || ""}
                    onChange={(e)=>handleEditChange("vendor_address", e.target.value)}
                  />

                  <button
                    onClick={saveEdit}
                    style={{background:"blue",color:"white"}}
                  >
                    Save
                  </button>

                </div>
              ) : (
                <div style={{display:"flex",gap:"5px"}}>

                  <button
                    onClick={()=>sellItem(item.id, Number(sellQty[item.id] || 1))}
                    style={{background:"green",color:"white"}}
                  >
                    Sell
                  </button>

                  <button
                    onClick={()=>startEdit(item)}
                    style={{background:"orange",color:"white"}}
                  >
                    Edit
                  </button>

                  <button
                    onClick={()=>openVendor(item)}
                    style={{background:"#333",color:"white"}}
                  >
                    Vendor
                  </button>

                </div>
              )}

            </td>

          </tr>

        ))}

      </tbody>

    </table>
  );
}

export default InventoryTable;