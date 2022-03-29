import React, { useState } from "react";
type InputProps = {
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    placeholder: string;
    type: string;
    name: string;
    value?: string | number;
};

const Input = ({
    handleChange,
    placeholder,
    type,
    name,
    value,
}: InputProps) => {
    if (type === "textarea") {
        return (
            <textarea
                className="border w-96 p-2"
                name={name}
                value={value}
                cols={30}
                rows={5}
                onChange={handleChange}
                placeholder={placeholder}
            ></textarea>
        );
    } else {
        return (
            <input
                className="border p-2 w-96"
                onChange={handleChange}
                placeholder={placeholder}
                type={type}
                name={name}
                value={value}
            ></input>
        );
    }
};

export default Input;
