import React, { useCallback, useEffect, useState } from "react";
import { CiCirclePlus, CiCircleMinus } from "react-icons/ci";
import axios from "axios";
import DentalChartDesign from "../DentalChartDesign";

const useDebounce = (callback, delay) => {
  const debounceCallback = useCallback(debounce(callback, delay), [
    callback,
    delay,
  ]);

  return debounceCallback;
};

const Advices = ({ onChange, existingAdvices = [] }) => {
  const [fields, setFields] = useState([
    {
      advicesName: "",
      searchTerm: "",
      searchResults: [],
      showSuggestions: false,
      dentalChart: [],
    },
  ]);

  const [activeIndex, setActiveIndex] = useState(-1);
  const [showDentalChart, setShowDentalChart] = useState(null);

  const handleKeyDown = (e, index) => {
    if (fields[index].searchResults.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex < fields[index].searchResults.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : fields[index].searchResults.length - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex >= 0 && fields[index].searchResults[activeIndex]) {
          const selected = fields[index].searchResults[activeIndex];
          handleSelectSuggestion(selected, index); // Select suggestion
          setActiveIndex(-1); // Reset index
        }
      }
    }
  };

  const fetchRandomSuggestions = async (index) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/advices/getdropdown/random`,
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

  const fetchSuggestions = useDebounce(async (index) => {
    const searchTerm = fields[index].searchTerm;
    if (searchTerm) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/advices/getdropdown`,
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
  }, 300);

  useEffect(() => {
    if (
      Array.isArray(existingAdvices) &&
      existingAdvices.length > 0 &&
      existingAdvices.some((advice) => advice.advicesName) &&
      fields[0].advicesName === ""
    ) {
      setFields(
        existingAdvices.map((advice) => ({
          advicesName: advice.advicesName,
          searchTerm: advice.advicesName,
          searchResults: [],
          showSuggestions: false,
          dentalChart: advice.dentalChart || [],
        }))
      );
    }
  }, [existingAdvices]);

  const updateField = (index, updates) => {
    setFields((prevFields) => {
      const updatedFields = prevFields.map((field, i) =>
        i === index ? { ...field, ...updates } : field
      );

      onChange(updatedFields);
      return updatedFields;
    });
  };

  const handleAddAdvice = async (index) => {
    const { searchTerm } = fields[index];
    const existing = fields.some((field) => field.advicesName === searchTerm);
    if (existing) {
      alert("Advice already exists.");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/advices/create`,
        { advicesName: searchTerm }
      );

      if (response.status === 201) {
        alert("Advice Created Successfully");
      }
    } catch (error) {
      console.error("Error creating Advice:", error);
    }
  };

  const handleSelectSuggestion = (selectedItem, index) => {
    updateField(index, {
      advicesName: selectedItem.advicesName,
      searchTerm: selectedItem.advicesName,
      searchResults: [],
      showSuggestions: false,
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

  const addField = () => {
    setFields([
      ...fields,
      {
        advicesName: "",
        searchTerm: "",
        searchResults: [],
        showSuggestions: false,
        dentalChart: [],
      },
    ]);
  };

  const removeField = (index) => {
    if (fields.length > 1) {
      const updatedFields = fields.filter((_, i) => i !== index);
      setFields(updatedFields);

      onChange(updatedFields);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex gap-5 pb-2 xlg:pb-4 border-b border-[#00000033]">
        <h3 className="text-black text-base lg:text-lg xl:text-xl min-w-[26.4vmax]">
          Advices
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
                  placeholder="Advice"
                  className="bg-transparent outline-none text-lg xl:text-xl placeholder:text-[#d5d5d5] w-full"
                  value={field.searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    updateField(index, { searchTerm: value });

                    fetchSuggestions(index);
                  }}
                  onFocus={() => {
                    if (!field.searchTerm) fetchRandomSuggestions(index);
                    updateField(index, { showSuggestions: true });
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      if (
                        fields[index].searchTerm.trim() &&
                        !fields[index].advicesName
                      ) {
                        updateField(index, {
                          advicesName: fields[index].searchTerm.trim(),
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
                  onClick={() => handleAddAdvice(index)}
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
                      {item.advicesName}
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
            selectedValues={fields[showDentalChart]?.dentalChart || []}
          />
        )}
      </div>
    </div>
  );
};

export default Advices;

function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
