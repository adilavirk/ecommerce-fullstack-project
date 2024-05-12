import React from "react";

const SelectComponent = ({ label, value, onChange, options = [] }) => {
    return (
        <div className="relative ">
            <p
                htmlFor={label}
                className=" absolute pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-white"
            >
                {label}
            </p>
            <select
                value={value}
                onChange={onChange}
                className="border placeholder-gray-400 focus:outline-none focus:border-black w-full
                p-4 m-0 text-base block bg-white  border-gray-300 rounded-md"
            >
                {options && options.length ? (
                    options.map((optionItem) => (
                        <option
                            id={optionItem.id}
                            key={optionItem.id}
                            value={optionItem.id}
                        >
                            {optionItem.label}
                        </option>
                    ))
                ) : (
                    <option id="" value="">
                        Select
                    </option>
                )}
            </select>
        </div>
    );
};

export default SelectComponent;
