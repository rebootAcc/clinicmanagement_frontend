import React, { useState } from "react";
import { ImDownload } from "react-icons/im";
import { FaSpinner } from "react-icons/fa"; // Spinner icon for loading animation

const PatientDataExportInExcel = ({ clinicId }) => {
  const [clinicName, setClinicName] = useState("");
  const [loading, setLoading] = useState(false); // Track loading state

  const fetchClinicName = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/clinic/all?clinicId=${clinicId}`
      );
      const data = await response.json();

      const clinic = data.find((clinic) => clinic._id === clinicId);
      if (clinic) {
        setClinicName(clinic.clinic_name);
        return clinic.clinic_name;
      } else {
        console.error("Clinic not found");
      }
    } catch (error) {
      console.error("Error while fetching clinic name", error);
    }
    return null;
  };

  // Call the API to export the data
  const fetchPatientsForExport = async (clinicName) => {
    try {
      setLoading(true); // Show loading animation
      const queryParams = new URLSearchParams({
        clinicId: clinicId || "",
      });

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/patients/export?${queryParams}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const currentDate = new Date()
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");
        const fileName = `${currentDate}_${clinicName}_patientdata.csv`;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        link.download = fileName;
        link.click();
      } else {
        console.error("Failed to export patients");
      }
    } catch (error) {
      console.error("Error while exporting patient data", error);
    } finally {
      setLoading(false); // Hide loading animation after process finishes
    }
  };

  const handleExportClick = async () => {
    // Ensure clinicName is fetched before proceeding
    const clinicNameFetched = await fetchClinicName();
    if (clinicNameFetched) {
      fetchPatientsForExport(clinicNameFetched); // Pass clinicName to export function
    } else {
      console.error("Clinic name could not be fetched.");
    }
  };

  return (
    <div>
      <button
        className="h-[2.5rem] hidden xlg:flex justify-center items-center bg-custom-purple text-white text-lg font-semibold rounded px-3"
        onClick={handleExportClick}
        title="Export"
        disabled={loading}
      >
        {loading ? <FaSpinner className="button-spinner" /> : <ImDownload />}
      </button>
    </div>
  );
};

export default PatientDataExportInExcel;
