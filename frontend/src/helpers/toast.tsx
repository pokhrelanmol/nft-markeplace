import { toast } from "react-toastify";
interface IParams {
    message: string;
    type: "success" | "error" | "info";
}
export const setNotification = ({ message, type }: IParams) => {
    switch (type) {
        case "success":
            toast.success(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            break;
        case "error":
            toast.error(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            break;

        case "info":
            toast.info(message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });

            break;

        default:
            break;
    }
};
