import React, { useEffect, useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import axios from "axios";

const Investigation = ({ onChange, existingData = [] }) => {
  const [fields, setFields] = useState([
    {
      investigationName: "",
      searchTerm: "",
      searchResults: [],
      showSuggestions: false,
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(-1);

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
        `${import.meta.env.VITE_BASE_URL}/api/investigation/getdropdown/random`,
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
          `${import.meta.env.VITE_BASE_URL}/api/investigation/getdropdown`,
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
    // Only set fields if `existingData` has valid values and fields have not been set from existing data
    if (
      Array.isArray(existingData) &&
      existingData.length > 0 &&
      existingData.some((item) => item.investigationName) &&
      fields[0].investigationName === ""
    ) {
      const initialFields = existingData.map((investigation) => ({
        investigationName: investigation.investigationName || "",
        searchTerm: investigation.investigationName || "",
        searchResults: [],
        showSuggestions: false,
      }));

      setFields(initialFields);
    }
  }, [existingData]);

  useEffect(() => {
    if (typeof onChange === "function") {
      const filteredData = fields.map((field) => ({
        investigationName: field.investigationName,
      }));
      onChange(filteredData);
    }
  }, [fields]);

  // Update field based on index and changes
  const updateField = (index, updates) => {
    setFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      )
    );
  };

  // Handle adding new investigation
  const handleAddInvestigation = async (index) => {
    const { searchTerm } = fields[index];
    const existing = fields.some(
      (field) => field.investigationName === searchTerm
    );
    if (existing) {
      alert("Investigation already exists.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/investigation/create`,
        { investigationName: searchTerm }
      );

      if (response.status === 201) {
        alert("Investigation Created Successfully");
      }
    } catch (error) {
      console.error("Error creating Investigation:", error);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = (selectedItem, index) => {
    updateField(index, {
      investigationName: selectedItem.investigationName,
      searchTerm: selectedItem.investigationName,
      searchResults: [],
      showSuggestions: false,
    });
  };

  // Add a new input field for investigation
  const addField = () => {
    setFields([
      ...fields,
      {
        investigationName: "",
        searchTerm: "",
        searchResults: [],
        showSuggestions: false,
      },
    ]);
  };

  // Remove an input field for investigation
  const removeField = (index) => {
    if (fields.length > 1) {
      setFields(fields.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-5 pb-2 xlg:pb-4 border-b border-[#00000033]">
        <h3 className="text-black text-base lg:text-lg xl:text-xl min-w-[26.4vmax]">
          Investigations
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
                  placeholder="Investigation"
                  className="bg-transparent outline-none text-lg xl:text-xl placeholder:text-[#d5d5d5] w-full"
                  value={field.searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateField(index, { searchTerm: value });

                    if (value.trim()) {
                      fetchSuggestions(index); // Fetch specific suggestions
                    } else {
                      fetchRandomSuggestions(index); // Show random suggestions if input is empty
                    }
                  }}
                  onFocus={() => {
                    if (!field.searchTerm) fetchRandomSuggestions(index); // Show random suggestions on focus if input is empty
                    updateField(index, { showSuggestions: true });
                  }}
                  onBlur={() =>
                    setTimeout(
                      () => updateField(index, { showSuggestions: false }),
                      150
                    )
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
                <button
                  type="button"
                  className="px-3 py-1 rounded bg-[#f3f3f3] items-center justify-center text-sm text-custom-gray"
                  onClick={() => handleAddInvestigation(index)}
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
                      {item.investigationName}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
    </div>
  );
};

export default Investigation;
