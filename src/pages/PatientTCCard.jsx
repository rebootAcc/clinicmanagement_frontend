import React, { useEffect, useRef, useState } from "react";
import AdminDashboardTemplate from "../template/AdminDashboardTemplate";
import Topheader from "../component/Topheader";
import { GoPlusCircle } from "react-icons/go";
import AddNewTC from "../component/AddNewTC";
import { useParams } from "react-router-dom"; // Import to get the patientId from URL params
import axios from "axios"; // Make sure axios is installed
import { IoPrintSharp } from "react-icons/io5";
import { LiaDownloadSolid } from "react-icons/lia";
import { FaEdit } from "react-icons/fa";
import EditTcCard from "../component/EditTcCard";
import { MdDelete } from "react-icons/md";

const PatientTCCard = () => {
  const [isTcModalShow, setIsTCModalShow] = useState(false);
  const [patientData, setPatientData] = useState(null);
  const modalRef = useRef(null);
  const { patientId } = useParams();
  const [selectedTcCard, setSelectedTcCard] = useState(null);
  const [mode, setMode] = useState("add");
  const [isDeletePopupVisible, setIsDeletePopupVisible] = useState(false);

  const fetchTCCards = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/patients/get/${patientId}`
      );
      setPatientData(response.data); // Store patient data
    } catch (error) {
      console.error("Error fetching patient data:", error);
    }
  };

  useEffect(() => {
    fetchTCCards();
  }, [patientId]);
  const handleAddNewClick = () => {
    setSelectedTcCard(null); // Reset for new TC card
    setMode("add");
    setIsTCModalShow(true);
  };

  // Open the modal to edit an existing TC card
  const handleEditClick = (tcCard) => {
    setSelectedTcCard(tcCard); // Set the selected TC card data for editing
    setMode("edit");
    setIsTCModalShow(true);
  };

  const handleClose = () => {
    setIsTCModalShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsTCModalShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTcModalShow]);

  const handlePrint = (pdfUrl) => {
    const printWindow = window.open(pdfUrl, "_blank");
    printWindow.onload = function () {
      printWindow.print();
    };
  };

  // Function to handle the downloading of the PDF
  const handleDownload = (pdfUrl) => {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = pdfUrl.split("/").pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = (tcCardId) => {
    setSelectedTcCard(tcCardId); // Set the selected TC card for deletion
    setIsDeletePopupVisible(true); // Show the delete confirmation popup
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patients/delete/tccard/${patientId}/${selectedTcCard}`
      );
      fetchTCCards(); // Refresh the TC cards list after deletion
      setIsDeletePopupVisible(false); // Close the delete confirmation popup
    } catch (error) {
      console.error("Error deleting TC Card:", error);
      setIsDeletePopupVisible(false); // Close the popup in case of an error
    }
  };

  // Function to cancel deletion and close the popup
  const handleCancelDelete = () => {
    setIsDeletePopupVisible(false); // Close the delete confirmation popup
  };

  return (
    <AdminDashboardTemplate>
      <Topheader />
      <div className="flex flex-col gap-6 pt-8">
        <button
          onClick={handleAddNewClick}
          className="flex w-fit items-center bg-custom-blue hover:bg-sky-600 gap-3 rounded px-2 xlg:px-3 h-[2.5rem] text-xs xl:text-base xlg:text-sm text-[#F5F5F5] transition-colors duration-300 ease-in-out"
        >
          <GoPlusCircle />
          <h3>Add New TC</h3>
        </button>
      </div>

      {/* Display Patient TC Cards */}
      <div className="mt-8">
        {patientData &&
        patientData.patientTcCard &&
        patientData.patientTcCard.length > 0 ? (
          <div>
            <h3 className="text-xl font-bold">Patient TC Cards</h3>
            <div className=" grid grid-cols-1 lg:grid-cols-2 xlg:grid-cols-3 gap-6">
              {patientData.patientTcCard.map((tcCard, index) => {
                if (tcCard.tccardPdf && tcCard.tccardPdf.secure_url) {
                  return (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="relative p-2 h-full flex flex-col items-center justify-center bg-white boxsh rounded">
                        <iframe
                          src={tcCard.tccardPdf.secure_url}
                          title={`TC Card ${index + 1}`}
                          className="!w-full !h-[15rem] no-scrollbar"
                        ></iframe>
                      </div>
                      <div className="flex flex-row gap-2">
                        <button
                          onClick={() =>
                            handlePrint(tcCard.tccardPdf.secure_url)
                          }
                          className="flex flex-row gap-1 rounded items-center h-[2rem] justify-center px-2 bg-custom-blue text-white text-sm"
                        >
                          <IoPrintSharp />
                          Print
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(tcCard.tccardPdf.secure_url)
                          }
                          className="flex flex-row gap-1 rounded items-center h-[2rem] justify-center px-2 bg-custom-blue text-white text-sm"
                        >
                          <LiaDownloadSolid />
                          Download
                        </button>
                        <button
                          onClick={() => handleEditClick(tcCard.tcCardId)}
                          className="flex flex-row gap-1 rounded items-center h-[2rem] justify-center px-2 bg-custom-blue text-white text-sm"
                        >
                          <FaEdit />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tcCard.tcCardId)}
                          className="flex flex-row gap-1 rounded items-center h-[2rem] justify-center px-2 bg-custom-blue text-white text-sm"
                        >
                          <MdDelete />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ) : (
          <p>No TC Cards available.</p>
        )}
      </div>

      <div
        ref={modalRef}
        className={`fixed top-0 right-0 h-screen w-[70%] xl:w-[60%] overflow-scroll z-[100] custom-scroll bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isTcModalShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {mode === "add" ? (
          <AddNewTC handleClose={handleClose} fetchTCCards={fetchTCCards} />
        ) : (
          <EditTcCard
            handleClose={handleClose}
            tcCardId={selectedTcCard}
            fetchTCCards={fetchTCCards}
          />
        )}
      </div>

      {isDeletePopupVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg py-16 flex flex-col gap-8">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to delete this TC Card?
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminDashboardTemplate>
  );
};

export default PatientTCCard;
