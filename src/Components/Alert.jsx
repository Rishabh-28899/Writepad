import Swal from "sweetalert2";

export const showAlert = (title, text, icon = "success") => {
    return Swal.fire({
        title,
        text,
        icon,
        confirmButtonText: "OK"
    });
};