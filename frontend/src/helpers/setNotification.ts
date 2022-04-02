import { toast } from "react-toastify";
import React from "react";
interface IParams {
    message: string;
    type: "success" | "error" | "info";
}
export const setNotification = ({ message, type }: IParams) => {
    toast(message, {
        type: type,
        theme: "colored",
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        progress: undefined,
    });
};
