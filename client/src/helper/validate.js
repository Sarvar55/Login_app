import toast from "react-hot-toast";
import { authenticate } from "./helper";

//

export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    if (values.username) {
        //check user exist or not
        const { status } = await authenticate(values.username);

        if (status !== 200) {
            errors.exist = toast.error("User does not exist");
        }
    }

    return errors;
}

const passwordVerify = (errors = {}, values) => {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (!values.password) {
        errors.password = toast.error("Password must be provided");
    } else if (values.password.includes(" ")) {
        errors.password = toast.error("Invalid Password");
    } else if (values.password.length < 4) {
        errors.password = toast.error("Password must be at least 4 characters");
    } else if (specialChars.test(values.password)) {
        errors.password = toast.error("Password must be special characters");
    }
    return errors;
};

export const resetPasswordValidation = (values) => {
    const errors = passwordVerify({}, values);
    if (values.password !== values.confirm_pwd)
        errors.exist = toast.error("Password not match...");

    return errors;
};

export const passwordValidate = (values) => {
    return passwordVerify({}, values);
};

const usernameVerify = (error = {}, values) => {
    if (!values.username) {
        error.username = toast.error("Username is required");
    } else if (values.username.includes(" ")) {
        error.username = toast.error("Invalid Username ");
    }

    return error;
};

export const registerValidation = (values) => {
    const errors = usernameVerify({}, values);
    passwordVerify(errors, values);

    emailVerify(errors, values);

    return errors;
};

/**validate profile page */
export const profileValidate = (values) => {
    return emailVerify({}, values);
};

/** validate email */
function emailVerify(error = {}, values) {
    if (!values.email) {
        error.email = toast.error("Email Required...!");
    } else if (values.email.includes(" ")) {
        error.email = toast.error("Wrong Email...!");
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        error.email = toast.error("Invalid email address...!");
    }

    return error;
}