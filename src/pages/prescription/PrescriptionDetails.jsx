import React, { useEffect, useRef, useState } from "react";
import TopHeaderMini from "../../component/TopHeaderMini";
import { FiEdit, FiPrinter } from "react-icons/fi";
import { AiOutlineDownload } from "react-icons/ai";
import { PiMoneyWavy } from "react-icons/pi";
import { TbMessageStar, TbWorldWww } from "react-icons/tb";
import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import html2pdf from "html2pdf.js";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import PrescriptionWhatsapp from "../../component/prescription/PrescriptionWhatsapp";
import RenderDentalChart from "../../component/dentalchartedesign/RenderDentalChart";

const PrescriptionDetails = () => {
  const { patientId, prescriptionId } = useParams();
  const [prescriptionData, setPrescriptionData] = useState(null);
  const prescriptionRef = useRef();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const [clinicData, setClinicData] = useState(null);

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        const url = `${
          import.meta.env.VITE_BASE_URL
        }/api/patients/get/${patientId}`;

        const finalUrl = prescriptionId
          ? `${url}?prescriptionId=${prescriptionId}`
          : url;

        const response = await axios.get(finalUrl);
        const clinicResponse = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/clinic/${
            response.data.clinicId
          }`
        );
        setClinicData(clinicResponse.data);
        setPrescriptionData(response.data);
      } catch (error) {
        console.error("Error fetching prescription data:", error);
      }
    };

    const isViewMode = new URLSearchParams(location.search).has("view");
    setIsViewing(isViewMode); // If `view` query param exists, set to true
    fetchPrescriptionData();
  }, [patientId, prescriptionId, location.search]);

  const handlePrint = async () => {
    const element = prescriptionRef.current;
    element.classList.add("hide-action");
    setIsLoading(true);

    try {
      const pdfBlob = await html2pdf()
        .from(element)
        .set({
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .outputPdf("blob");

      if (pdfBlob.type !== "application/pdf") {
        console.error("The generated file is not a PDF.");
        return;
      }

      const formData = new FormData();
      formData.append(
        "prescriptionPdf",
        pdfBlob,
        `${prescriptionData.patientName}-${prescriptiondate},${prescriptiontime}prescription.pdf`
      );

      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patients/update/prescriptions/${patientId}/${prescriptionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
      }
    } catch (error) {
      console.error("Error updating Prescription:", error);
    } finally {
      element.classList.remove("hide-action");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (prescriptionData && prescriptionData.prescriptions && !isViewing) {
      handlePrint();
    }
  }, [prescriptionData]);

  if (!prescriptionData || !prescriptionData.prescriptions) {
    return <p>Loading...</p>;
  }

  const prescriptionCreatedAt = prescriptionData.prescriptions[0]?.createdAt;
  const prescriptiondate = new Date(prescriptionCreatedAt).toLocaleDateString(
    "en-GB"
  );
  const prescriptiontime = new Date(prescriptionCreatedAt).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );

  const ourclinics = [
    {
      address:
        "DENTITY DENTAL GARIAHAT (ISO Certified) - Gariahat Market (Old Block), Stall No. G 11, 1st Floor (at Gariahat Crossing), 212 Rashbehari Aveue, Kolkata - 700019",
      mobileno: "9088182352",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL TOLLYGUNGE NETAJI NAGAR (ACE Dental Care - 2) (ISO Certified) - 256A Netaji Nagar (Gandhi Colony), Opposite Narmada School, Kolkata -700092",
      mobileno: "6291496611",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL TOLLYGUNGE SURYANAGAR (ACE Dental Care) (ISO Certified) - 203 A,Titli Appartment, NSC Bose Rd. Suryanagar, (Opp. Tollygunge Homes) Kolkata - 700040",
      mobileno: "7003905095",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL SONARPUR (Relief Dental Clinic) (ISO Certified) - Sonarpur H.C Sarani, Deshbondhu Park, Near Khadim, Sishu Niketan's Lane) Kolkata - 700150",
      mobileno: "6291401067, 8017736515",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL DUMDUM CANTONMENT (Modern Dental Clinic) (ISO Certified) - 28, Subhas Nagar Rd. (Near Cantonment Station/SBI ATM/Dhaka Sweets),  Kolkata - 700065",
      mobileno: "8017736704",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL RAJARHAT TEGHORIA NEWTOWN (Modern Dental World - 2) (ISO Certified) -  Abantika Appartment,Gr. Floor, T/98 Rajarhat Rd, Beside WBSEDCL Office, Kolkata - 700157 ",
      mobileno: "9073953253",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL TEGHORIA (Dr. S. Paul's Modern Dental World) (ISO Certified) -  Deepshikha Appartment, Gr. Floor,Teghoria (VIP Rd), 21, Teghoria Main Rd. Kolkata -700157",
      mobileno: "8017736586",
      additionaldata: "",
    },
    {
      address:
        "DENTITY DENTAL BELEGHATA CIT MORE (ISO Certified) - P44 CIT Road/Hemchandra Naskar Road, (Opposite Beliaghata Police Station) Kolkata - 700010 ",
      mobileno: "7003650562",
      additionaldata: "",
    },
    {
      address:
        "DENTAL (MID) WORLD (ISO Certified) -Rabindranagar, Opposite Arobindo Stadium Gate No. 1, Near Nirnoy Hospital, Midnapu",
      mobileno: "9800672646, 7872005873",
      additionaldata: "Thursday &  Sunday: 9am to 8pm",
    },
  ];

  const handleDownload = () => {
    const element = prescriptionRef.current;
    element.classList.add("hide-action");

    html2pdf()
      .from(element)
      .set({
        filename: `${prescriptionData.patientName}-${prescriptiondate},${prescriptiontime}prescription.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .finally(() => {
        element.classList.remove("hide-action");
      }, 300);
  };

  const navigateToEditPage = () => {
    navigate(`/prescription/${patientId}/edit/${prescriptionId}`, {
      state: { prescriptionData },
    });
  };

  const handleSendWhatsApp = () => {
    setIsWhatsappModalOpen(true); // Show the modal
  };

  const closeWhatsappModal = () => {
    setIsWhatsappModalOpen(false); // Close the modal
  };

  const buttonData = [
    {
      icon: <FiPrinter className="size-5" />,
      text: "Print",
      onClick: handleDownload,
    },
    {
      icon: <AiOutlineDownload className="size-5" />,
      text: "Download",
      onClick: "",
    },
    {
      icon: <PiMoneyWavy className="size-5" />,
      text: "Payment",
      onClick: "",
    },
    {
      icon: <TbMessageStar className="size-5" />,
      text: "Google Review Link",
      onClick: "",
    },
    {
      icon: <FaWhatsapp className="size-5" />,
      text: "Send WhatsApp",
      onClick: handleSendWhatsApp,
    },
  ];

  return (
    <>
      <TopHeaderMini />
      <div className="p-8 flex gap-6 bg-[#EDF4F7]">
        <div className="rounded flex bg-white flex-col w-[20%] gap-4 py-7 px-6">
          <h2 className="text-custom-gray xlg:text-base text-sm">
            Prescription Save Successful
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="xl:text-base text-sm font-semibold text-custom-gray">
              {prescriptionData.patientName}
            </h1>
            <p className="xlg:text-base text-sm text-[#9C9C9C]">
              {prescriptionData.mobileNumber}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {buttonData.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                type="button"
                className="inline-flex justify-center  items-center gap-2 rounded-3xl bg-custom-blue text-white px-6  h-[2.5rem]"
              >
                {button.icon}
                <span className="text-sm">{button.text}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col w-[80%] gap-4  rounded ">
          {isLoading && (
            <div className="fullscreen-loader">
              <div className="spinner"></div>
            </div>
          )}
          <div className="flex flex-col gap-4" ref={prescriptionRef}>
            <div className="bg-white  flex flex-col a4-container ">
              <div className="flex flex-row gap-4 p-2 w-full items-center">
                <div className="w-[20%]">
                  <img
                    src="/images/dentitydentallogo.png"
                    alt=""
                    className="w-fit h-[4rem] "
                  />
                </div>
                <div className="flex flex-col w-full gap-2 items-center">
                  <h1 className="text-lg font-semibold text-[#333333]">
                    A Unit of Multiplicity Dental Clinic Chain in Kolkata & W.B.
                  </h1>
                  <h3 className="text-sm font-semibold text-[#333333] text-center">
                    {clinicData.clinic_name}, {clinicData.clinic_address}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 text-sm font-medium text-[#000000] ">
                    <div>Name: {prescriptionData.patientName}</div>
                    <div>
                      Age: {prescriptionData.age} | Gender:{" "}
                      {prescriptionData.gender}
                    </div>
                    <div>Date: {prescriptiondate}</div>
                    <div>Time: {prescriptiontime}</div>
                  </div>
                </div>
              </div>
              <div className="bg-[#3780EF] blue-padding p-1  px-6 text-base/[0px] font-semibold text-white grid grid-cols-3 justify-center overflow-visible ">
                <div className=" flex items-center gap-2">
                  <div className="p-[0.2rem] text-sm/[0px] action-column  rounded-full bg-white text-[#3780EF]">
                    <TbWorldWww />
                  </div>
                  <div>Our Branches</div>
                </div>
                <div className=" flex items-center gap-2">
                  <div className="p-[0.2rem] text-sm/[0px] action-column  rounded-full bg-white text-[#3780EF]">
                    <TbWorldWww />
                  </div>
                  <div>www.dentitydental.in</div>
                </div>
                <div className="flex pdf-center gap-2">
                  <span className="p-[0.2rem] text-sm/[0px] action-column rounded-full bg-white text-[#3780EF]">
                    <FaPhoneAlt />
                  </span>
                  9051553253
                </div>
              </div>
              <div className="py-3 flex flex-row gap-2">
                <div className="flex flex-col w-[40%] gap-2 justify-between">
                  {ourclinics.map((item, index) => (
                    <div
                      className={`flex flex-row gap-2  font-albertsans text-sm ${
                        index % 2 === 0
                          ? " bg-gradient-to-r from-[#E4F6FF] to-[#FFFFFF]"
                          : " bg-transparent"
                      }`}
                      key={index}
                    >
                      <div className="w-[0.5rem] h-full bg-[#3780EF] "></div>
                      <div className="p-1 flex text-xs flex-col w-full max-w-[90%] ">
                        <span>{item.address}</span>
                        <span>Mobile: {item.mobileno}</span>
                        <span>{item.additionaldata}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F8F8F8] h-full p-4 w-[60%] rounded-xl mx-4 flex flex-col">
                  <div className="flex flex-col gap-2 h-[9rem]">
                    <h1 className="text-sm/[0px] text-[#3B3B3B]">
                      Medical History
                    </h1>
                    <div className="flex  flex-col ">
                      {prescriptionData.medicalHistory.map((history, index) => (
                        <div
                          key={index}
                          className="flex flex-row text-xs gap-4"
                        >
                          <h3>{history.medicalHistoryName}</h3>
                          <h3>{history.duration}</h3>

                          <div className="flex flex-row gap-2">
                            {history.medicalHistoryMedicine.map(
                              (medicine, idx) => (
                                <div key={idx}>{medicine}, </div>
                              )
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[7rem]">
                    <h1 className="text-sm/[0px] text-[#3B3B3B]">CC</h1>
                    <div className="flex flex-col">
                      {prescriptionData.prescriptions[0].chiefComplain.map(
                        (cc, index) => (
                          <p
                            className="text-sm flex gap-1 items-center"
                            key={index}
                          >
                            {cc.chiefComplainName} -
                            <RenderDentalChart dentalChart={cc.dentalChart} />
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[12rem]">
                    <h1 className="text-sm/[0px] text-[#3B3B3B]">O/E</h1>
                    <div className="flex flex-col">
                      {prescriptionData.prescriptions[0].onExamination.map(
                        (oe, index) => (
                          <div
                            key={index}
                            className="flex flex-wrap text-sm gap-4"
                          >
                            <h3>{oe.onExaminationName}</h3>
                            <p>{oe.onExaminationArea.join(", ")}</p>
                            <p>{oe.onExaminationAdditionalNotes}</p>
                            <RenderDentalChart dentalChart={oe.dentalChart} />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[8rem]">
                    <h1 className="text-sm/[0px] text-[#3B3B3B]">
                      Investigation
                    </h1>
                    <div className="flex flex-col">
                      {prescriptionData.prescriptions[0].investigation.map(
                        (inv, index) => (
                          <p className="text-sm" key={index}>
                            {inv.investigationName}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[9rem]">
                    <h1 className="text-sm/[0px] text-[#3B3B3B]">
                      Radiography
                    </h1>
                    <div className="grid grid-cols-1 gap-2">
                      {prescriptionData.prescriptions[0].radiography.map(
                        (rad, index) => (
                          <p
                            className="text-sm flex flex-row items-center gap-1"
                            key={index}
                          >
                            {rad.radiographyName} -{" "}
                            <RenderDentalChart dentalChart={rad.dentalChart} />
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-h-[11rem]">
                    <h1 className="text-sm/[0px] text-[#3B3B3B]">Advice</h1>
                    <div className="">
                      {prescriptionData.prescriptions[0].advices.map(
                        (advice, index) => (
                          <p
                            className="text-sm flex flex-row items-center gap-1"
                            key={index}
                          >
                            {advice.advicesName},{" "}
                            <RenderDentalChart
                              dentalChart={advice.dentalChart}
                            />
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white  a4-container">
              {/* <div className="flex flex-row gap-4 p-4 w-full border-b  items-center">
                <div className="w-[20%]">
                  <img
                    src="/images/dentitydentallogo.png"
                    alt=""
                    className="w-fit h-[4rem] "
                  />
                </div>
                <div className="flex flex-col w-full gap-2 items-center">
                  <h1 className="text-lg font-semibold text-[#333333]">
                    A Unit of Multiplicity Dental Clinic Chain in Kolkata & W.B.
                  </h1>
                  <h3 className="text-sm font-semibold text-[#333333] text-center">
                    {clinicData.clinic_name}, {clinicData.clinic_address}
                  </h3>
                  <div className="grid grid-cols-2 gap-x-8 text-sm font-medium text-[#000000] ">
                    <div>Name: {prescriptionData.patientName}</div>
                    <div>
                      Age: {prescriptionData.age} | Gender:{" "}
                      {prescriptionData.gender}
                    </div>
                    <div>Date: {prescriptiondate}</div>
                    <div>Time: {prescriptiontime}</div>
                  </div>
                </div>
              </div> */}

              <div className="w-full flex flex-col gap-3">
                <h1 className="px-4 pt-4 text-2xl text-custom-blue font-medium">
                  {" "}
                  Rx,
                </h1>
                <div className=" border-b w-full border-gray-300 px-4 py-4">
                  <div className="xlg:text-base text-sm flex flex-row  w-full">
                    <div className="w-[40%]">Medications</div>
                    <div className="w-[10%]">Dose</div>
                    <div className="w-[20%]">Frequency</div>
                    <div className="w-[20%]">Duration</div>
                    <div className="w-[10%]">Quantity</div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 px-4">
                  {prescriptionData.prescriptions[0].medications.map(
                    (med, index) => (
                      <div
                        className="xlg:text-sm text-xs  flex flex-row w-full  "
                        key={index}
                      >
                        <div className="w-[40%] text-custom-gray flex flex-col ">
                          <span className="font-semibold">
                            {med.medicineBrandName}
                          </span>
                          <div className="">
                            {med.medicineComposition},{med.medicineStrength}
                          </div>
                        </div>
                        <div className="w-[10%] text-custom-gray">
                          {med.medicineDose}
                        </div>
                        <div className="w-[20%] flex flex-col text-custom-gray">
                          <div>{med.medicineFrequency}</div>

                          <div>{med.medicineTiming}</div>
                        </div>
                        <div className="w-[20%] text-custom-gray">
                          {med.medicineDuration}
                        </div>
                        <div className="w-[10%] text-custom-gray">
                          {med.medicineQuantity}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="pb-5  px-9 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={navigateToEditPage}
                type="button"
                className="inline-flex justify-center items-center gap-2 rounded-3xl bg-custom-blue text-white px-5 py-2"
              >
                <FiEdit className="size-3" />
                <span className="text-base">Edit Prescription</span>
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex justify-center items-center gap-2 rounded-3xl bg-custom-blue text-white px-5 py-2"
              >
                <FiPrinter className="size-3" />
                <span className="text-base">Print</span>
              </button>
            </div>
            <img
              src="/images/signature.svg"
              alt="signature"
              height={40}
              width={180}
              className="w-[12.5vmax]"
            />
          </div>
        </div>
      </div>

      {isWhatsappModalOpen && (
        <PrescriptionWhatsapp
          patientId={patientId}
          prescriptionId={prescriptionId}
          closeModal={closeWhatsappModal}
        />
      )}
    </>
  );
};

export default PrescriptionDetails;
