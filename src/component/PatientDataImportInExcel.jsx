import React, { useState } from "react";
import { FaFileImport } from "react-icons/fa";
import axios from "axios";

const PatientDataImportInCSV = ({ handleAddPatient }) => {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setLoading(true);
    // Automatically upload the file when selected
    if (selectedFile) {
      handleFileUpload(selectedFile);
    }
  };

  // Handle file upload to backend
  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/patients/import-patients`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        alert("Patients imported successfully.");
        handleAddPatient(response.data.data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading the CSV file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xlg:flex hidden flex-col items-center">
      {/* File input, hidden but triggered on button click */}
      <input
        type="file"
        id="csv-upload"
        accept=".csv"
        onChange={handleFileChange} // Trigger upload on file selection
        className="hidden"
      />

      {/* Button to trigger file input */}
      <button
        className="h-[2.5rem] flex justify-center items-center bg-custom-green text-white text-lg font-semibold rounded px-3"
        title="Import"
        onClick={() => document.getElementById("csv-upload").click()} // Open file picker
      >
        <FaFileImport />
      </button>

      {loading && (
        <div className="fullscreen-loader">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default PatientDataImportInCSV;
