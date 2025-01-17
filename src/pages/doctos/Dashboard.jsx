import React, { useContext, useEffect, useState } from "react";
import AdminDashboardTemplate from "../../template/AdminDashboardTemplate";
import PerformanceComponent from "../../component/PerformanceComponent";
import Topheader from "../../component/Topheader";
import GaugeChart from "../../component/GaugeChart";
import { BsEye, BsGraphUpArrow, BsPeople } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import ViewPatient from "../../component/ViewPatient";
import { GoPerson, GoPlusCircle } from "react-icons/go";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";
import EditPatientData from "../../component/EditPatientData";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import PatientDocumentAdd from "../../component/PatientDocumentAdd";

const Dashboard = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [showViewPatient, setShowViewPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const { user, favClinic } = useContext(AuthContext);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalPrescription, setTotalPrescription] = useState(0);
  const [todaysFollowUpdate, setTodaysFollowUpdate] = useState(0);
  const [loading, setLoading] = useState(false);
  const [patientDocument, setPatientDocument] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // months are zero-indexed
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [dateFilter, setDateFilter] = useState({
    startDate: getTodayDate(),
    endDate: getTodayDate(),
  });

  // Function to fetch patients data from the backend
  const fetchPatients = async (
    page = 1,
    searchTerm = "",
    startDate = dateFilter.startDate,
    endDate = dateFilter.endDate,
    doctorId = "",
    clinicId = ""
  ) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/patients/get`,
        {
          params: {
            page,
            limit: 20,
            search: searchTerm,
            startdate: startDate,
            enddate: endDate,
            doctorId: doctorId,
            clinicId: clinicId,
            appointmentdate: false,
          },
        }
      );
      setPatientsData(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalPatients(response.data.totalDocuments);
      setTotalPrescription(response.data.totalPrescriptions);
      setTodaysFollowUpdate(response.data.latestFollowupdateCount);

      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (user.role === "super_admin") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    } else if (user.role === "admin" && user.designation === "Staff") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        "",
        favClinic._id
      );
    } else {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    }
  }, [currentPage, search, dateFilter, favClinic]);

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    setCurrentPage(1); // Reset to the first page
  };

  const handleClearFilter = () => {
    setDateFilter({
      startDate: getTodayDate(),
      endDate: getTodayDate(),
    });
    setCurrentPage(1);
  };
  const updatePatientInList = (updatedPatient) => {
    setPatientsData((prevPatients) =>
      prevPatients.map((patient) =>
        patient.patientId === updatedPatient.patientId
          ? updatedPatient
          : patient
      )
    );
    setShowEditPatient(false);
    if (user.role === "super_admin") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    } else if (user.role === "admin" && user.designation === "Staff") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        "",
        favClinic._id
      );
    } else {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

    const paginationButtons = [];
    for (let i = startPage; i <= endPage; i++) {
      paginationButtons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 h-[2rem] flex justify-center items-center border ${
            i === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white text-[#555555]"
          } rounded-md mx-1`}
        >
          {i}
        </button>
      );
    }
    return paginationButtons;
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowViewPatient(true);
  };

  const handleClose = () => {
    setShowViewPatient(false);
    setSelectedPatient(null);
  };
  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setShowEditPatient(true);
  };

  const handleEditClose = () => {
    setShowEditPatient(false);
    setSelectedPatient(null);
  };

  // Toggle priority status
  const togglePriority = async (index) => {
    const updatedPatients = [...patientsData];
    const patient = updatedPatients[index];

    const newPriority = patient.priority === "High" ? "" : "High";
    updatedPatients[index] = { ...patient, priority: newPriority };
    setPatientsData(updatedPatients);

    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/patients/update/${
          patient.patientId
        }`,
        { priority: newPriority },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleAddNewClick = () => {
    setShowAddPatient(true);
  };

  const handleAddDocuments = (patient) => {
    setSelectedPatient(patient);
    setPatientDocument(true);
  };

  const handleAddDocumentsClose = () => {
    setSelectedPatient(null);
    setPatientDocument(false);
  };

  const updatePatientDocuments = (updatedPatient) => {
    setPatientsData((prevPatients) =>
      prevPatients.map((patient) =>
        patient.patientId === updatedPatient.patientId
          ? updatedPatient
          : patient
      )
    );
    setPatientDocument(false);
    if (user.role === "super_admin") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    } else if (user.role === "admin" && user.designation === "Staff") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        "",
        favClinic._id
      );
    } else {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    }
  };

  const handleAddPatient = (newPatient) => {
    setPatientsData((prevPatients) => [
      ...prevPatients,
      {
        ...newPatient,
        chooseDoctorDetails: {
          name: newPatient.chooseDoctorDetails?.name || "N/A",
          doctorDegree: newPatient.chooseDoctorDetails?.doctorDegree || "N/A",
        },
      },
    ]);
    if (user.role === "super_admin") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    } else if (user.role === "admin" && user.designation === "Staff") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        "",
        favClinic._id
      );
    } else {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        user.userId,
        favClinic._id
      );
    }
  };

  return (
    <AdminDashboardTemplate>
      <div className="">
        <Topheader
          isModalShow={showAddPatient}
          setIsModalShow={setShowAddPatient}
          modalToShow={"patientModal"}
          search={search} // Pass search state
          setSearch={setSearch}
          handleDateFilter={handleDateFilter}
          handleClearFilter={handleClearFilter}
          handleAddPatient={handleAddPatient}
        >
          <button
            onClick={handleAddNewClick}
            className="flex items-center bg-custom-orange hover:bg-blue-500 gap-3 rounded px-2 xlg:px-3  h-[2.5rem] text-xs xl:text-base xlg:text-sm text-[#F5F5F5] transition-colors duration-300 ease-in-out"
          >
            <GoPlusCircle />
            <h3>Add Patient</h3>
          </button>
        </Topheader>
      </div>
      <div className="xlg:px-8 px-4 py-4 flex flex-col gap-2">
        <div>
          <PerformanceComponent
            totalPatients={totalPatients}
            totalPrescription={totalPrescription}
            todaysFollowUpdate={todaysFollowUpdate}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 w-full lg:flex-row gap-4 justify-between overflow-x-hidden py-4  ">
          <div className="bg-white rounded boxsh flex items-center justify-center w-full ">
            <GaugeChart
              icon={<BsPeople className="size-5 text-custom-orange" />}
              text={"Monthly Patients"}
            />
          </div>
          <div className="bg-white rounded boxsh flex items-center justify-center w-full">
            <GaugeChart
              icon={<BsGraphUpArrow className="size-5 text-custom-orange" />}
              text={"Payments"}
            />
          </div>
          <div className="bg-white rounded boxsh flex items-center justify-center w-full">
            <GaugeChart
              icon={<BsGraphUpArrow className="size-5 text-custom-orange" />}
              text={"Payments"}
            />
          </div>
        </div>
        <div className=" bg-white rounded-lg flex flex-col gap-2">
          <h1 className="xlg:text-xl xxl:text-2xl text-base font-semibold">
            Recent Appointments
          </h1>
          <div className="flex flex-col gap-3">
            {loading ? (
              <div className="flex justify-center items-center h-[100px]">
                <div className="loader">
                  <div className="dot dot-1"></div>
                  <div className="dot dot-2"></div>
                  <div className="dot dot-3"></div>
                  <div className="dot dot-4"></div>
                  <div className="dot dot-5"></div>
                </div>
              </div>
            ) : (
              patientsData.map((item, index) => (
                <section
                  key={item.patientId}
                  className={`xlg:py-2 p-3 xlg:px-6 rounded-md border border-[#E7E7E7] ${
                    index % 2 === 0 ? "bg-[#F5F5F5]" : " bg-transparent "
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-row items-center gap-2">
                          <span className="xlg:text-sm xxl:text-xl text-xs text-[#888888] font-medium">
                            {item.patientId}.
                          </span>
                          <div className="flex flex-row items-center gap-1 text-[13px] xlg:text-sm xxl:text-xl font-medium text-[#555555]">
                            <GoPerson className="text-lg" />{" "}
                            <span>{item.patientName}</span> |
                            <span>{item.gender}</span> |{" "}
                            <span>{item.age} Y</span>
                          </div>
                        </div>
                        <div className="xlg:text-sm text-[13px] xxl:text-xl font-medium text-[#555555]">
                          +91 {item.mobileNumber}
                        </div>
                      </div>
                      <div className="flex flex-row gap-4">
                        <button
                          onClick={() => togglePriority(index)}
                          className={`priority-button ${
                            item.priority === "High"
                              ? "bg-blue-500 text-white"
                              : index % 2 === 0
                              ? "bg-white"
                              : "bg-[#EEEEEE]"
                          }`}
                        >
                          {item.priority || "Priority"}
                        </button>
                        <Link
                          to={`/patient/${item.patientId}/tccard`}
                          className={`priority-button ${
                            index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                          }`}
                        >
                          TC Card
                        </Link>
                        <div
                          className={`priority-button hover:text-[#00B252] text-[#00B252] ${
                            index % 2 === 0
                              ? "bg-white hover:bg-white"
                              : "bg-[#EEEEEE] hover:bg-[#EEEEEE]"
                          }`}
                        >
                          <MdCurrencyRupee />
                          <span>{item.paid || 0} Paid</span>
                        </div>
                        <div
                          className={`priority-button hover:text-[#E40000] text-[#E40000] ${
                            index % 2 === 0
                              ? "bg-white hover:bg-white"
                              : "bg-[#EEEEEE] hover:bg-[#eeeeee]"
                          }`}
                        >
                          Due {item.due || 0}
                        </div>
                        <Link
                          to={`/prescription/add/${item.patientId}`}
                          className={`priority-button ${
                            index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                          }`}
                        >
                          Start Visit
                        </Link>
                      </div>
                    </div>

                    <div className="flex flex-row justify-between items-center ">
                      <button
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        {item.chooseDoctorDetails
                          ? `${item.chooseDoctorDetails.name}, (${item.chooseDoctorDetails.doctorDegree})`
                          : ""}
                      </button>
                      <Link
                        to={`/patient/${item.patientId}/createinvoice`}
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Create Invoice
                      </Link>
                      <div
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Case History
                      </div>
                      <Link
                        to={`/patient/${item.patientId}/estimate`}
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Estimate
                      </Link>

                      <Link
                        to={`/patient/${item.patientId}/prescriptions`}
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Prescription
                      </Link>
                      <button
                        onClick={() => handleAddDocuments(item)}
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Documents
                      </button>

                      <button
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Forms
                      </button>
                      <div className="flex flex-row items-center gap-2 xlg:gap-4">
                        <button
                          onClick={() => handleViewPatient(item)}
                          className="xlg:text-2xl text-lg font-medium text-[#7F03FA]"
                        >
                          <BsEye />
                        </button>
                        <button
                          onClick={() => handleEditPatient(item)}
                          className="xlg:text-2xl text-lg font-medium text-[#00B252]"
                        >
                          <FaEdit />
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ))
            )}
            <div className="flex justify-center items-center mt-4">
              <button
                className="px-3 py-1 text-[#555555] mx-1"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {renderPagination()}
              <button
                className="px-3 py-1 text-[#555555] mx-1"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>

          {/* Modal for viewing patient details */}

          <div
            className={`fixed top-0 right-0 h-screen w-[60%] xl:w-[50%] overflow-scroll custom-scroll bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
              showViewPatient ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {showViewPatient && selectedPatient && (
              <div className="p-4">
                <ViewPatient
                  handleClose={handleClose}
                  patient={selectedPatient}
                />
              </div>
            )}
          </div>

          <div
            className={`fixed top-0 right-0 h-screen w-[60%] xl:w-[50%] overflow-scroll custom-scroll bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
              showEditPatient ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {showEditPatient && selectedPatient && (
              <div className="p-4">
                <EditPatientData
                  handleClose={handleEditClose}
                  patient={selectedPatient}
                  onUpdate={updatePatientInList}
                />
              </div>
            )}
          </div>

          <div
            className={`fixed top-0 right-0 h-screen w-[60%] xl:w-[50%] overflow-scroll custom-scroll bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
              patientDocument ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {patientDocument && selectedPatient && (
              <div className="p-4">
                <PatientDocumentAdd
                  handleClose={handleAddDocumentsClose}
                  patient={selectedPatient}
                  onUpdate={updatePatientDocuments}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminDashboardTemplate>
  );
};

export default Dashboard;
