import React, { useState, useEffect, useRef } from "react";
import AdminDashboardTemplate from "../template/AdminDashboardTemplate";
import Topheader from "../component/Topheader";
import { MdCurrencyRupee } from "react-icons/md";
import { GoPlusCircle } from "react-icons/go";
import { FaCaretDown, FaTrash } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";

const Estimate = () => {
  const { patientId } = useParams();
  const [estimate, setEstimate] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [description, setDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const estimateRef = useRef();
  const [patientData, setPatientData] = useState(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [clinicData, setClinicData] = useState(null);

  const handleKeyDown = (e) => {
    if (searchResults.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && searchResults[activeIndex]) {
          const selected = searchResults[activeIndex];
          setSelectedItem(selected);
          setSearchTerm(`${selected.iteamName} - ${selected.iteamCharges}`);
          setSearchResults([]);
          setActiveIndex(-1); // Reset the active index after selection
        } else if (selectedItem) {
          handleAddItem();
        }
      }
    }
  };

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/patients/get/${patientId}`
        );
        setPatientData(response.data);
        const clinicResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/clinic/all`
        );

        const clinic = clinicResponse.data.find(
          (clinic) => clinic._id === response.data.clinicId
        );
        if (clinic) {
          setClinicData(clinic);
        } else {
          console.error("Clinic not found for the provided clinicId");
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };

    fetchPatientData();
  }, [patientId]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchTerm.trim() === "") {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/addpayment/getdropdown`,
          {
            params: { query: searchTerm },
          }
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm]);

  const handleAddItem = () => {
    if (selectedItem) {
      const itemExists = estimate.some(
        (item) => item.iteamName === selectedItem.iteamName
      );
      if (itemExists) {
        alert("Item already added.");
        return;
      }

      setEstimate((prevEstimate) => [
        ...prevEstimate,
        { ...selectedItem, description: description || "N/A" },
      ]);
      setSelectedItem("");
      setSearchTerm("");
      setDescription("");
    }
  };

  const handleDeleteItem = (index) => {
    setEstimate((prevEstimate) => prevEstimate.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    const patientName = "Prakesh Chandra";
    const today = new Date().toISOString().slice(0, 10);

    const element = estimateRef.current;

    element.classList.add("hide-action");

    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: `${patientName}-${today}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .save()
      .finally(() => {
        element.classList.remove("hide-action");
      });
  };

  const handlePreview = () => {
    const patientName = "Prakesh Chandra";
    const today = new Date().toISOString().slice(0, 10);

    const element = estimateRef.current;
    element.classList.add("hide-action");

    html2pdf()
      .from(element)
      .set({
        margin: 1,
        filename: `${patientName}-${today}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { orientation: "portrait" },
      })
      .output("bloburl")
      .then((pdfUrl) => {
        window.open(pdfUrl, "_blank");
      })
      .finally(() => {
        element.classList.remove("hide-action");
      });
  };

  return (
    <AdminDashboardTemplate>
      <div>
        <Topheader>
          <Link
            to="/payments/add-payment-charges"
            className="flex items-center bg-custom-orange hover:bg-custom-blue gap-3 rounded px-3 h-[2.5rem] text-xs xl:text-base xlg:text-sm text-[#F5F5F5] transition-colors duration-300 ease-in-out"
          >
            <GoPlusCircle />
            <h3>Create Invoice</h3>
          </Link>
        </Topheader>
      </div>
      <div className="flex flex-col gap-10 mt-6 px-4 xlg:px-8 ">
        <div
          className="p-4 xxl:p-8 border-2 border-[#E7E7E7] rounded-lg "
          ref={estimateRef}
        >
          <div className="flex flex-col">
            {/* Doctor and Patient Info */}
            <div className="flex justify-between py-3 border-b border-black/20">
              <div className="flex items-center gap-5 justify-center">
                <img
                  src="/icons/tooth-prescription.svg"
                  alt="dental prescribe"
                  width={71}
                  height={71}
                />
                <div className="flex flex-col gap-2">
                  <h1 className="xlg:text-base text-sm xxl:text-xl font-semibold text-custom-gray">
                    {patientData
                      ? `Dr. ${patientData.chooseDoctorDetails?.name}`
                      : "Doctor Unavailable"}
                  </h1>
                  <p className="xlg:text-base text-sm xxl:text-xl text-[#9C9C9C]">
                    {patientData
                      ? `${patientData.chooseDoctorDetails?.doctorDegree}`
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-5 justify-center">
                <div className="flex flex-col">
                  <h1 className="xlg:text-base text-sm xxl:text-xl font-semibold text-custom-gray text-right">
                    Dentity Dental
                  </h1>
                  <p className="xlg:text-base text-sm xxl:text-xl text-[#9C9C9C] text-right">
                    {clinicData?.clinic_name || "N/A"}
                  </p>
                </div>
                <img
                  src="/icons/hospital.svg"
                  alt="dental prescribe"
                  width={71}
                  height={71}
                  className="size-[3.8vmax]"
                />
              </div>
            </div>
            <div className="flex justify-between py-3 border-b border-black/20">
              <div className="flex flex-col gap-2">
                <h1 className="xlg:text-base text-sm xxl:text-xl font-semibold text-custom-gray">
                  {patientData?.patientName || "Patient Name"}
                </h1>
                <p className="xlg:text-base text-sm xxl:text-xl text-[#9C9C9C]">
                  {patientData?.gender}, {patientData?.age} Years | +91{" "}
                  {patientData?.mobileNumber}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="xlg:text-base text-sm xxl:text-xl font-semibold text-custom-gray text-right">
                  {new Date(patientData?.createdAt).toLocaleDateString(
                    "en-GB",
                    { weekday: "long" }
                  )}
                </h1>
                <p className="xlg:text-base text-sm xxl:text-xl font-semibold text-custom-gray text-right">
                  {new Date(patientData?.createdAt).toLocaleDateString("en-GB")}
                  <span> | </span>
                  {new Date(patientData?.createdAt).toLocaleTimeString(
                    "en-GB",
                    {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }
                  )}
                </p>
              </div>
            </div>

            {/* Estimate Table */}
            <div className="flex flex-col gap-4 py-4">
              <div className="border-b border-[#0000001A] flex flex-row pb-2 font-semibold text-sm xxl:text-lg text-[#333333]">
                <div className="flex-1">Name of Item</div>
                <div className="flex-1">Charges</div>
                <div className="flex-1">Description</div>
                <div className="flex-1 action-column">Action</div>
              </div>
              <div className="flex flex-col gap-2">
                {estimate.map((item, index) => (
                  <div
                    className="flex flex-row text-sm xxl:text-lg text-custom-gray"
                    key={index}
                  >
                    <div className="flex-1">
                      {index + 1}. {item.iteamName}
                    </div>
                    <div className="flex-1 flex items-center">
                      <MdCurrencyRupee />
                      {item.iteamCharges}
                    </div>
                    <div className="flex-1">{item.description}</div>
                    <div className="flex-1 action-column">
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="text-red-500 hover:text-red-700 ml-4 "
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Search and Add Item Section */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-row gap-8">
            <div className="relative w-[40%]">
              <input
                type="text"
                placeholder="Search Item"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="h-[4rem] px-4 bg-[#F5F5F5] w-full rounded-md outline-none"
              />
              {isSearching ? (
                <div className="absolute top-[4rem] bg-white w-full z-10">
                  <p className="p-4">...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="absolute top-[4rem] bg-white w-full z-10 shadow-lg rounded-md">
                  {searchResults.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedItem(item);
                        setSearchTerm(
                          `${item.iteamName} - ${item.iteamCharges}`
                        );
                        setSearchResults([]);
                      }}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        index === activeIndex ? "bg-gray-200" : ""
                      }`}
                    >
                      {item.iteamName} - {item.iteamCharges}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            <div className="w-[40%]">
              <input
                type="text"
                placeholder="If any type of description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-[4rem] px-4 bg-[#F5F5F5] w-full rounded-md outline-none"
              />
            </div>
          </div>
          <div className="w-full flex flex-row gap-6 ">
            <button
              onClick={handleAddItem}
              className="w-[15%] flex justify-center items-center h-[3rem] xxl:h-[4rem] rounded border-2 border-custom-blue text-custom-blue bg-white hover:bg-custom-blue xxl:text-lg hover:text-white font-medium"
            >
              Add Item
            </button>
            <button
              onClick={handlePreview}
              className="w-[15%] flex justify-center items-center h-[3rem] xxl:h-[4rem] rounded border-2 border-custom-blue text-custom-blue bg-white hover:bg-custom-blue xxl:text-lg hover:text-white font-medium"
            >
              Preview
            </button>
            <button
              onClick={handleDownload}
              className="w-[15%] flex justify-center items-center h-[3rem] xxl:h-[4rem] rounded border-2 border-custom-blue text-custom-blue bg-white hover:bg-custom-blue xxl:text-lg hover:text-white font-medium"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </AdminDashboardTemplate>
  );
};

export default Estimate;
