import html2pdf from "html2pdf.js";
import React, { useRef } from "react";
import { BsPrinterFill } from "react-icons/bs";
import { RxCrossCircled } from "react-icons/rx";

const TodaysPaymentDetails = ({
  handleClose,
  patients,
  loading,
  patientPaymentStartDate,
  patientPaymentEndDate,
}) => {
  const paymentref = useRef();
  const filterPayments = (patient) => {
    const startDate = new Date(patientPaymentStartDate).setHours(0, 0, 0, 0);
    const endDate = new Date(patientPaymentEndDate).setHours(23, 59, 59, 999);

    const filteredPayments = patient.patientTcCard.flatMap((tcCard) =>
      tcCard.patientTcCardDetails.filter((detail) => {
        const paymentDate = new Date(detail.createdAt).getTime();

        return paymentDate >= startDate && paymentDate <= endDate;
      })
    );

    // Calculate total payment
    const totalPayment = filteredPayments.reduce((total, paymentDetail) => {
      return total + (parseFloat(paymentDetail.payment) || 0);
    }, 0);

    return { filteredPayments, totalPayment };
  };

  const handleDownload = () => {
    const element = paymentref.current;
    element.classList.add("hide-action");

    html2pdf()
      .from(element)
      .set({
        filename: `${patientPaymentStartDate}payment.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save()
      .finally(() => {
        element.classList.remove("hide-action");
      }, 300);
  };

  return (
    <div>
      <div className="flex justify-end gap-4  items-center">
        <button
          onClick={handleDownload}
          className="h-[2.5rem] rounded-md text-white text-base gap-2 px-8 flex justify-center items-center bg-custom-green "
        >
          <BsPrinterFill /> Print Payment Data
        </button>
        <button onClick={handleClose} className="text-xl text-red-500">
          <RxCrossCircled size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="flex flex-col gap-4 mt-6" ref={paymentref}>
            <div className=" p-4 flex flex-col  rounded-md a4-container">
              <div className="flex flex-row bg-custom-blue rounded-t-md blue-padding text-white  p-[1rem] text-sm font-medium">
                <div className="w-[20%]">Patient Name</div>
                <div className="w-[20%]">Mobile Number</div>
                <div className="w-[20%]">Payments</div>
                <div className="w-[20%]">Payment Method</div>
                <div className="w-[20%]">Total Payments</div>
              </div>
              <div>
                {patients.length === 0 ? (
                  <p>No payments for the selected date.</p>
                ) : (
                  patients.map((patient) => {
                    const { filteredPayments, totalPayment } =
                      filterPayments(patient);

                    return (
                      <div
                        key={patient.patientId}
                        className="flex flex-row p-[1rem] border-b blue-padding border-[#cccccc]   text-sm"
                      >
                        <h3 className="w-[20%]">{patient.patientName}</h3>
                        <p className="w-[20%]">{patient.mobileNumber}</p>

                        <div className=" w-[40%]">
                          {filteredPayments.length === 0 ? (
                            <p>No payments found for this date range.</p>
                          ) : (
                            filteredPayments.map((detail, index) => (
                              <div key={index} className="flex flex-row ">
                                <p className="w-[50%] flex flex-wrap text-xs">
                                  ₹{detail.payment},
                                </p>
                                <p className="w-[50%]">
                                  {" "}
                                  {detail.paymentMethod}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                        <p className="w-[20%]">₹{totalPayment}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysPaymentDetails;
