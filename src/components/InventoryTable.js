import React, { useState } from "react";

const API = "https://nursery-inventory.onrender.com";

function InventoryTable({ items, fetchItems, setSelectedItem, setRentalItem }) {

  const [sellQty, setSellQty] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [editImage, setEditImage] = useState(null);

  /* ---------- SELL ---------- */
  const sellItem = async (id) => {
    const qty = sellQty[id];
    if (!qty) return alert("Enter quantity");

    await fetch(`${API}/sell/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: Number(qty) }),
    });

    setSellQty({ ...sellQty, [id]: "" });
    fetchItems();
  };

  /* ---------- EDIT ---------- */
  const startEdit = (item) => {
    setEditingId(item.id);
    setEditData(item);
  };

  const saveEdit = async () => {
    const formData = new FormData();

    Object.keys(editData).forEach((key) => {
      formData.append(key, editData[key]);
    });

    if (editImage) {
      formData.append("image", editImage);
    }

    await fetch(`${API}/items/${editingId}`, {
      method: "PUT",
      body: formData,
    });

    setEditingId(null);
    setEditImage(null);
    fetchItems();
  };

  const categories = ["Plant", "Pots", "Soil", "Fertilizer"];

  return (
    <div>

      {categories.map((cat) => {
        const filtered = items.filter((item) => item.category === cat);

        return (
          <div key={cat} style={{ marginBottom: "30px" }}>
            <h3>{cat}</h3>

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

                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: "center" }}>
                      No items found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => {
                    const isEditing = editingId === item.id;

                    return (
                      <React.Fragment key={item.id}>

                        {/* MAIN ROW */}
                        <tr>

                          <td>
                            {isEditing ? (
                              <input
                                type="file"
                                onChange={(e) =>
                                  setEditImage(e.target.files[0])
                                }
                              />
                            ) : (
                              item.image && (
                                <img
                                  src={`${API}${item.image}`}
                                  width="50"
                                  alt=""
                                />
                              )
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                value={editData.name}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    name: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              item.name
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                type="date"
                                value={editData.date}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    date: e.target.value,
                                  })
                                }
                              />
                            ) : item.date ? (
                              new Date(item.date).toLocaleDateString("en-GB")
                            ) : (
                              "-"
                            )}
                          </td>

                          <td>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editData.delivered}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    delivered: e.target.value,
                                  })
                                }
                              />
                            ) : (
                              item.delivered
                            )}
                          </td>

                          <td>{item.sold}</td>
                          <td>{item.stock}</td>

                          <td>
                            <input
                              placeholder="Qty"
                              value={sellQty[item.id] || ""}
                              onChange={(e) =>
                                setSellQty({
                                  ...sellQty,
                                  [item.id]: e.target.value,
                                })
                              }
                            />
                          </td>

                          <td style={{ display: "flex", gap: "8px" }}>

                            <button onClick={() => sellItem(item.id)}>
                              Sell
                            </button>

                            {isEditing ? (
                              <>
                                <button onClick={saveEdit}>Save</button>
                                <button onClick={() => setEditingId(null)}>
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <button onClick={() => startEdit(item)}>
                                Edit
                              </button>
                            )}

                            <button onClick={() => setSelectedItem(item)}>
                              Vendor
                            </button>

                            {/* 🔥 RENTAL BUTTON ONLY FOR PLANTS */}
                            {item.category === "Plant" && (
                              <button
                                style={{ background: "#6c5ce7", color: "white" }}
                                onClick={() => setRentalItem(item)}
                              >
                                Rental
                              </button>
                            )}

                          </td>

                        </tr>

                        {/* 🔥 VENDOR EDIT BELOW ROW */}
                        {isEditing && (
                          <tr>
                            <td colSpan="8">
                              <div style={{
                                background: "#f5f7f9",
                                padding: "10px",
                                borderRadius: "8px",
                                display: "flex",
                                gap: "10px"
                              }}>
                                <input
                                  placeholder="Vendor Name"
                                  value={editData.vendor_name || ""}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      vendor_name: e.target.value,
                                    })
                                  }
                                />

                                <input
                                  placeholder="Phone"
                                  value={editData.vendor_phone || ""}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      vendor_phone: e.target.value,
                                    })
                                  }
                                />

                                <input
                                  placeholder="Address"
                                  value={editData.vendor_address || ""}
                                  onChange={(e) =>
                                    setEditData({
                                      ...editData,
                                      vendor_address: e.target.value,
                                    })
                                  }
                                />
                              </div>
                            </td>
                          </tr>
                        )}

                      </React.Fragment>
                    );
                  })
                )}

              </tbody>
            </table>
          </div>
        );
      })}

    </div>
  );
}

export default InventoryTable;