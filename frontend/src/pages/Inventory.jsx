import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
    getInventories,
    createInventory,
    updateInventory,
    deleteInventory
} from "../services/inventoryService";

import "./Inventory.css";

function Inventory() {

    const [inventories, setInventories] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        waste_batch_id: "",
        fabric_type: "",
        source: "",
        quantity: "",
        color: "",
        condition: "",
        collection_date: ""
    });

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        loadInventories();
    }, []);

    const loadInventories = async () => {

        try {

            const response = await getInventories();

            setInventories(response.data);

        } catch (error) {

            console.log(error);

            alert("Failed to load inventory.");

        }

    };

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSaveInventory = async (e) => {

    e.preventDefault();

    try {

        if (editingId) {

            await updateInventory(
                editingId,
                formData
            );

            alert("Inventory Updated Successfully");

        } else {

            await createInventory(formData);

            alert("Inventory Added Successfully");

        }

        setShowModal(false);

        setEditingId(null);

        setFormData({
            waste_batch_id: "",
            fabric_type: "",
            source: "",
            quantity: "",
            color: "",
            condition: "",
            collection_date: ""
        });

        loadInventories();

    } catch (error) {

        if (error.response) {

            alert(error.response.data.detail);

        } else {

            alert("Operation Failed");

        }

    }

};
    const handleEdit = (inventory) => {

    setEditingId(inventory.id);

    setFormData({

        waste_batch_id: inventory.waste_batch_id,
        fabric_type: inventory.fabric_type,
        source: inventory.source,
        quantity: inventory.quantity,
        color: inventory.color,
        condition: inventory.condition,
        collection_date: inventory.collection_date

    });

    setShowModal(true);

};

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this inventory?"
        );

        if (!confirmDelete) return;

        try {

            await deleteInventory(id);

            alert("Inventory Deleted Successfully");

            loadInventories();

        } catch (error) {

            if (error.response) {

                alert(error.response.data.detail);

            } else {

                alert("Delete Failed");

            }

        }

    };

    return (

        <>
            <Navbar />

            <div className="inventory-container">

                <div className="inventory-card">

                    <div className="inventory-header">

                        <h2>Textile Inventory Management</h2>

                        {(user.role === "Administrator" ||
                            user.role === "manufacturer") && (

                                <button
                                    className="add-btn"
                                    onClick={() => setShowModal(true)}
                                >
                                    + Add Inventory
                                </button>

                            )}

                    </div>

                    <table className="inventory-table">

                        <thead>

                            <tr>

                                <th>Batch ID</th>
                                <th>Fabric</th>
                                <th>Source</th>
                                <th>Quantity</th>
                                <th>Color</th>
                                <th>Condition</th>
                                <th>Collection Date</th>
                                <th>Actions</th>

                            </tr>

                        </thead>

                        <tbody>

                            {inventories.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="no-data"
                                    >
                                        No Inventory Found
                                    </td>

                                </tr>

                            ) : (

                                inventories.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.waste_batch_id}</td>

                                        <td>{item.fabric_type}</td>

                                        <td>{item.source}</td>

                                        <td>{item.quantity}</td>

                                        <td>{item.color}</td>

                                        <td>{item.condition}</td>

                                        <td>{item.collection_date}</td>

                                        <td>

                                            {(user.role === "Administrator" ||
                                                user.role === "manufacturer" ||
                                                user.role === "recycling_operator") && (

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        Edit
                                                    </button>

                                                )}

                                            {user.role === "Administrator" && (

                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </button>

                                            )}

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {showModal && (

                <div className="modal-overlay">

                    <div className="modal-box">

                        <h2>

                            {editingId
                                ? "Update Textile Waste"
                                : "Add Textile Waste"}

                        </h2>

                        <form onSubmit={handleSaveInventory}>

                            <input
                                type="text"
                                name="waste_batch_id"
                                placeholder="Waste Batch ID"
                                value={formData.waste_batch_id}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="fabric_type"
                                placeholder="Fabric Type"
                                value={formData.fabric_type}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="source"
                                placeholder="Source"
                                value={formData.source}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="quantity"
                                placeholder="Quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="text"
                                name="color"
                                placeholder="Color"
                                value={formData.color}
                                onChange={handleChange}
                            />

                            <input
                                type="text"
                                name="condition"
                                placeholder="Condition"
                                value={formData.condition}
                                onChange={handleChange}
                            />

                            <input
                                type="date"
                                name="collection_date"
                                value={formData.collection_date}
                                onChange={handleChange}
                                required
                            />

                            <div className="modal-buttons">

                                <button type="submit">

                                        {editingId
                                            ? "Update"
                                            : "Save"}

                                    </button>

                                <button
                                    type="button"
                                    className="cancel-btn"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            <Footer />

        </>

    );

}

export default Inventory;