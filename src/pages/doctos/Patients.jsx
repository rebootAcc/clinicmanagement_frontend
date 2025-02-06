import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AdminDashboardTemplate from "../../template/AdminDashboardTemplate";
import { GoPerson, GoPlusCircle } from "react-icons/go";
import { MdCurrencyRupee } from "react-icons/md";
import { BsEye } from "react-icons/bs";
import { FaCaretDown, FaEdit } from "react-icons/fa";
import Topheader from "../../component/Topheader";
import { Link } from "react-router-dom";
import ViewPatient from "../../component/ViewPatient";
import EditPatientData from "../../component/EditPatientData";
import PatientDocumentAdd from "../../component/PatientDocumentAdd";
import { AuthContext } from "../../context/AuthContext";

const Patients = () => {
  const [patientsData, setPatientsData] = useState([]);
  const [showViewPatient, setShowViewPatient] = useState(false);
  const [showEditPatient, setShowEditPatient] = useState(false);
  const [patientDocument, setPatientDocument] = useState(false);

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const { user, favClinic } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  // Function to fetch patients data from the backend
  const fetchPatients = async (
    page = 1,
    searchTerm = "",
    startDate = "",
    endDate = "",
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
          },
        }
      );
      setPatientsData(response.data.data);
      setTotalPages(response.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false); // End loading
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
        doctorFilter,
        favClinic._id
      );
    } else if (user.role === "admin" && user.designation === "Staff") {
      fetchPatients(
        currentPage,
        search,
        dateFilter.startDate,
        dateFilter.endDate,
        doctorFilter,
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
  }, [currentPage, search, dateFilter, user, favClinic, doctorFilter]);

  useEffect(() => {
    getDoctorsOfCurrentClinic();
  }, []);

  const handleDateFilter = (startDate, endDate) => {
    setDateFilter({ startDate, endDate });
    setCurrentPage(1);
  };

  const handleClearFilter = () => {
    setDateFilter({ startDate: "", endDate: "" });
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
        "",
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

  const handleAddDocuments = (patient) => {
    setSelectedPatient(patient);
    setPatientDocument(true);
  };

  const handleAddDocumentsClose = () => {
    setSelectedPatient(null);
    setPatientDocument(false);
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

  // Add new patient
  const handleAddNewClick = () => {
    setShowAddPatient(true);
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

  async function getDoctorsOfCurrentClinic() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/user/users?designation=Doctor`
      );
      const result = await response.data;

      setDoctors(result);
    } catch (error) {
      console.error("Error fetching Doctor", error);
    }
  }

  return (
    <AdminDashboardTemplate>
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
        {!(user.role === "admin" && user.designation === "Doctor") && (
          <div className="flex items-center bg-[#F5F5F5] gap-3 rounded  relative xl:text-base text-[10px] xlg:text-sm text-custom-gray">
            <select
              value={doctorFilter}
              onChange={(e) => setDoctorFilter(e.target.value)}
              className="block appearance-none cursor-pointer truncate px-2 xlg:px-6 h-[2.5rem] pe-2 bg-[#F5F5F5] focus:outline-none"
            >
              <option value="">Choose Doctor</option>
              {doctors?.length > 0 &&
                doctors.map((doctor) => (
                  <option value={doctor.userId} key={doctor._id}>
                    {doctor.name}
                  </option>
                ))}
            </select>
            <FaCaretDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600" />
          </div>
        )}
        <button
          onClick={handleAddNewClick}
          className="flex items-center bg-custom-orange hover:bg-custom-blue gap-3 rounded px-2 xlg:px-3 h-[2.5rem] text-xs xl:text-base xlg:text-sm text-[#F5F5F5] transition-colors duration-300 ease-in-out"
        >
          <GoPlusCircle className="xlg:text-xl text-lg" />
          <h3 className="lg:flex hidden">Add Patient</h3>
        </button>
      </Topheader>

      <div className="xl:p-8 p-3 flex flex-col gap-8">
        {loading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="loader">
              <div className="dot dot-1"></div>
              <div className="dot dot-2"></div>
              <div className="dot dot-3"></div>
              <div className="dot dot-4"></div>
              <div className="dot dot-5"></div>
            </div>
          </div>
        ) : (
          patientsData.map((item, index) => {
            const latestCard =
              item.patientTcCard[item.patientTcCard.length - 1];
            const totalPayment = latestCard?.totalPayment || 0;
            const totalDue = latestCard?.totalDue || 0;
            return (
              <section
                key={item.patientId}
                className={`xlg:p-4 p-3 rounded-md border border-[#E7E7E7] ${
                  index % 2 === 0 ? "bg-[#F5F5F5]" : " bg-transparent "
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row items-center gap-2">
                        <span className="xlg:text-sm xxl:text-xl text-sm text-[#888888] font-medium">
                          {item.patientId}.
                        </span>
                        <div className="flex flex-row items-center gap-1 text-[13px] xlg:text-sm xxl:text-xl font-medium text-[#555555]">
                          <GoPerson className="text-lg" />{" "}
                          <span>{item.patientName}</span> |
                          <span>{item.gender}</span> | <span>{item.age} Y</span>
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
                        <span>
                          {totalPayment}
                          Paid
                        </span>
                      </div>
                      <div
                        className={`priority-button hover:text-[#E40000] text-[#E40000] ${
                          index % 2 === 0
                            ? "bg-white hover:bg-white"
                            : "bg-[#EEEEEE] hover:bg-[#eeeeee]"
                        }`}
                      >
                        Due {totalDue}
                      </div>
                      <Link
                        to={
                          user.designation !== "Staff"
                            ? `/prescription/add/${item.patientId}`
                            : "#"
                        }
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                        } ${
                          user.designation === "Staff"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }`}
                        onClick={(e) => {
                          if (user.designation === "Staff") {
                            e.preventDefault();
                          }
                        }}
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
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-white" : "bg-[#EEEEEE]"
                      }`}
                      onClick={() => handleAddDocuments(item)}
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
            );
          })
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
            <ViewPatient handleClose={handleClose} patient={selectedPatient} />
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
    </AdminDashboardTemplate>
  );
};

export default Patients;
