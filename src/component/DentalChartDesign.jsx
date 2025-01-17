import React, { useEffect, useState } from "react";
import { RxCrossCircled } from "react-icons/rx";

const DentalChartDesign = ({ handleClose, onSelect, selectedValues = [] }) => {
  const [selectedDentalChartI, setSelectedDentalChartI] = useState({});
  const [selectedDentalChartII, setSelectedDentalChartII] = useState({});

  const toggleDentalChartI = (value) => {
    setSelectedDentalChartI((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const toggleDentalChartII = (value) => {
    setSelectedDentalChartII((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };
  const confirmSelection = () => {
    const selectedValues = [
      ...Object.keys(selectedDentalChartI).filter(
        (key) => selectedDentalChartI[key]
      ),
      ...Object.keys(selectedDentalChartII).filter(
        (key) => selectedDentalChartII[key]
      ),
    ];
    onSelect(selectedValues); // Send the selected values back to the parent
  };

  const handleCloseWithConfirm = () => {
    confirmSelection(); // Confirm the current selection
    handleClose(); // Close the modal
  };

  useEffect(() => {
    const initialSelected = {};
    selectedValues.forEach((value) => (initialSelected[value] = true));
    setSelectedDentalChartI(initialSelected);
  }, [selectedValues]);

  const dentalchartUR = [
    {
      value: "UR8",
      name: "8",
    },
    {
      value: "UR7",
      name: "7",
    },
    {
      value: "UR6",
      name: "6",
    },
    {
      value: "UR5",
      name: "5",
    },
    {
      value: "UR4",
      name: "4",
    },
    {
      value: "UR3",
      name: "3",
    },
    {
      value: "UR2",
      name: "2",
    },
    {
      value: "UR1",
      name: "1",
    },
  ];
  const dentalchartUL = [
    {
      value: "UL1",
      name: "1",
    },
    {
      value: "UL2",
      name: "2",
    },
    {
      value: "UL3",
      name: "3",
    },
    {
      value: "UL4",
      name: "4",
    },

    {
      value: "UL5",
      name: "5",
    },
    {
      value: "UL6",
      name: "6",
    },
    {
      value: "UL7",
      name: "7",
    },
    {
      value: "UL8",
      name: "8",
    },
  ];
  const dentalchartLR = [
    {
      value: "LR8",
      name: "8",
    },
    {
      value: "LR7",
      name: "7",
    },
    {
      value: "LR6",
      name: "6",
    },
    {
      value: "LR5",
      name: "5",
    },
    {
      value: "LR4",
      name: "4",
    },
    {
      value: "LR3",
      name: "3",
    },
    {
      value: "LR2",
      name: "2",
    },
    {
      value: "LR1",
      name: "1",
    },
  ];
  const dentalchartLL = [
    {
      value: "LL1",
      name: "1",
    },
    {
      value: "LL2",
      name: "2",
    },
    {
      value: "LL3",
      name: "3",
    },
    {
      value: "LL4",
      name: "4",
    },

    {
      value: "LL5",
      name: "5",
    },
    {
      value: "LL6",
      name: "6",
    },
    {
      value: "LL7",
      name: "7",
    },
    {
      value: "LL8",
      name: "8",
    },
  ];

  const dentalchartChildUL = [
    {
      value: "ULA",
      name: "A",
    },
    {
      value: "ULB",
      name: "B",
    },
    {
      value: "ULC",
      name: "C",
    },
    {
      value: "ULD",
      name: "D",
    },
    {
      value: "ULE",
      name: "E",
    },
  ];

  const dentalchartChildUR = [
    {
      value: "URE",
      name: "E",
    },
    {
      value: "URD",
      name: "D",
    },
    {
      value: "URC",
      name: "C",
    },
    {
      value: "URB",
      name: "B",
    },
    {
      value: "URA",
      name: "A",
    },
  ];
  const dentalchartChildLL = [
    {
      value: "LLA",
      name: "A",
    },
    {
      value: "LLB",
      name: "B",
    },
    {
      value: "LLC",
      name: "C",
    },
    {
      value: "LLD",
      name: "D",
    },
    {
      value: "LLE",
      name: "E",
    },
  ];

  const dentalchartChildLR = [
    {
      value: "LRE",
      name: "E",
    },
    {
      value: "LRD",
      name: "D",
    },
    {
      value: "LRC",
      name: "C",
    },
    {
      value: "LRB",
      name: "B",
    },
    {
      value: "LRA",
      name: "A",
    },
  ];

  const dentalchartiiUR = [
    { value: "18", name: "18" },
    { value: "17", name: "17" },
    { value: "16", name: "16" },
    { value: "15", name: "15" },
    { value: "14", name: "14" },
    { value: "13", name: "13" },
    { value: "12", name: "12" },
    { value: "11", name: "11" },
  ];

  const dentalchartiiUL = [
    { value: "21", name: "21" },
    { value: "22", name: "22" },
    { value: "23", name: "23" },
    { value: "24", name: "24" },
    { value: "25", name: "25" },
    { value: "26", name: "26" },
    { value: "27", name: "27" },
    { value: "28", name: "28" },
  ];

  const dentalchartiiLR = [
    { value: "48", name: "48" },
    { value: "47", name: "47" },
    { value: "46", name: "46" },
    { value: "45", name: "45" },
    { value: "44", name: "44" },
    { value: "43", name: "43" },
    { value: "42", name: "42" },
    { value: "41", name: "41" },
  ];

  const dentalchartiiLL = [
    { value: "31", name: "31" },
    { value: "32", name: "32" },
    { value: "33", name: "33" },
    { value: "34", name: "34" },
    { value: "35", name: "35" },
    { value: "36", name: "36" },
    { value: "37", name: "37" },
    { value: "38", name: "38" },
  ];

  const dentalchartChildiiUR = [
    { value: "55", name: "55" },
    { value: "54", name: "54" },
    { value: "53", name: "53" },
    { value: "52", name: "52" },
    { value: "51", name: "51" },
  ];
  const dentalchartChildiiUL = [
    { value: "61", name: "61" },
    { value: "62", name: "62" },
    { value: "63", name: "63" },
    { value: "64", name: "64" },
    { value: "65", name: "65" },
  ];
  const dentalchartChildiiLR = [
    { value: "85", name: "85" },
    { value: "84", name: "84" },
    { value: "83", name: "83" },
    { value: "82", name: "82" },
    { value: "81", name: "81" },
  ];
  const dentalchartChildiiLL = [
    { value: "71", name: "71" },
    { value: "72", name: "72" },
    { value: "73", name: "73" },
    { value: "74", name: "74" },
    { value: "75", name: "75" },
  ];
  return (
    <div className="p-4 flex flex-col gap-8">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-2xl font-semibold text-[#333333]">Dental Chart</h1>
        <button onClick={handleCloseWithConfirm}>
          <RxCrossCircled size={24} />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-center items-center text-xl font-semibold">
          Dental Chart I
        </div>
        <div className="h-[3rem] flex justify-center items-center w-full bg-[#D9D9D9] text-black">
          For Adult Patient Chart
        </div>
        <div className=" grid grid-cols-2 gap-4 gap-x-12">
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Right
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartUR.map((item, index) => (
                <div
                  className={`size-10 border-r-4 border-b-4 cursor-pointer flex justify-center items-center text-lg font-medium ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Left
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartUL.map((item, index) => (
                <div
                  className={`size-10 border-l-4 border-b-4  cursor-pointer flex justify-center items-center text-lg font-medium ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Right
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartLR.map((item, index) => (
                <div
                  className={`size-10 border-t-4 border-r-4 cursor-pointer flex justify-center items-center text-lg font-medium ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Left
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartLL.map((item, index) => (
                <div
                  className={`size-10 border-t-4 border-l-4 cursor-pointer flex justify-center items-center text-lg font-medium ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[3rem] flex justify-center items-center w-full bg-[#D9D9D9] text-black">
          For Child Patient Chart
        </div>
        <div className=" grid grid-cols-2 gap-4 gap-x-12 justify-center items-center">
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Right
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center w-full">
              {dentalchartChildUR.map((item, index) => (
                <div
                  className={`size-10 border-r-4 border-b-4   flex justify-center items-center cursor-pointer text-lg font-medium ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Left
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center">
              {dentalchartChildUL.map((item, index) => (
                <div
                  className={` size-10 border-l-4 border-b-4 cursor-pointer  flex justify-center items-center text-lg font-medium    ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Right
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center">
              {dentalchartChildLR.map((item, index) => (
                <div
                  className={`size-10 border-t-4 border-r-4 cursor-pointer flex justify-center items-center text-lg font-medium  ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Left
            </h1>
            <div className="flex flex-row justify-center gap-2 items-center">
              {dentalchartChildLL.map((item, index) => (
                <div
                  className={`size-10 border-t-4 border-l-4  cursor-pointer flex justify-center items-center text-lg font-medium  ${
                    selectedDentalChartI[item.value]
                      ? "border-custom-blue"
                      : "border-[#333333]"
                  }`}
                  onClick={() => toggleDentalChartI(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="w-full flex justify-center items-center text-xl font-semibold">
          Dental Chart II
        </div>
        <div className="h-[3rem] flex justify-center items-center w-full bg-[#D9D9D9] text-black">
          For Adult Patient Chart
        </div>
        <div className=" grid grid-cols-2 gap-4 gap-x-12">
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Right
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartiiUR.map((item, index) => (
                <div
                  className={`size-10 border border-[#333333] flex justify-center items-center text-lg cursor-pointer font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Left
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartiiUL.map((item, index) => (
                <div
                  className={`size-10 border border-[#333333] flex justify-center items-center text-lg cursor-pointer font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Right
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartiiLR.map((item, index) => (
                <div
                  className={` size-10 border border-[#333333] flex justify-center items-center cursor-pointer text-lg font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Left
            </h1>
            <div className="grid grid-cols-8 gap-2 items-center">
              {dentalchartiiLL.map((item, index) => (
                <div
                  className={` size-10 border border-[#333333] flex justify-center items-center text-lg cursor-pointer font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-[3rem] flex justify-center items-center w-full bg-[#D9D9D9] text-black">
          For Child Patient Chart
        </div>
        <div className=" grid grid-cols-2 gap-4 gap-x-12 justify-center items-center">
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Right
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center w-full">
              {dentalchartChildiiUR.map((item, index) => (
                <div
                  className={`size-10 border border-[#333333] flex justify-center items-center text-lg cursor-pointer font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Upper Left
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center">
              {dentalchartChildiiUL.map((item, index) => (
                <div
                  className={` size-10 border border-[#333333] flex justify-center items-center text-lg  cursor-pointer font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Right
            </h1>
            <div className="flex flex-row gap-2 items-center justify-center">
              {dentalchartChildiiLR.map((item, index) => (
                <div
                  className={`size-10 border border-[#333333] flex justify-center items-center text-lg cursor-pointer font-medium ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="w-full flex justify-center items-center text-xl font-medium">
              Lower Left
            </h1>
            <div className="flex flex-row justify-center gap-2 items-center">
              {dentalchartChildiiLL.map((item, index) => (
                <div
                  className={`size-10 border border-[#333333] flex justify-center items-center text-lg  cursor-pointer font-medium  ${
                    selectedDentalChartII[item.value]
                      ? "bg-[#333333] text-white"
                      : "bg-transparent"
                  }`}
                  onClick={() => toggleDentalChartII(item.value)}
                  key={index}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalChartDesign;
