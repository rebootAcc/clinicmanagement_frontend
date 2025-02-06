import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TopHeaderMini from "../../component/TopHeaderMini";
import PatientMedicalHistory from "../../component/prescription/PatientMedicalHistory";
import ChiefComplain from "../../component/prescription/ChiefComplain";
import OnExamination from "../../component/prescription/OnExamination";
import Investigation from "../../component/prescription/Investigation";
import Radiography from "../../component/prescription/Radiography";
import Advices from "../../component/prescription/Advices";
import Medications from "../../component/prescription/Medications";
import axios from "axios";

const EditPrescription = () => {
  const { patientId, prescriptionId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Initialize state for each prescription field
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [chiefComplain, setChiefComplain] = useState([]);
  const [onExamination, setOnExamination] = useState([]);
  const [investigation, setInvestigation] = useState([]);
  const [radiography, setRadiography] = useState([]);
  const [advices, setAdvices] = useState([]);
  const [medications, setMedications] = useState([]);
  const [followUpdateDate, setFollowUpdateDate] = useState("");

  // Flags to track if changes were made
  const [medicalHistoryChanged, setMedicalHistoryChanged] = useState(false);
  const [prescriptionChanged, setPrescriptionChanged] = useState(false);

  // Fetch data on component mount or when patientId/prescriptionId changes
  useEffect(() => {
    const fetchPrescriptionData = async () => {
      if (!patientId) return;

      const url = `${
        import.meta.env.VITE_BASE_URL
      }/api/patients/get/${patientId}`;
      const finalUrl = prescriptionId
        ? `${url}?prescriptionId=${prescriptionId}`
        : url;

      try {
        const response = await axios.get(finalUrl);
        const prescription = response.data?.prescriptions?.find(
          (prescription) => prescription._id === prescriptionId
        );

        if (prescription) {
          // Update states with the fetched data
          setMedicalHistory(prescription.medicalHistory || []);
          setChiefComplain(prescription.chiefComplain || []);
          setOnExamination(prescription.onExamination || []);
          setInvestigation(prescription.investigation || []);
          setRadiography(prescription.radiography || []);
          setAdvices(prescription.advices || []);
          setMedications(prescription.medications || []);
        }
        if (prescription.followupdate) {
          setFollowUpdateDate(prescription.followupdate);
        }
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };

    fetchPrescriptionData();
  }, [patientId, prescriptionId]);

  const handleFollowUpDateChange = (e) => {
    setFollowUpdateDate(e.target.value);
    setPrescriptionChanged(true); // Set flag to true when follow-up date is changed
  };

  // Update flags on change
  const handleMedicalHistoryChange = (newMedicalHistory) => {
    setMedicalHistory(newMedicalHistory);
    setMedicalHistoryChanged(true); // Set flag to true when medical history is changed
  };

  const handlePrescriptionFieldChange = (setter) => (newData) => {
    setter(newData);
    setPrescriptionChanged(true); // Set flag to true when any prescription field is changed
  };

  // Save updated prescription
  const saveUpdatedPrescription = async () => {
    setLoading(true);

    const checkedMedicalHistory = Array.isArray(medicalHistory)
      ? medicalHistory.filter((item) => item.checked)
      : [];
    const uncheckedMedicalHistoryNames = Array.isArray(medicalHistory)
      ? medicalHistory
          .filter((item) => !item.checked)
          .map((item) => item.medicalHistoryName)
      : [];

    try {
      // Update medical history if there are changes
      if (medicalHistoryChanged) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/patients/update/${patientId}`,
          { checkedMedicalHistory, uncheckedMedicalHistoryNames },
          { headers: { "Content-Type": "application/json" } }
        );
      }

      // Prepare and update the prescription only if there are changes
      if (prescriptionChanged) {
        const updatedPrescription = {
          chiefComplain: chiefComplain.length ? chiefComplain : undefined,
          onExamination: onExamination.length ? onExamination : undefined,
          investigation: investigation.length ? investigation : undefined,
          radiography: radiography.length ? radiography : undefined,
          advices: advices.length ? advices : undefined,
          medications: medications.length ? medications : undefined,
          followupdate: followUpdateDate || undefined,
        };

        // Filter out undefined fields
        const cleanedPrescription = Object.fromEntries(
          Object.entries(updatedPrescription).filter(
            ([_, v]) => v !== undefined
          )
        );

        if (Object.keys(cleanedPrescription).length > 0) {
          await axios.put(
            `${
              import.meta.env.VITE_BASE_URL
            }/api/patients/update/prescriptions/${patientId}/${prescriptionId}`,
            cleanedPrescription,
            { headers: { "Content-Type": "application/json" } }
          );

          navigate(`/prescription/${patientId}/details/${prescriptionId}`);
        } else {
          alert("No prescription data to save.");
        }
      } else if (medicalHistoryChanged && !prescriptionChanged) {
        alert("Only medical history was updated.");
      }
    } catch (error) {
      console.error("Error saving prescription or medical history:", error);
      alert("Failed to save prescription or medical history");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopHeaderMini />
      <div className="p-6 xl:p-6 flex gap-6 bg-[#EDF4F7] w-full">
        <div className="py-2 px-8 xl:px-6 flex flex-col gap-6 w-full">
          <PatientMedicalHistory
            patientId={patientId}
            onMedicalHistoryChange={handleMedicalHistoryChange}
          />
          <ChiefComplain
            onChange={handlePrescriptionFieldChange(setChiefComplain)}
            existingComplaints={chiefComplain}
          />
          <OnExamination
            onChange={handlePrescriptionFieldChange(setOnExamination)}
            existingData={onExamination}
          />
          <Investigation
            onChange={handlePrescriptionFieldChange(setInvestigation)}
            existingData={investigation}
          />
          <Radiography
            onChange={handlePrescriptionFieldChange(setRadiography)}
            existingData={radiography}
          />
          <Advices
            onChange={handlePrescriptionFieldChange(setAdvices)}
            existingAdvices={advices}
          />
          <Medications
            onChange={handlePrescriptionFieldChange(setMedications)}
            existingMedications={medications}
          />
          <div className="flex flex-row gap-4 w-full items-center">
            Next Follow Up Date :
            <input
              type="date"
              value={followUpdateDate}
              onChange={handleFollowUpDateChange}
              className="bg-white outline-none text-lg xl:text-xl placeholder:text-[#d5d5d5] w-fit rounded h-[3rem] px-8"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-black/20 py-9 bg-[#EDF4F7] flex justify-end px-16">
        <button
          type="button"
          onClick={saveUpdatedPrescription}
          className="text-lg xl:text-xl font-semibold text-center text-white bg-custom-blue py-4 px-8 xl:px-10 rounded"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            <p className="text-white text-lg mt-4">Saving...</p>
          </div>
        </div>
      )}
    </>
  );
};

export default EditPrescription;
