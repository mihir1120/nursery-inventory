import React, { useState } from "react";

function InventoryTable({ data, sellItem, editItem }) {

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

            <td>
              {editingId === item.id ? (
                <input type="file" onChange={(e) =>
                  handleEditChange("photo", e.target.files[0])
                } />
              ) : (
                item.photo && (
                  <img src={`/uploads/${item.photo}`} width="60" />
                )
              )}
            </td>

            <td>
              {editingId === item.id ? (
                <input
                  value={editData.name}
                  onChange={(e)=>handleEditChange("name",e.target.value)}
                />
              ) : item.name}
            </td>

            <td>
              {editingId === item.id ? (
                <input
                  type="date"
                  value={editData.date}
                  onChange={(e)=>handleEditChange("date",e.target.value)}
                />
              ) : item.date}
            </td>

            <td>
              {editingId === item.id ? (
                <input
                  type="number"
                  value={editData.delivered}
                  onChange={(e)=>handleEditChange("delivered",e.target.value)}
                />
              ) : item.delivered}
            </td>

            <td>{item.sold}</td>

            <td>
              {editingId === item.id ? (
                <input
                  type="number"
                  value={editData.stock}
                  onChange={(e)=>handleEditChange("stock",e.target.value)}
                />
              ) : item.stock}
            </td>

            <td>
              <input
                type="number"
                placeholder="Qty"
                style={{ width: "70px" }}
                onChange={(e)=>handleChange(item.id,e.target.value)}
              />
            </td>

            <td>

              {editingId === item.id ? (
                <button onClick={saveEdit} style={{background:"blue",color:"white"}}>
                  Save
                </button>
              ) : (
                <>
                  <button
                    onClick={()=>sellItem(item.id, Number(sellQty[item.id] || 1))}
                    style={{marginRight:"10px",background:"green",color:"white"}}
                  >
                    Sell
                  </button>

                  <button
                    onClick={()=>startEdit(item)}
                    style={{background:"orange",color:"white"}}
                  >
                    Edit
                  </button>
                </>
              )}

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  );

}

export default InventoryTable;