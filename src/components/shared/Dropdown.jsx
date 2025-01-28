import React, { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { toTitleCase } from "../../utils";

function Dropdown({ options,  handleSelection, initialOption }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const handleSelectOption = (option) => {
    handleSelection(option);
    setSelectedOption(option?.label);
    setDropdownOpen(false); // Close dropdown after selection
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false); // Close dropdown if clicked outside
      }
    };

    // Attach event listener to detect clicks outside
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline flex items-center justify-between"
      >
        {/* Show "Select Category" if no category is selected */}
        <span>{toTitleCase(selectedOption) || initialOption}</span>

        <span className="ml-2">
          {dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
        </span>
      </button>
      <div
        className={`absolute mt-2 bg-white shadow-lg rounded w-full z-10 transition-all duration-300 ease-in-out overflow-hidden ${
          dropdownOpen ? "max-h-60" : "max-h-0"
        }`}
      >
        <ul className="max-h-60 overflow-y-auto">
          {options?.map((option) => (
            <li
              key={option?.value}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectOption(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Dropdown;
