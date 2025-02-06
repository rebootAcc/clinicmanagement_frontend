import React, { useEffect, useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import axios from "axios";
import DentalChartDesign from "../DentalChartDesign";

const Radiography = ({ onChange, existingData = [] }) => {
  const [fields, setFields] = useState([
    {
      radiographyName: "",
      searchTerm: "",
      searchResults: [],
      showSuggestions: false,
      dentalChart: [],
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDentalChart, setShowDentalChart] = useState(null);

  const handleKeyDown = (e, index) => {
    const { searchResults, showSuggestions } = fields[index];

    if (showSuggestions && searchResults.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < searchResults.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : searchResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && searchResults[activeIndex]) {
          handleSelectSuggestion(searchResults[activeIndex], index);
          setActiveIndex(-1); // Reset after selection
        }
      }
    }
  };

  // Fetch random suggestions when the input is empty
  const fetchRandomSuggestions = async (index) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/radiography/getdropdown/random`,
        { params: { limit: 5 } }
      );
      updateField(index, {
        searchResults: Array.isArray(response.data) ? response.data : [],
        showSuggestions: true,
      });
    } catch (error) {
      console.error("Error fetching random suggestions:", error);
      updateField(index, { searchResults: [] });
    }
  };

  // Fetch suggestions based on search term
  const fetchSuggestions = async (index) => {
    const searchTerm = fields[index].searchTerm;
    if (searchTerm) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/radiography/getdropdown`,
          { params: { query: searchTerm } }
        );
        updateField(index, {
          searchResults: Array.isArray(response.data) ? response.data : [],
        });
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        updateField(index, { searchResults: [] });
      }
    }
  };

  useEffect(() => {
    // Only set fields if `existingData` has values and fields have not been set from existing data
    if (
      Array.isArray(existingData) &&
      existingData.length > 0 &&
      existingData.some((examination) => examination.radiographyName) &&
      fields[0].radiographyName === ""
    ) {
      const initialFields = existingData.map((radiography) => ({
        radiographyName: radiography.radiographyName || "",
        searchTerm: radiography.radiographyName || "",
        searchResults: [],
        dentalChart: radiography.dentalChart || [],
        showSuggestions: false,
      }));
      setFields(initialFields);
    }
  }, [existingData]);

  useEffect(() => {
    if (typeof onChange === "function") {
      const filteredData = fields.map((field) => ({
        radiographyName: field.radiographyName,
        dentalChart: field.dentalChart || [],
      }));
      onChange(filteredData);
    }
  }, [fields]);

  // Update field based on index and changes
  const updateField = (index, updates) => {
    setFields((prevFields) => {
      const updatedFields = prevFields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      );

      onChange(updatedFields);
      return updatedFields;
    });
  };

  const handleDentalChart = (index) => {
    setShowDentalChart(index);
  };

  const addDentalChartSelection = (selectedValues, index) => {
    setFields((prevFields) => {
      const updatedFields = prevFields.map((field, i) =>
        i === index ? { ...field, dentalChart: [...selectedValues] } : field
      );
      onChange(updatedFields);
      return updatedFields;
    });
    setShowDentalChart(null);
  };

  // Handle adding new radiography entry
  const handleAddRadiography = async (index) => {
    const { searchTerm } = fields[index];
    const existing = fields.some(
      (field) => field.radiographyName === searchTerm
    );
    if (existing) {
      alert("Radiography entry already exists.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/radiography/create`,
        { radiographyName: searchTerm }
      );

      if (response.status === 201) {
        alert("Radiography Entry Created Successfully");
      }
    } catch (error) {
      console.error("Error creating radiography entry:", error);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (selectedItem, index) => {
    updateField(index, {
      radiographyName: selectedItem.radiographyName,
      searchTerm: selectedItem.radiographyName,
      searchResults: [],
      showSuggestions: false,
    });
  };

  // Add a new input field for radiography
  const addField = () => {
    setFields([
      ...fields,
      {
        radiographyName: "",
        searchTerm: "",
        searchResults: [],
        showSuggestions: false,
        dentalChart: [],
      },
    ]);
  };

  // Remove an input field for radiography
  const removeField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-5 pb-2 xlg:pb-4 border-b border-[#00000033]">
        <h3 className="text-black text-base lg:text-lg xl:text-xl min-w-[26.4vmax]">
          Radiography
        </h3>
      </div>
      <div className="pt-4">
        {fields.map((field, index) => (
          <div key={index} className="flex gap-5 py-1">
            <div className="flex flex-col gap-2 w-full relative">
              <div className="bg-white flex px-4 xl:px-6 py-3 xl:py-4 rounded gap-2">
                <input
                  type="text"
                  name="searchTerm"
                  autoComplete="off"
                  placeholder="Radiography Name"
                  className="bg-transparent outline-none text-lg xl:text-xl placeholder:text-[#d5d5d5] w-full"
                  value={field.searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateField(index, { searchTerm: value });

                    if (value.trim()) {
                      fetchSuggestions(index);
                    } else {
                      fetchRandomSuggestions(index);
                    }
                  }}
                  onFocus={() => {
                    if (!field.searchTerm) fetchRandomSuggestions(index);
                    updateField(index, { showSuggestions: true });
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (
                        fields[index].searchTerm.trim() &&
                        !fields[index].radiographyName
                      ) {
                        updateField(index, {
                          radiographyName: fields[index].searchTerm.trim(),
                          showSuggestions: false,
                        });
                      } else {
                        updateField(index, { showSuggestions: false });
                      }
                    }, 150);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-[#f3f3f3] items-center justify-center text-sm text-custom-gray"
                  onClick={() => handleAddRadiography(index)}
                >
                  Add
                </button>
              </div>

              {field.showSuggestions && field.searchResults.length > 0 && (
                <div className="absolute top-[4rem] bg-white w-full z-10 shadow-lg rounded-md">
                  {field.searchResults.map((item, idx) => (
                    <div
                      key={idx}
                      onMouseDown={() => handleSelectSuggestion(item, index)}
                      className={`p-2 cursor-pointer hover:bg-gray-100 ${
                        idx === activeIndex ? "bg-gray-200" : ""
                      }`}
                    >
                      {item.radiographyName}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {field.dentalChart.length > 0 && (
              <div className="xlg:text-sm text-xs text-gray-500 mt-2">
                Selected Dental Chart: {field.dentalChart.join(", ")}
              </div>
            )}
            <button
              type="button"
              onClick={() => handleDentalChart(index)}
              className="text-custom-gray inline-flex items-center gap-2 justify-center bg-white rounded px-4 py-2 text-base"
            >
              <CiCirclePlus className="text-xl font-bold" /> DC
            </button>

            <div className="flex flex-col gap-5 flex-1">
              <div className="flex flex-row gap-2 justify-between flex-1">
                <button
                  type="button"
                  className="text-custom-green inline-flex items-center justify-center bg-white rounded px-4 py-2 text-base"
                  onClick={addField}
                >
                  <CiCirclePlus />
                </button>
                <button
                  type="button"
                  className="text-[#E40000] inline-flex items-center justify-center bg-white rounded px-4 py-2 text-base"
                  onClick={() => removeField(index)}
                  disabled={fields.length === 1}
                >
                  <CiCircleMinus />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div
        className={`fixed top-0 right-0 h-screen w-[90%] lg:w-[80%] xl:w-[50%] overflow-scroll z-[100] custom-scroll  bg-[#EDF4F7] shadow-lg transform transition-transform duration-300 ease-in-out ${
          showDentalChart !== null ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {showDentalChart !== null && (
          <DentalChartDesign
            handleClose={() => setShowDentalChart(null)}
            onSelect={(selectedValues) =>
              addDentalChartSelection(selectedValues, showDentalChart)
            }
            selectedValues={fields[showDentalChart]?.dentalChart || []} // Pass current selections
          />
        )}
      </div>
    </div>
  );
};

export default Radiography;
