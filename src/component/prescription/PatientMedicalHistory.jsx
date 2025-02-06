import React, { useState, useEffect, useRef } from "react";
import { CiCirclePlus } from "react-icons/ci";
import axios from "axios";

const PatientMedicalHistory = ({ patientId, onMedicalHistoryChange }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [currentInput, setCurrentInput] = useState({
    patientMedicalHistoryName: "",
    duration: "",
    medicines: [],
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestion, setSuggestion] = useState("");
  const inputRef = useRef(null);
  const medicineInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const medicineDropdownRef = useRef(null);
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [showMedicineSuggestions, setShowMedicineSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const fetchPatientMedicalHistory = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/patients/get/${patientId}`
        );
        if (response.data.medicalHistory) {
          setMedicalHistory(
            response.data.medicalHistory.map((item) => ({
              ...item,
              checked: true, // Set checked to true for existing data
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching patient's medical history:", error);
      }
    };

    fetchPatientMedicalHistory();
  }, [patientId]);

  const suggestDuration = (input) => {
    input = input.toLowerCase();
    if (input.endsWith("d")) return `${input.replace(/\D/g, "")} Days`;
    if (input.endsWith("m")) return `${input.replace(/\D/g, "")} Months`;
    if (input.endsWith("y")) return `${input.replace(/\D/g, "")} Years`;
    if (/^\d+$/.test(input)) return `${input} Days`;
    return "";
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "patientMedicalHistoryName") {
      setCurrentInput((prevInput) => ({
        ...prevInput,
        [name]: value,
      }));

      if (value) {
        fetchSearchSuggestions(value);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
        setShowMedicineSuggestions(false); // Hide medicine dropdown if name is cleared
      }
    } else if (name === "duration") {
      setCurrentInput((prevInput) => ({
        ...prevInput,
        duration: value,
      }));
      setSuggestion(suggestDuration(value));
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Tab" && suggestion) {
      // Accept suggestion on Tab
      event.preventDefault();
      setCurrentInput((prev) => ({
        ...prev,
        duration: suggestion,
      }));
      setSuggestion("");
    }
  };

  // Fetch random suggestions when input is focused
  const fetchRandomSuggestions = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patientmedicalhistory/getdropdown/random`,
        { params: { limit: 5 } }
      );
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching random suggestions:", error);
    }
  };

  // Fetch search suggestions as user types
  const fetchSearchSuggestions = async (query) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patientmedicalhistory/getdropdown`,
        { params: { query } }
      );
      setSuggestions(response.data || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    }
  };

  const handleSearchDown = (e) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[activeIndex]);
        setActiveIndex(-1); // Reset active index after selection
      }
    }
  };

  // Add new medical history item
  const handleAddHistory = async () => {
    const { patientMedicalHistoryName, duration, medicines } = currentInput;

    if (!patientMedicalHistoryName) return;

    try {
      // Check if the medical history item already exists
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patientmedicalhistory/getdropdown`,
        { params: { query: patientMedicalHistoryName } }
      );

      const itemExists = response.data.some(
        (item) =>
          item.patientMedicalHistoryName.toLowerCase() ===
          patientMedicalHistoryName.toLowerCase()
      );

      if (itemExists) {
        // Update existing item if it matches
        await axios.put(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/patientmedicalhistory/update/${patientMedicalHistoryName}`,
          { patientMedicalHistoryMedicine: medicines }
        );
      } else {
        // Create a new entry if it does not exist
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/patientmedicalhistory/create`,
          {
            patientMedicalHistoryName,
            patientMedicalHistoryMedicine: medicines,
          }
        );
      }

      // Update the frontend state
      setMedicalHistory((prev) => [
        ...prev,
        {
          medicalHistoryName: patientMedicalHistoryName,
          duration: duration || "",
          medicalHistoryMedicine: medicines.length ? medicines : [],
          checked: true,
        },
      ]);

      // Notify parent component of changes if using a callback
      if (onMedicalHistoryChange) {
        onMedicalHistoryChange([
          ...medicalHistory,
          {
            medicalHistoryName: patientMedicalHistoryName,
            duration: duration || "",
            medicalHistoryMedicine: medicines.length ? medicines : [],
            checked: true,
          },
        ]);
      }

      // Clear the input fields after adding
      setCurrentInput({
        patientMedicalHistoryName: "",
        duration: "",
        medicines: [],
      });
    } catch (error) {
      console.error("Error handling medical history:", error);
    }
  };

  const fetchMedicineSuggestions = async (
    patientMedicalHistoryName,
    search = ""
  ) => {
    if (!patientMedicalHistoryName) {
      setShowMedicineSuggestions(false);
      return;
    }

    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/patientmedicalhistory/getMedicinesByHistoryName`,
        { params: { patientMedicalHistoryName, search } }
      );
      setMedicineSuggestions(response.data.medicines || []);
      setShowMedicineSuggestions(true);
    } catch (error) {
      console.error("Error fetching medicine suggestions:", error);
      setMedicineSuggestions([]);
    }
  };
  // Handle selection from suggestions
  const handleSelectSuggestion = (suggestion) => {
    if (!suggestion || !suggestion.patientMedicalHistoryName) {
      console.warn("Invalid suggestion:", suggestion);
      return;
    }

    setCurrentInput({
      patientMedicalHistoryName: suggestion.patientMedicalHistoryName,
      duration: "",
      medicines: [],
    });

    setShowSuggestions(false);

    fetchMedicineSuggestions(suggestion.patientMedicalHistoryName);
  };

  const handleMedicineInputChange = async (event) => {
    const searchQuery = event.target.value;
    setCurrentInput((prev) => ({
      ...prev,
      medicineSearch: searchQuery,
    }));

    if (currentInput.patientMedicalHistoryName) {
      fetchMedicineSuggestions(
        currentInput.patientMedicalHistoryName,
        searchQuery
      );
    }
  };

  const handleMedicineSelect = (medicine) => {
    if (!currentInput.medicines.includes(medicine)) {
      setCurrentInput((prev) => ({
        ...prev,
        medicines: [...prev.medicines, medicine],
        medicineSearch: "",
      }));
    }
    setShowMedicineSuggestions(false);
  };

  const handleMedicineRemove = (medicine) => {
    setCurrentInput((prev) => ({
      ...prev,
      medicines: prev.medicines.filter((m) => m !== medicine),
    }));
  };

  const handleMedicineKeyPress = (event) => {
    if (
      event.key === "ArrowDown" &&
      showMedicineSuggestions &&
      medicineSuggestions.length > 0
    ) {
      event.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex < medicineSuggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (
      event.key === "ArrowUp" &&
      showMedicineSuggestions &&
      medicineSuggestions.length > 0
    ) {
      event.preventDefault();
      setActiveIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : medicineSuggestions.length - 1
      );
    } else if (event.key === "Enter") {
      event.preventDefault();

      if (activeIndex >= 0 && medicineSuggestions[activeIndex]) {
        const selectedMedicine = medicineSuggestions[activeIndex];
        if (!currentInput.medicines.includes(selectedMedicine)) {
          setCurrentInput((prev) => ({
            ...prev,
            medicines: [...prev.medicines, selectedMedicine],
            medicineSearch: "",
          }));
        }
      } else if (event.target.value.trim()) {
        const newMedicine = event.target.value.trim();
        if (!currentInput.medicines.includes(newMedicine)) {
          setCurrentInput((prev) => ({
            ...prev,
            medicines: [...prev.medicines, newMedicine],
            medicineSearch: "",
          }));
        }
      }

      event.target.value = "";
    }
  };

  // Toggle checkbox
  const toggleCheckbox = (id) => {
    const updatedHistory = medicalHistory.map((entry) =>
      entry._id === id ? { ...entry, checked: !entry.checked } : entry
    );

    setMedicalHistory(updatedHistory);

    onMedicalHistoryChange(updatedHistory);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }

      if (
        medicineDropdownRef.current &&
        !medicineDropdownRef.current.contains(event.target) &&
        medicineInputRef.current &&
        !medicineInputRef.current.contains(event.target)
      ) {
        setShowMedicineSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="pb-2 xlg:pb-4 border-b text-lg xl:text-xl border-[#00000033]">
        <label
          htmlFor=""
          className="text-black text-base lg:text-lg xl:text-xl min-w-[26.4vmax]"
        >
          Medical History
        </label>
      </div>
      <div className="py-2 grid grid-cols-3 gap-3">
        {medicalHistory.map((data, index) => (
          <div className="flex gap-2 items-center" key={`${data._id}-${index}`}>
            <input
              type="checkbox"
              id={`checkbox-${data._id}-${index}`}
              checked={data.checked}
              onChange={() => toggleCheckbox(data._id)}
              className="size-4 accent-custom-gray cursor-pointer"
            />
            <label
              htmlFor={`checkbox-${data._id}-${index}`}
              className="whitespace-nowrap text-sm xl:text-base text-custom-gray cursor-pointer"
            >
              {data.medicalHistoryName}
            </label>
            {data.duration && (
              <span className="text-[#bcbcbc] text-sm py-1 px-3 rounded bg-white whitespace-nowrap">
                {data.duration}
              </span>
            )}
            {data.medicalHistoryMedicine &&
              data.medicalHistoryMedicine.length > 0 && (
                <span className="text-[#bcbcbc] text-sm py-1 px-3 rounded bg-white whitespace-nowrap">
                  {data.medicalHistoryMedicine.join(", ")}
                </span>
              )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 pb-9 relative">
        <div className="relative flex flex-col rounded min-w-[20.4vmax]">
          <input
            type="text"
            ref={inputRef}
            autoComplete="off"
            name="patientMedicalHistoryName"
            placeholder="Medical History"
            value={currentInput.patientMedicalHistoryName}
            onChange={handleInputChange}
            onFocus={fetchRandomSuggestions}
            onKeyDown={handleSearchDown}
            className="p-3 h-[4rem] bg-white rounded outline-none"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div
              ref={dropdownRef}
              className="absolute top-12 left-0 bg-white border border-gray-300 shadow-lg rounded w-full z-50"
            >
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    idx === activeIndex ? "bg-gray-200" : ""
                  }`}
                >
                  {suggestion.patientMedicalHistoryName}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <input
            type="text"
            name="duration"
            autoComplete="off"
            placeholder="2 Months"
            value={currentInput.duration}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="p-3 h-[4rem] bg-white rounded outline-none w-full"
          />
          {suggestion && (
            <span
              className="absolute top-0 left-[26px] py-3 px-5 pointer-events-none text-gray-400"
              style={{
                display: currentInput.duration ? "inline" : "none",
                color: "gray",
              }}
            >
              {suggestion.slice(currentInput.duration.length)}
            </span>
          )}
        </div>
        <div className="relative">
          <div className="bg-white flex flex-wrap items-center gap-2  rounded">
            {currentInput.medicines.map((medicine, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded bg-[#f3f3f3] text-sm text-custom-gray flex items-center gap-2"
              >
                {medicine}
                <button
                  type="button"
                  className="text-custom-orange"
                  onClick={() => handleMedicineRemove(medicine)}
                >
                  x
                </button>
              </span>
            ))}
            <input
              type="text"
              ref={medicineInputRef}
              placeholder="Add Medicine"
              autoComplete="off"
              value={currentInput.medicineSearch || ""}
              onChange={handleMedicineInputChange}
              onKeyDown={(e) => handleMedicineKeyPress(e)}
              onFocus={() => setShowMedicineSuggestions(true)}
              className="outline-none text-sm text-gray-600 w-full h-[4rem] p-3"
            />
          </div>
          {showMedicineSuggestions && medicineSuggestions.length > 0 && (
            <div
              ref={medicineDropdownRef}
              className="absolute top-full mt-1 bg-white w-full shadow-lg rounded-md z-10"
            >
              {medicineSuggestions.map((medicine, idx) => (
                <div
                  key={idx}
                  onClick={() => handleMedicineSelect(medicine)}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    idx === activeIndex ? "bg-gray-200" : ""
                  }`}
                >
                  {medicine}
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddHistory}
          className="h-[4rem] flex px-4 gap-2 items-center text-base text-custom-gray bg-white rounded"
        >
          <CiCirclePlus />
          Add More
        </button>
      </div>
    </div>
  );
};

export default PatientMedicalHistory;
