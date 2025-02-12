import React from "react";

const GenericInput = ({ label, labelClass='flex text-sm text-left font-medium text-black', type, required=false, onChange, placeholder="", multiple=false, className='block w-full rounded-md bg-white px-3 py-1.5 text-base text-black outline outline-1 -outline-offset-1 outline-customGray-light placeholder:text-customGray-light focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-customOrange-dark sm:text-sm' }) => {

    return (
        <>
        <label className={labelClass}>
            { label }
        </label>
        <div className="mt-2">
            <input
                type={type}
                required={required}
                onChange={onChange}
                placeholder={placeholder}
                multiple={multiple}
                className={className}
                >
            </input>
        </div>
        </>
    );
}

export default GenericInput;