import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";

const SaveTcCardPdf = ({ tcCardId, patientId }) => {
  const [tcCardData, setTcCardData] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [clinicData, setClinicData] = useState(null);
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTcCardData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/patients/get/${patientId}?tccardId=${tcCardId}`
        );
        setPatientData(response.data);
        const tcCard = response.data.patientTcCard.find(
          (card) => card.tcCardId === tcCardId
        );
        if (tcCard) {
          setTcCardData(tcCard);
        } else {
          console.error("TC Card not found for the provided tcCardId");
        }

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
        console.error("Error fetching TC card data:", error);
      }
    };

    if (tcCardId) {
      fetchTcCardData();
    }
  }, [tcCardId]);

  const formattedDate = tcCardData
    ? new Date(tcCardData.createdAt).toLocaleDateString()
    : "";
  const formattedTime = tcCardData
    ? new Date(tcCardData.createdAt).toLocaleTimeString()
    : "";

  const handlePrint = async () => {
    const element = containerRef.current;
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
      formData.append("tccardPdf", pdfBlob, "tccard.pdf");

      const response = await axios.put(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patients/update/tccard/${patientId}/${tcCardId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("TC Card updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating TC Card:", error);
    } finally {
      element.classList.remove("hide-action");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tcCardData && clinicData && patientData) {
      handlePrint();
    }
  }, [tcCardData, clinicData, patientData]);

  if (!tcCardData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isLoading && (
        <div className="fullscreen-loader">
          <div className="spinner"></div>
        </div>
      )}
      <div
        ref={containerRef}
        className="flex flex-col gap-4 a4-container !h-fit overflow-scroll no-scrollbar"
      >
        <div className="flex flex-row gap-4 p-2 w-full items-center">
          <div className="w-[20%]">
            <img
              src="/images/dentitydentallogo.png"
              alt="Dental Logo"
              className="w-fit h-[4rem]"
            />
          </div>
          <div className="flex flex-col w-full gap-2 items-center">
            <h1 className="text-lg font-semibold text-[#333333]">
              A Unit of Multiplicity Dental Clinic Chain in Kolkata & W.B.
            </h1>
            <div className="grid grid-cols-2 gap-x-8 text-sm font-medium text-[#000000]">
              <div className="flex flex-col gap-2">
                <div>Name: {patientData.patientName}</div>
                <div>Age: {patientData.age}</div>
                <div>Gender: {patientData.gender}</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Phone: {patientData.chooseDoctorDetails?.phone}</div>
                <div>
                  Date & Time: {formattedDate}, {formattedTime}
                </div>

                <div>{clinicData?.clinic_address || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-xl font-medium text-[#333333] p-4">
          Doctor Name: {patientData.chooseDoctorDetails?.name || ""}
        </div>
        <div className="flex flex-col ">
          <div className="flex flex-row bg-[#F1F1F1] border-b border-[#00000033] text-[#333333] text-base gap-2">
            <div className="w-[50%] py-3 px-6  border-r border-[#00000033]">
              Type Of work
            </div>
            <div className="w-[50%] py-3 px-6 ">TC</div>
          </div>
          <div>
            {tcCardData.patientTcCardDetails?.map((entry, index) => (
              <div
                key={index}
                className=" flex flex-row border-b border-[#00000033] text-[#888888] text-base gap-2"
              >
                <div className="w-[50%] py-3 px-6  border-r border-[#00000033]">
                  {entry.typeOfWork}
                </div>
                <div className="w-[50%] py-3 px-6 ">{entry.tc}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col p-4 ">
          <div className="flex flex-row text-[#333333] border text-xs bg-[#F1F1F1] border-[#00000033]">
            <div className="w-[5%] py-3 px-2 border-r border-[#00000033]">
              Sl. No
            </div>

            <div className="w-[20%] py-3 px-2 border-r border-[#00000033]">
              Step Done
            </div>
            <div className="w-[20%] py-3 px-2 border-r border-[#00000033]">
              Next Appointment
            </div>
            <div className="w-[20%] py-3 px-2 border-r border-[#00000033]">
              Next Step
            </div>
            <div className="w-[10%] py-3 px-2 border-r border-[#00000033]">
              Payment
            </div>
            <div className="w-[10%] py-3 px-2 border-r border-[#00000033]">
              Due
            </div>
            <div className="w-[20%] py-3 px-2">Comment</div>
          </div>
          <div className="border-b border-x border-[#00000033]">
            {tcCardData.patientTcCardDetails?.map((entry, index) => (
              <div
                key={index}
                className=" flex flex-row border-b border-[#00000033] text-[#888888] text-xs"
              >
                <div className="w-[5%] py-3 px-2 border-r border-[#00000033]">
                  {index + 1}
                </div>
                <div className="w-[20%] py-3 px-2  border-r border-[#00000033]">
                  {entry.stepDone}
                </div>
                <div className="w-[20%] py-3 px-2 border-r border-[#00000033] ">
                  {entry.nextAppointment}
                </div>
                <div className="w-[20%] py-3 px-2  border-r border-[#00000033]">
                  {entry.nextStep}
                </div>
                <div className="w-[10%] py-3 px-2 border-r border-[#00000033] ">
                  {entry.payment}
                </div>{" "}
                <div className="w-[10%] py-3 px-2  border-r border-[#00000033]">
                  {entry.due}
                </div>
                <div className="w-[20%] py-3 px-2 ">{entry.comment}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaveTcCardPdf;