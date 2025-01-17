import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { FaCaretDown } from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AddNewPatient from "./AddNewPatient";
import { IoIosLogOut } from "react-icons/io";
import AddForm from "./AddForm";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { format } from "date-fns";
import { AuthContext } from "../context/AuthContext";
import { MdAdd } from "react-icons/md";
import AddNewClinic from "./AddNewClinic";
import PatientDataImportInExcel from "./PatientDataImportInExcel";
import PatientDataExportInExcel from "./PatientDataExportInExcel";

const Topheader = ({
  children,
  isModalShow = false,
  setIsModalShow = null,
  modalToShow,
  search,
  setSearch,
  handleDateFilter,
  handleClearFilter,
  handleAddPatient,
  fetchData,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [addClinicShow, setAddClinicShow] = useState(false);
  const profileImageRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const modalRef = useRef(null);
  const clinicRef = useRef(null);
  const navigate = useNavigate();
  const {
    user: { name, role, clinicId },
    setFavClinic,
    setUser,
    favClinic,
    clinics,
    setClinics,
  } = useContext(AuthContext);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsModalShow(false);
  };

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateFiltered, setIsDateFiltered] = useState(false);
  const [showFilterApplied, setShowFilterApplied] = useState(false);

  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleShow = () => {
    const startDate = format(dateRange[0].startDate, "yyyy-MM-dd");
    const endDate = format(dateRange[0].endDate, "yyyy-MM-dd");
    handleDateFilter(startDate, endDate);
    setIsDateFiltered(true);
    setShowDatePicker(false);
    setShowFilterApplied(true);
  };

  const handleClear = () => {
    setIsDateFiltered(false); // Reset filter state
    handleClearFilter(); // Call parent function to clear filter
    setDateRange([
      { startDate: new Date(), endDate: new Date(), key: "selection" },
    ]);
    setShowFilterApplied(false);
  };

  const handleDateClick = () => {
    if (!showFilterApplied) {
      setShowDatePicker(!showDatePicker); // Allow toggling the date picker
    }
  };

  const MemoizedAddNewPatient = useMemo(() => {
    if (isModalShow && modalToShow === "patientModal") {
      return (
        <AddNewPatient
          handleClose={handleClose}
          currentClinic={favClinic}
          handleAddPatient={handleAddPatient}
        />
      );
    }
    return null; // Render nothing when the modal is not open
  }, [isModalShow, modalToShow, handleAddPatient]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalShow(false);
      }
      if (clinicRef.current && !clinicRef.current.contains(event.target)) {
        setAddClinicShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalShow]);

  const handelLogOut = () => {
    localStorage.removeItem("token");
    setUser({});
    setFavClinic({});
    setClinics([]);
    navigate("/");
  };

  return (
    <header className="flex justify-between pb-4 xlg:pb-5 p-2 px-4 xlg:p-4 xlg:px-8 border-b border-black/20">
      <div className="flex flex-row gap-4">
        <div className="relative">
          <input
            type="text"
            readOnly
            value={`From: ${format(
              dateRange[0].startDate,
              "dd/MM/yyyy"
            )} To: ${format(dateRange[0].endDate, "dd/MM/yyyy")}`}
            className="h-[2.5rem] px-6 rounded-md bg-[#F5F5F5] text-sm cursor-pointer outline-none"
            onClick={handleDateClick}
          />

          {showDatePicker && (
            <div className="absolute z-10 mt-2">
              <DateRangePicker
                ranges={dateRange}
                onChange={handleDateChange}
                rangeColors={["#3b82f6"]}
              />
            </div>
          )}
        </div>

        {!isDateFiltered ? (
          <button
            className="h-[2.5rem] px-6 flex justify-center items-center bg-custom-blue rounded text-white text-base"
            onClick={handleShow}
          >
            Show
          </button>
        ) : (
          <button
            className="h-[2.5rem] px-6 flex justify-center items-center bg-gray-300 rounded text-black text-base"
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center bg-[#F5F5F5] gap-3 rounded  relative xl:text-base text-xs xlg:text-sm text-custom-gray">
        <select
          value={favClinic._id}
          onChange={(e) => {
            const selectedClinic = clinics.find(
              (clinic) => clinic._id === e.target.value
            );
            setFavClinic(selectedClinic);
          }}
          className="block w-full appearance-none cursor-pointer truncate px-2 xlg:px-6 h-[2.5rem] pe-2 bg-[#F5F5F5] focus:outline-none"
        >
          {clinics?.length > 0 &&
            clinics.map((clinic) => (
              <option value={clinic._id} key={clinic._id}>
                {clinic.clinic_name}
              </option>
            ))}
        </select>
        <FaCaretDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600" />
      </div>
      <div className="flex items-center bg-[#F5F5F5] gap-3 rounded px-6 h-[2.5rem]">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-custom-gray text-xs xl:text-base xlg:text-sm placeholder:text-custom-gray bg-[#F5F5F5] placeholder-[#00000080] focus:outline-none"
        />
        <button
          type="button"
          className="text-xs xl:text-base xlg:text-sm text-custom-gray"
        >
          <IoSearch />
        </button>
      </div>
      {role === "super_admin" && (
        <>
          <PatientDataExportInExcel clinicId={favClinic._id} />
          <PatientDataImportInExcel handleAddPatient={handleAddPatient} />
        </>
      )}

      {children}
      <div className="flex items-center justify-center relative group">
        <span ref={profileImageRef} className="sm:w-[3rem] lg:w-fit">
          <img
            src="/images/pro-pic.png"
            alt=""
            className="h-[2rem] cursor-pointer"
            onClick={toggleProfileDropdown}
          />
          {isProfileDropdownOpen && (
            <div
              ref={profileDropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <div className="px-4 py-2 text-gray-700">
                <span className="block text-sm font-semibold capitalize">
                  {name}
                </span>
                <span className="block text-sm capitalize">
                  {role.split("_").join(" ")}
                </span>
              </div>
              <div className="border-t border-gray-200"></div>
              {/* <button
                type="button"
                onClick={() => setAddClinicShow(true)}
                className="w-full px-4 py-2 flex justify-between items-center text-left text-gray-700 hover:bg-gray-100"
              >
                Add Clinic
                <MdAdd />
              </button> */}
              <button
                onClick={handelLogOut}
                type="button"
                className="w-full px-4 py-2 flex justify-between items-center text-left text-gray-700 hover:bg-gray-100"
              >
                Logout
                <IoIosLogOut />
              </button>
            </div>
          )}
        </span>
      </div>
      <div
        ref={modalRef}
        className={`fixed top-0 right-0 h-screen w-[60%] xl:w-[50%] overflow-scroll z-[100] custom-scroll  bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isModalShow || addClinicShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          {MemoizedAddNewPatient}
          {modalToShow === "formModal" && (
            <AddForm
              handleClose={handleClose}
              headerText={"Form"}
              fetchData={fetchData}
            />
          )}
          {modalToShow === "directionModal" && (
            <AddForm
              handleClose={handleClose}
              headerText={"Direction"}
              fetchData={fetchData}
            />
          )}
          {addClinicShow && (
            <AddNewClinic handleClose={() => setAddClinicShow(false)} />
          )}
          {!modalToShow && null}
        </div>
      </div>
      <div
        ref={clinicRef}
        className={`fixed top-0 right-0 h-screen w-[60%] xl:w-[50%] overflow-scroll z-[100] custom-scroll bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
          addClinicShow ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* <div className="p-4">
          {addClinicShow && (
            <AddNewClinic
              handleClose={() => setAddClinicShow(false)}
              clinics={clinics}
            />
          )}
          {!addClinicShow && null}
        </div> */}
      </div>
    </header>
  );
};

export default Topheader;
