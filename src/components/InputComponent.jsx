"use client";
import React, { useEffect } from "react";

const InputComponent = ({ label, placeholder, type, value, onChange }) => {
  useEffect(() => {
    // Clear input value when component mounts
    const input = document.getElementById(label);
    if (input) {
      input.value = "";
    }
  }, []);

  return (
    <div className="relative">
      <label
        htmlFor={label}
        className="absolute pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white"
      >
        {label}
      </label>
      <input
        id={label}
        placeholder={placeholder}
        type={type || "text"}
        value={value}
        onChange={onChange}
        autoComplete="off" // Add autoComplete attribute to disable autofill
        className="border placeholder-gray-400 focus:outline-none focus:border-black w-full
                   p-4 m-0 text-base block bg-white border-gray-300 rounded-md"
      />
    </div>
  );
};

export default InputComponent;
