import React, { useState } from "react";
import AdminDashboardTemplate from "../../template/AdminDashboardTemplate";
import PerformanceComponent from "../../component/PerformanceComponent";
import Topheader from "../../component/Topheader";
import GaugeChart from "../../component/GaugeChart";
import { BsEye, BsGraphUpArrow, BsPeople } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import ViewPatient from "../../component/ViewPatient";
import { GoPerson } from "react-icons/go";
import { MdCurrencyRupee } from "react-icons/md";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [showViewPatient, setShowViewPatient] = useState(false);

  const handleViewPatient = () => {
    setShowViewPatient(true);
  };

  const handleClose = () => {
    setShowViewPatient(false);
  };
  const [patientsData, setPatientsData] = useState([
    {
      pid: "001",
      name: "Prakesh C.",
      gender: "Male",
      age: "37",
      mobilenumber: "1234567890",
      paid: "1000",
      due: "500",
      priority: "High",
      doctorname: "Dr Saikat Paul",
    },
    {
      pid: "002",
      name: "Ravi S.",
      gender: "Male",
      age: "42",
      mobilenumber: "9876543210",
      paid: "1500",
      due: "1000",
      priority: "",
      doctorname: "Dr Saikat Paul",
    },
    {
      pid: "003",
      name: "Neha K.",
      gender: "Female",
      age: "29",
      mobilenumber: "4567891230",
      paid: "2000",
      due: "0",
      priority: "",
      doctorname: "Dr Saikat Paul",
    },
  ]);

  const togglePriority = (index) => {
    const updatedPatients = patientsData.map((patient, i) => {
      if (i === index) {
        return {
          ...patient,
          priority: patient.priority === "High" ? "" : "High",
        };
      }
      return patient;
    });
    setPatientsData(updatedPatients);
  };

  return (
    <AdminDashboardTemplate>
      <div className="">
        <Topheader />
      </div>
      <div className="xl:p-8 p-4 flex flex-col gap-8">
        <div>
          <PerformanceComponent />
        </div>
        <div className="flex flex-col w-full lg:flex-row gap-4 justify-between overflow-x-hidden py-4  ">
          <div className="bg-white rounded boxsh flex items-center justify-center w-full lg:w-[50%] xlg:w-[50%]">
            <GaugeChart
              icon={<BsPeople className="size-6 text-custom-orange" />}
              text={"Monthly Patients"}
            />
          </div>
          <div className="bg-white rounded boxsh flex items-center justify-center w-full lg:w-[50%] xlg:w-[50%]">
            <GaugeChart
              icon={<BsGraphUpArrow className="size-6 text-custom-orange" />}
              text={"Payments"}
            />
          </div>
        </div>
        <div className="p-2 bg-white rounded-lg flex flex-col gap-4">
          <h1 className="xlg:text-2xl text-xl font-semibold">
            Recent Appointments
          </h1>
          <div className="flex flex-col gap-6">
            {patientsData.map((item, index) => (
              <section
                key={index}
                className={`xlg:p-4 p-3 rounded-md border border-[#E7E7E7]  ${
                  index % 2 == 0 ? "bg-[#F5F5F5]" : " bg-transparent "
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row items-start justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex flex-row items-center gap-2">
                        <span className="xlg:text-lg text-base text-[#888888] font-medium ">
                          {item.pid}.
                        </span>
                        <div className="flex flex-row items-center gap-1 text-sm xlg:text-base font-medium text-[#555555]">
                          <GoPerson /> <span>{item.name}</span> |
                          <span>{item.gender}</span> |
                          <span>{item.age} Years</span>
                        </div>
                      </div>
                      <div className="xlg:text-base text-sm font-medium text-[#555555]">
                        +91 {item.mobilenumber}
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
                      <button
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                        }`}
                      >
                        <span>
                          <MdCurrencyRupee />
                        </span>
                        <span className="text-[#00B252]">{item.paid} Paid</span>
                      </button>
                      <button
                        className={`priority-button text-[#E40000] ${
                          index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                        } `}
                      >
                        Due {item.due}
                      </button>
                      <Link
                        to="/prescription/add"
                        className={`priority-button ${
                          index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                        }`}
                      >
                        Start Visit
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between items-center ">
                    <button
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      {item.doctorname}
                    </button>
                    <div
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      Create Invoice
                    </div>
                    <div
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      Case History
                    </div>
                    <button
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      Estimate
                    </button>

                    <button
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      Prescription
                    </button>
                    <button
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      Documents
                    </button>

                    <button
                      className={`priority-button ${
                        index % 2 === 0 ? "bg-[white]" : "bg-[#EEEEEE]"
                      }`}
                    >
                      Forms
                    </button>
                    <div className="flex flex-row items-center gap-4">
                      <button
                        onClick={handleViewPatient}
                        className="xlg:text-2xl text-xl font-medium text-[#7F03FA]"
                      >
                        <BsEye />
                      </button>
                      <button className="xlg:text-2xl text-xl font-medium text-[#00B252]">
                        <FaEdit />
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
          <div
            className={`fixed top-0 right-0 h-screen w-[60%] xlg:w-[50%] overflow-scroll custom-scroll  bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
              showViewPatient ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="p-4">
              <ViewPatient handleClose={handleClose} />
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardTemplate>
  );
};

export default Dashboard;
