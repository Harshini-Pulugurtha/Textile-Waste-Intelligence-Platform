import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { analyzeTextileImage } from "../services/materialRecognitionService";

import "./MaterialRecognition.css";

function MaterialRecognition() {

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const handleImageChange = (e) => {

        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
    };
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {

            const file = e.dataTransfer.files?.[0];

            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const handleAnalyze = async () => {

        if (!image) {
            alert("Please choose an image.");
            return;
        }

        try {

            setLoading(true);

            const response = await analyzeTextileImage(image);

            console.log(response.data);

            setResult(response.data);

        } catch (error) {
            console.error(error);
            alert("Image analysis failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="material-container">
                <h1>🧠 AI Textile Waste Analysis</h1>
                <h1>Analyze textile images using deep learning</h1>

                <div
                    className={`upload-card ${dragActive ? "drag-active" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="preview-image"
                        />
                    ) : (
                        <>
                            <div className="upload-icon">📤</div>
                            <h3>Drag & Drop Image</h3>
                            <p>or click below to browse</p>
                        </>
                    )}

                    <input
                        id="imageUpload"
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                    />

                    <label htmlFor="imageUpload" className="upload-btn">
                        {preview ? "Choose Another Image" : "Choose Image"}
                    </label>

                    <button
                        className="analyze-btn"
                        onClick={handleAnalyze}
                        disabled={!image || loading}
                    >
                        {loading ? (
                            <>
                                <span className="loader"></span>
                                Analyzing...
                            </>
                        ) : (
                            "Analyze Image"
                        )}
                    </button>
                </div>

                <div className="right-panel">
                    {result && (
                        <div className="result-card">
                            <h2>🤖 AI Analysis Results</h2>

                            <div className="result-grid">
                        

                                <div>
                                    <strong>🎨 Predicted Color</strong>
                                    <p>{result.color}</p>
                                </div>

                                <div>
                                    <strong>🧵 Predicted Texture</strong>
                                    <p>{result.texture}</p>
                                </div>

                                <div>
                                    <strong>🎨 Predicted Pattern</strong>
                                    <p>{result.pattern}</p>
                                </div>

                                <div>
                                    <strong>🧵 Predicted Material</strong>
                                    <p>{result.material}</p>
                                </div>

                            
                                <div>
                                    <strong>🏆 Predicted Quality</strong>
                                    <p className={`status-badge ${result.quality
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}>
                                        {result.quality}
                                    </p>
                                </div>

                                <div>
                                    <strong>⭐ Predicted Condition</strong>
                                    <p className={`status-badge ${result.condition
                                                .toLowerCase()
                                                .replace(/\s+/g, "-")}`}>
                                            {result.condition}
                                        </p>
                                </div>

                                <div>
                                    <strong>⚠️ Predicted Damage</strong>
                                    <p className={`status-badge ${result.damage.toLowerCase().replace(/\s+/g, "-")}`}>
                                        {result.damage}
                                    </p>
                                </div>
                                <div>
                                    <strong>🎯 Predicted Damage Confidence</strong>
                                    <div className="confidence-bar">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: `${result.damage_confidence}%` }}
                                        ></div>
                                    </div>
                                    <p>{result.damage_confidence}%</p>
                                </div>

                                <div>
                                    <strong>🧹 Predicted Contamination</strong>
                                    <p className={`status-badge ${result.contamination
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")}`}>
                                        {result.contamination}
                                    </p>
                                </div>

                                <div>
                                    <strong>♻️ Predicted Waste Category</strong>
                                    <span className={`badge ${result.waste_category.toLowerCase().replace(/\s+/g, "-")}`}>
    {result.waste_category}
</span>
                                </div>

                                <div>
                                    <strong>🔄 Estimated Recyclability</strong>
                                    <p className={`status-badge ${result.recyclability.toLowerCase().replace(/\s+/g, "-")}`}>
                                        {result.recyclability}
                                    </p>
                                </div>

                                <div className="recommendation-card">
                                    <h3>💡 AI Recommendation</h3>

                                    <p>{result.recommendation}</p>

                                    <small>
                                        Generated from AI-based textile analysis, including material, condition, damage, contamination and waste classification.
                                    </small>
                                    
                                    
                                    <p className="prediction-note">
                                        AI-generated predictions for decision support only. Results may not represent confirmed material properties.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}
export default MaterialRecognition;