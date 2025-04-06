import React, { useEffect, useRef, useState } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { toTitleCase } from "../../utils";

function Dropdown({ options, handleSelection, initialOption, disabled }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const dropdownRef = useRef(null);

  const handleSelectOption = (option) => {
    if (disabled) return;
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
        disabled={disabled}
        onClick={() => {
          if (!disabled) setDropdownOpen((prev) => !prev);
        }}
        className={`shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none flex items-center justify-between
          ${
            disabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "text-gray-700 focus:shadow-outline"
          }`}
      >
        {/* Show "Select Category" if no category is selected */}
        <span>{toTitleCase(selectedOption) || initialOption}</span>

        <span className="ml-2">
          {dropdownOpen ? <FaCaretUp /> : <FaCaretDown />}
        </span>
      </button>
      <div
        className={`absolute mt-2 bg-white shadow-lg rounded w-full z-10 transition-all duration-300 ease-in-out overflow-hidden ${
          dropdownOpen && !disabled ? "max-h-60" : "max-h-0"
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
