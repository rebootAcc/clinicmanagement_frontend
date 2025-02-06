import React, { useState } from "react";
import TopHeaderMini from "../../component/TopHeaderMini";

import { Link, useNavigate, useParams } from "react-router-dom";

import PatientMedicalHistory from "../../component/prescription/PatientMedicalHistory";

import Medications from "../../component/prescription/Medications";

import Advices from "../../component/prescription/Advices";
import ChiefComplain from "../../component/prescription/ChiefComplain";
import OnExamination from "../../component/prescription/OnExamination";
import Investigation from "../../component/prescription/Investigation";
import Radiography from "../../component/prescription/Radiography";
import axios from "axios";
import PreviewPrescription from "./PreviewPrescription";

const AddNewPrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [chiefComplainData, setChiefComplainData] = useState([]);
  const [onExaminationData, setOnExaminationData] = useState([]);
  const [investigationData, setInvestigationData] = useState([]);
  const [radiographyData, setRadiographyData] = useState([]);
  const [adviceData, setAdviceData] = useState([]);
  const [medicationData, setMedicationData] = useState([]);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [medicalHistoryChanged, setMedicalHistoryChanged] = useState(false);
  const [prescriptionChanged, setPrescriptionChanged] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [followupDate, setFollowupDate] = useState("");

  const handleMedicalHistoryChange = (updatedMedicalHistory) => {
    setMedicalHistory(updatedMedicalHistory);
    setMedicalHistoryChanged(true);
  };

  const handlePrescriptionDataChange = (dataUpdater, data) => {
    dataUpdater();

    // Check if any prescription data exists; set prescriptionChanged to true only if there is data
    const hasPrescriptionData =
      chiefComplainData.length > 0 ||
      onExaminationData.length > 0 ||
      investigationData.length > 0 ||
      radiographyData.length > 0 ||
      adviceData.length > 0 ||
      medicationData.length > 0;

    if (hasPrescriptionData) {
      setPrescriptionChanged(true);
    }
  };

  const finishPrescription = async () => {
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
      if (medicalHistoryChanged) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/api/patients/update/${patientId}`,
          { checkedMedicalHistory, uncheckedMedicalHistoryNames },
          { headers: { "Content-Type": "application/json" } }
        );
      }

      if (prescriptionChanged) {
        const prescription = {
          chiefComplain: chiefComplainData.length
            ? chiefComplainData
            : undefined,
          onExamination: onExaminationData.length
            ? onExaminationData
            : undefined,
          investigation: investigationData.length
            ? investigationData
            : undefined,
          radiography: radiographyData.length ? radiographyData : undefined,
          advices: adviceData.length ? adviceData : undefined,
          medications: medicationData.length ? medicationData : undefined,
          followupdate: followupDate || undefined,
        };

        const cleanedPrescription = Object.fromEntries(
          Object.entries(prescription).filter(([_, v]) => v !== undefined)
        );

        if (Object.keys(cleanedPrescription).length > 0) {
          const response = await axios.put(
            `${
              import.meta.env.VITE_BASE_URL
            }/api/patients/update/prescriptions/${patientId}`,
            { prescriptions: [cleanedPrescription], prescriptionPdf: null }
          );

          const savedPrescriptionId = response.data.prescriptionIds[0];
          navigate(`/prescription/${patientId}/details/${savedPrescriptionId}`);
        } else {
          alert("No prescription data to save.");
        }
      } else if (medicalHistoryChanged && !prescriptionChanged) {
        alert("Only medical history was updated.");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      alert("Failed to save prescription");
    } finally {
      setLoading(false);
    }
  };

  const previewPrescription = () => {
    console.log("Chief Complain Data:", chiefComplainData);
    const cleanedChiefComplainData = chiefComplainData.map((item) => ({
      chiefComplainName: item.chiefComplainName,
      dentalChart: item.dentalChart,
    }));

    const cleanedOnExaminationData = onExaminationData.map((item) => ({
      onExaminationName: item.onExaminationName,
      onExaminationArea: item.onExaminationArea,
      onExaminationAdditionalNotes: item.onExaminationAdditionalNotes,

      dentalChart: item.dentalChart,
    }));
    console.log("On Examination Data:", cleanedOnExaminationData);

    const checkedMedicalHistory = Array.isArray(medicalHistory)
      ? medicalHistory.filter((item) => item.checked)
      : [];
    console.log(medicalHistory);

    const prescription = {
      chiefComplain: cleanedChiefComplainData,
      onExamination: onExaminationData,
      investigation: investigationData,
      radiography: radiographyData,
      advices: adviceData,
      medications: medicationData,
      medicalHistory: checkedMedicalHistory,
    };

    console.log("Prescription Data to Preview:", prescription); // Log the data before setting it
    setPreviewData(prescription);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewData(null);
  };

  return (
    <>
      <TopHeaderMini />
      <div className="p-2 xl:p-6 flex gap-6 bg-[#EDF4F7] w-full">
        <div className="py-2 px-3 xl:px-6 flex flex-col gap-6 w-full">
          <PatientMedicalHistory
            patientId={patientId}
            onMedicalHistoryChange={handleMedicalHistoryChange}
          />
          <ChiefComplain
            onChange={(data) =>
              handlePrescriptionDataChange(() => setChiefComplainData(data))
            }
          />
          <OnExamination
            onChange={(data) =>
              handlePrescriptionDataChange(() => setOnExaminationData(data))
            }
          />
          <Investigation
            onChange={(data) =>
              handlePrescriptionDataChange(() => setInvestigationData(data))
            }
          />
          <Radiography
            onChange={(data) =>
              handlePrescriptionDataChange(() => setRadiographyData(data))
            }
          />
          <Advices
            onChange={(data) =>
              handlePrescriptionDataChange(() => setAdviceData(data))
            }
          />
          <Medications
            onChange={(data) =>
              handlePrescriptionDataChange(() => setMedicationData(data))
            }
          />
          <div className="flex flex-row gap-4 w-full items-center">
            Next Follow Up Date :{" "}
            <input
              type="date"
              value={followupDate} // Set the value from state
              onChange={(e) => setFollowupDate(e.target.value)} // Update state when the user selects a date
              className="bg-white outline-none text-lg xl:text-xl placeholder:text-[#d5d5d5] w-fit rounded h-[3rem] px-8"
            />
          </div>
        </div>
      </div>
      <div className="border-t border-black/20 py-9 bg-[#EDF4F7] flex justify-between">
        <div className="pl-16 xlg:pl-20">
          <button
            type="button"
            className="text-lg xl:text-xl font-semibold text-center text-white bg-custom-blue py-4 px-8 xl:px-10 rounded"
          >
            Clear
          </button>
        </div>
        <div className="pr-16 xlg:pr-20 flex gap-9">
          <button
            onClick={previewPrescription}
            type="button"
            className="text-lg xl:text-xl font-semibold text-center text-white bg-custom-blue py-4 px-8 xl:px-10 rounded"
          >
            Preview
          </button>

          <button
            type="button"
            onClick={finishPrescription}
            className="text-lg xl:text-xl font-semibold text-center text-white bg-custom-blue py-4 px-8 xl:px-10 rounded"
          >
            Finish Prescription
          </button>
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <div className="loader animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
            <p className="text-white text-lg mt-4">Saving...</p>
          </div>
        </div>
      )}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center  overflow-auto no-scrollbar justify-center z-50">
          <div className=" p-6 rounded-md w-[80%] max-w-4xl h-[80%]">
            <button
              onClick={closePreviewModal}
              className="absolute top-4 right-4 text-xl font-bold text-black"
            >
              X
            </button>
            <PreviewPrescription
              previewData={previewData}
              prescriptiondate="2024-11-13"
              prescriptiontime="10:00 AM"
            />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={closePreviewModal}
                className="text-lg xl:text-xl font-semibold text-center text-white bg-gray-500 py-2 px-6 rounded"
              >
                {" "}
                Close{" "}
              </button>{" "}
              <button
                onClick={finishPrescription}
                className="text-lg xl:text-xl font-semibold text-center text-white bg-custom-blue py-2 px-6 rounded"
              >
                {" "}
                Save{" "}
              </button>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      )}
    </>
  );
};

export default AddNewPrescription;
