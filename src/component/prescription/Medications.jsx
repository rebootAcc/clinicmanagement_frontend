import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { CiCircleMinus, CiCirclePlus } from "react-icons/ci";

const newMedicationTemplate = {
  medicineBrandName: "",
  medicineComposition: "",
  medicineStrength: "",
  dose: "",
  frequency: "",
  timing: "",
  duration: "",
  startFrom: "",
  instructions: "",
  qty: "",
  compositionOptions: [],
  strengthOptions: [],
  showBrandSuggestions: false,
  showCompositionSuggestions: false,
  showStrengthSuggestions: false,
  brandSuggestions: [],
};

const Medications = ({ onChange, existingMedications = [] }) => {
  const [medications, setMedications] = useState([
    { ...newMedicationTemplate },
  ]);

  const [suggestion, setSuggestion] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRefs = useRef([]);

  inputRefs.current = medications.map(
    (_, i) => inputRefs.current[i] || React.createRef()
  );

  const handleSearchDown = (index, e) => {
    const { brandSuggestions, showBrandSuggestions } = medications[index];

    if (showBrandSuggestions && brandSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < brandSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : brandSuggestions.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && brandSuggestions[activeIndex]) {
          handleSelectSuggestion(index, brandSuggestions[activeIndex]);
          setActiveIndex(-1);
        }
      }
    }
  };

  const formatFrequency = (value) => {
    value = value.replace(/[^01]/g, "").slice(0, 4);

    value = value
      .split("")
      .map((char, idx) => (idx > 0 ? `-${char}` : char))
      .join("");

    return value;
  };

  useEffect(() => {
    if (
      Array.isArray(existingMedications) &&
      existingMedications.length > 0 &&
      existingMedications.some((item) => item.medicineBrandName) &&
      medications[0].medicineBrandName === ""
    ) {
      setMedications(
        existingMedications.map((med) => ({
          medicineBrandName: med.medicineBrandName || "",
          medicineComposition: med.medicineComposition || "",
          medicineStrength: med.medicineStrength || "",
          dose: med.medicineDose || "",
          frequency: med.medicineFrequency || "",
          timing: med.medicineTiming || "",
          duration: med.medicineDuration || "",
          startFrom: med.medicineStartfrom || "",
          instructions: med.medicineInstructions || "",
          qty: med.medicineQuantity || "",
          compositionOptions: [],
          strengthOptions: [],
          showBrandSuggestions: false,
          showCompositionSuggestions: false,
          showStrengthSuggestions: false,
          brandSuggestions: [],
        }))
      );
    }
  }, [existingMedications]);

  const suggestDuration = (input) => {
    input = input.toLowerCase();
    if (input.endsWith("d")) return `${input.replace(/\D/g, "")} Days`;
    if (input.endsWith("m")) return `${input.replace(/\D/g, "")} Months`;
    if (input.endsWith("y")) return `${input.replace(/\D/g, "")} Years`;
    if (/^\d+$/.test(input)) return `${input} Days`;
    return "";
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Tab" && suggestion) {
      event.preventDefault();

      const updatedMedications = medications.map((med, i) =>
        i === index ? { ...med, duration: suggestion } : med
      );
      setMedications(updatedMedications);

      setSuggestion("");
    }
  };

  const fetchSuggestions = async (query, index) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/medications/getdropdown`,
        { params: { query } }
      );
      setMedications((prev) =>
        prev.map((med, i) =>
          i === index
            ? {
                ...med,
                brandSuggestions: response.data.map((item) => ({
                  displayText: `${item.medicineBrandName} - ${item.medicineComposition} - ${item.medicineStrength}`,
                  ...item,
                })),
                showBrandSuggestions: true,
              }
            : med
        )
      );
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const fetchRandomSuggestions = async (index) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/medications/getdropdown/random`,
        { params: { limit: 5 } }
      );
      setMedications((prev) =>
        prev.map((med, i) =>
          i === index
            ? {
                ...med,
                brandSuggestions: response.data.map((item) => ({
                  displayText: `${item.medicineBrandName} - ${item.medicineComposition} - ${item.medicineStrength}`,
                  ...item,
                })),
                showBrandSuggestions: true,
              }
            : med
        )
      );
    } catch (error) {
      console.error("Error fetching random suggestions:", error);
    }
  };

  useEffect(() => {
    if (typeof onChange === "function") {
      const filteredData = medications.map((field) => ({
        medicineBrandName: field.medicineBrandName,
        medicineComposition: field.medicineComposition,
        medicineStrength: field.medicineStrength,
        medicineDose: field.dose,
        medicineFrequency: field.frequency,
        medicineTiming: field.timing,
        medicineDuration: field.duration,
        medicineStartfrom: field.startFrom,
        medicineInstructions: field.instructions,
        medicineQuantity: field.qty,
      }));
      onChange(filteredData);
    }
  }, [medications]);

  const handleSaveMedication = async (index) => {
    const medication = medications[index];

    let [brandName, composition, strength] =
      medication.medicineBrandName.split(" - ");

    const dataToSend = {
      medicineBrandName: brandName || medication.medicineBrandName,
      medicineComposition: composition ? composition.trim() : "",
      medicineStrength: strength ? strength.trim() : "",
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/medications/create`,
        dataToSend
      );

      if (response.status === 201) {
        alert("Medication saved successfully!");
      }
    } catch (error) {
      console.error("Error saving medication:", error);
      alert("Error saving medication. Please try again.");
    }
  };

  const handleAddField = () => {
    setMedications((prev) => [...prev, { ...newMedicationTemplate }]);
  };

  const handleRemoveField = (index) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;

    if (name === "frequency") {
      const formattedValue = formatFrequency(value);
      setMedications((prev) =>
        prev.map((med, i) =>
          i === index ? { ...med, frequency: formattedValue } : med
        )
      );
    } else {
      setMedications((prev) =>
        prev.map((med, i) => (i === index ? { ...med, [name]: value } : med))
      );
    }

    if (name === "medicineBrandName") {
      if (value) {
        fetchSuggestions(value, index);
      } else {
        fetchRandomSuggestions(index);
      }
    } else if (name === "duration") {
      const suggestedText = suggestDuration(value);
      setSuggestion(suggestedText);
    }
  };

  const handleSelectSuggestion = (index, suggestion) => {
    setMedications((prev) =>
      prev.map((med, i) =>
        i === index
          ? {
              ...med,
              medicineBrandName: suggestion.medicineBrandName,
              medicineComposition: suggestion.medicineComposition,
              medicineStrength: suggestion.medicineStrength,
              showBrandSuggestions: false,
            }
          : med
      )
    );
    setIsEditing(false);
    if (inputRefs.current[index]) {
      inputRefs.current[index].current.focus();
    }
  };

  const handleBlur = (index) => {
    setTimeout(() => {
      setMedications((prev) =>
        prev.map((med, i) =>
          i === index ? { ...med, showBrandSuggestions: false } : med
        )
      );
    }, 100);
  };

  return (
    <div className="flex flex-col gap-9">
      <h1 className="text-custom-gray text-base lg:text-lg xl:text-xl font-semibold pb-2 xlg:pb-4 border-b border-black/20">
        Medications
      </h1>
      {medications.map((med, index) => (
        <div key={index} className="flex xlg:gap-4 gap-2 xl:gap-5 pb-9">
          <div className="flex flex-col w-[90%] gap-2">
            <div className="flex flex-row xlg:gap-4 gap-2 xl:gap-5 w-full">
              <div className="relative w-[50%] h-[3.5rem] bg-white px-2 xlg:px-4 xl:px-6 rounded">
                <div className=" flex    gap-2">
                  <input
                    type="text"
                    ref={inputRefs.current[index]}
                    name="medicineBrandName"
                    autoComplete="off"
                    placeholder="Search or select medicine"
                    value={
                      isEditing ||
                      (!med.medicineBrandName &&
                        !med.medicineComposition &&
                        !med.medicineStrength)
                        ? med.medicineBrandName || ""
                        : `${med.medicineBrandName} - ${med.medicineComposition} - ${med.medicineStrength}`
                    }
                    onChange={(e) => handleInputChange(index, e)}
                    onFocus={() => {
                      setIsEditing(true);
                      fetchRandomSuggestions(index);
                    }}
                    onBlur={() => handleBlur(index)}
                    onKeyDown={(e) => handleSearchDown(index, e)}
                    className="bg-white  w-full h-[3.5rem] outline-none text-sm xlg:text-lg xl:text-xl"
                  />
                  <div className="flex justify-center items-center">
                    <button
                      type="button"
                      className="px-3 h-[2rem] rounded bg-[#f3f3f3] items-center justify-center text-sm text-custom-gray"
                      onClick={() => handleSaveMedication(index)}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {med.showBrandSuggestions &&
                  med.brandSuggestions.length > 0 && (
                    <div className="absolute bg-white w-[90%] z-10 shadow-lg rounded-md max-h-60 overflow-auto">
                      {med.brandSuggestions.map((suggestion, i) => (
                        <div
                          key={i}
                          onMouseDown={() =>
                            handleSelectSuggestion(index, suggestion)
                          }
                          className={`p-2 cursor-pointer hover:bg-gray-100 ${
                            i === activeIndex ? "bg-gray-200" : ""
                          }`}
                        >
                          {suggestion.displayText}
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              <select
                name="dose"
                value={med.dose}
                onChange={(e) => handleInputChange(index, e)}
                className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-[15%]  outline-none text-sm xlg:text-lg xl:text-xl"
              >
                <option value="">Choose Dose</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

              <input
                type="text"
                name="frequency"
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => {
                  const formattedValue = formatFrequency(e.target.value);
                  handleInputChange(index, {
                    target: { name: "frequency", value: formattedValue },
                  });
                }}
                className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-[15%]   outline-none text-sm xlg:text-lg xl:text-xl"
              />
              <select
                name="timing"
                value={med.timing}
                onChange={(e) => handleInputChange(index, e)}
                className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-[20%] outline-none text-sm xlg:text-lg xl:text-xl"
              >
                <option value="">Select Timing</option>
                <option value="After Meal">After Meal</option>
                <option value="Before Meal">Before Meal</option>
              </select>
            </div>
            <div className="flex flex-row xlg:gap-4 gap-2 xl:gap-5">
              <div className="relative w-[30%]">
                <input
                  type="text"
                  name="duration"
                  placeholder="Duration"
                  value={med.duration}
                  onChange={(e) => handleInputChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-full outline-none text-sm xlg:text-lg xl:text-xl"
                />
                {suggestion && (
                  <span
                    className="absolute top-[6px] left-[32px] py-3 px-5 pointer-events-none text-gray-400"
                    style={{
                      display: med.duration ? "inline" : "none",
                      color: "gray",
                    }}
                  >
                    {suggestion.slice(med.duration.length)}
                  </span>
                )}
              </div>
              <input
                type="date"
                name="startFrom"
                placeholder="Start From"
                value={med.startFrom}
                onChange={(e) => handleInputChange(index, e)}
                className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-[20%] outline-none text-sm xlg:text-lg xl:text-xl"
                min={new Date().toISOString().split("T")[0]}
              />
              <input
                type="text"
                name="instructions"
                placeholder="Instructions"
                value={med.instructions}
                onChange={(e) => handleInputChange(index, e)}
                className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-[25%] outline-none text-sm xlg:text-lg xl:text-xl"
              />
              <input
                type="text"
                name="qty"
                placeholder="Qty"
                value={med.qty}
                onChange={(e) => handleInputChange(index, e)}
                className="bg-white rounded xlg:p-4 px-2 xl:px-6 h-[3.5rem] w-[25%] outline-none text-sm xlg:text-lg xl:text-xl"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 w-[10%] justify-between">
            <button
              type="button"
              className="text-[#E40000] inline-flex items-center justify-center bg-white rounded px-4 py-2 h-[3.5rem] text-lg xlg:text-xl w-full "
              onClick={() => handleRemoveField(index)}
              disabled={medications.length === 1}
            >
              <CiCircleMinus />
            </button>
            <button
              type="button"
              className="text-custom-green inline-flex items-center justify-center bg-white rounded px-4 py-2 h-[3.5rem] text-lg xlg:text-xl w-full"
              onClick={handleAddField}
            >
              <CiCirclePlus />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Medications;
