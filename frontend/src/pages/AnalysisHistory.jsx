import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    getAnalysisHistory,
    deleteAnalysis,
} from "../services/historyService";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


import "./AnalysisHistory.css";


function AnalysisHistory() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {

        loadHistory();

    }, []);

    const loadHistory = async () => {

        try {

            const response = await getAnalysisHistory();

            setHistory(response.data);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }

    };
    const exportToExcel = () => {

    const worksheet = XLSX.utils.json_to_sheet(filteredHistory);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Analysis History");

    const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
    });
    

    const data = new Blob(
        [excelBuffer],
        {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
        }
    );

    saveAs(data, "Analysis_History.xlsx");
};
    const exportToPDF = () => {

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Textile Waste Analysis History", 14, 18);

    autoTable(doc, {
        startY: 28,
        head: [[
            "Material",
            "Color",
            "Texture",
            "Pattern",
            "Condition",
            "Damage",
            "Waste",
            "Recyclability"
        ]],

        body: filteredHistory.map(item => [
            item.material,
            item.color,
            item.texture,
            item.pattern,
            item.condition,
            item.damage,
            item.waste_category,
            item.recyclability
        ])
    });

    doc.save("Analysis_History.pdf");
};
    const handleDelete = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
    };
    const confirmDelete = async () => {

    try {

        await deleteAnalysis(selectedId);

        loadHistory();

        setShowDeleteModal(false);
        setSelectedId(null);

    } catch (error) {

        console.error(error);
        alert("Failed to delete analysis.");

    }

};


    const filteredHistory = history.filter((item) => {

    const matchesSearch =
        item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.texture.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
        categoryFilter === "All" ||
        item.waste_category === categoryFilter;

    return matchesSearch && matchesCategory;
});

    return (

        <>
            <Navbar />

            <div className="history-container">

                <div className="history-header">

                        <div>

                            <h1>📜 Analysis History</h1>

                            <p>
                                View, search, filter and export all AI textile analyses.
                            </p>

                        </div>

                        <div className="history-count">

                            {filteredHistory.length}

                            <span>Records</span>

                        </div>

                    </div>
                <div className="history-toolbar">

                        <input
                            type="text"
                            placeholder="🔍 Search material, color or texture..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        <select
                            className="filter-select"
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Reusable">Reusable</option>
                            <option value="Recyclable">Recyclable</option>
                            <option value="Disposal">Disposal</option>
                        </select>

                        <button
                            className="pdf-btn"
                            onClick={exportToPDF}
                        >
                            📄 PDF
                        </button>

                        <button
                            className="export-btn"
                            onClick={exportToExcel}
                        >
                            📊 Excel
                        </button>

                    </div>

                {loading ? (

                    <p className="loading">Loading...</p>

                ) : filteredHistory.length === 0 ? (

                    <p className="loading">No matching records found.</p>

                ) : (
                    
                    <div className="history-table">

                        <table>

                            <thead>

                                <tr>

                                    <th>Material</th>
                                    <th>Color</th>
                                    <th>Texture</th>
                                    <th>Pattern</th>
                                    <th>Condition</th>
                                    <th>Damage</th>
                                    <th>Waste</th>
                                    <th>Recyclability</th>
                                    <th>Actions</th>
                                    

                                </tr>
                                

                            </thead>

                            <tbody>

                                {filteredHistory.map((item) => (

                                    <tr key={item.id}>

                                        <td>{item.material}</td>
                                        <td>{item.color}</td>
                                        <td>{item.texture}</td>
                                        <td>{item.pattern}</td>
                                        <td>
                                            <span className={`badge ${item.condition.toLowerCase()}`}>
                                                {item.condition}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.damage.toLowerCase()}`}>
                                                {item.damage}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.waste_category.toLowerCase()}`}>
                                                {item.waste_category}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${item.recyclability
                                                                    .toLowerCase()
                                                                    .replace(/\s+/g, "-")}`}>
                                                {item.recyclability}
                                            </span>
                                        </td>
                                        <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        🗑 Delete
                                    </button>
                                </td>

                                    </tr>
                                    

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>
            {showDeleteModal && (
    <div className="modal-overlay">

        <div className="delete-modal">

            <h2>Delete Analysis</h2>

            <p>
                Are you sure you want to delete this analysis?
            </p>

            <div className="modal-buttons">

                <button
                    className="cancel-btn"
                    onClick={() => setShowDeleteModal(false)}
                >
                    Cancel
                </button>

                <button
                    className="confirm-delete-btn"
                    onClick={confirmDelete}
                >
                    Delete
                </button>

            </div>

        </div>

    </div>
)}

            <Footer />

        </>

    );

}

export default AnalysisHistory;