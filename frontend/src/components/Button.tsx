import React from "react";
type ButtonType = "success" | "primary" | "danger" | "dark";
interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    buttonType?: ButtonType;
    disable?: boolean;
}
const Button = ({ children, onClick, buttonType, disable }: ButtonProps) => {
    const color =
        buttonType === "success"
            ? "bg-green-700 hover:bg-green-800 focus:ring-green-300"
            : buttonType === "primary"
            ? "bg-blue-700 hover:bg-blue-800 focus:ring-blue-300"
            : buttonType === "danger"
            ? "bg-red-700 hover:bg-red-800 focus:ring-red-300"
            : buttonType === "dark"
            ? "bg-gray-700 hover:bg-gray-800 focus:ring-gray-300"
            : "bg-indigo-700 hover:bg-indigo-800 focus:ring-indigo-300";
    return (
        <button
            disabled={disable}
            type="button"
            onClick={onClick}
            className={`text-white ${color} hover:${color} font-medium focus:ring-4  rounded-lg text-sm px-5 py-2.5 text-center  `}
        >
            {children}
        </button>
    );
};

export default Button;
