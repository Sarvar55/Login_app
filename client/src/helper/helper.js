/**Make API Request  */
import axios from "axios";
import jwt_decode from "jwt-decode";
axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/**to get username from token */
export async function getUsername() {
    const token = localStorage.getItem("token");
    if (!token) return Promise.reject("Token not found ");
    let decode = jwt_decode(token);
    return decode;
}

export async function authenticate(username) {
    try {
        return await axios.post("/api/authenticate", { username });
    } catch (error) {
        return { error: "username does not exist" };
    }
}

/**get User details */
export async function getUser({ username }) {
    try {
        const { data } = await axios.get(`/api/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "Password does not match " };
    }
}

/**register user  */

export async function registerUser(credentials) {
    try {
        const {
            data: { message },
            status,
        } = await axios.post(`/api/register`, credentials);

        let { username, email } = credentials;
        if (status === 201) {
            await axios.post("/api/registerMail", {
                username,
                userEmail: email,
                text: message,
            });
        }
        return Promise.resolve(message);
    } catch (error) {
        return Promise.reject({ error });
    }
}

/**login function*/
export async function verifyPassword({ username, password }) {
    try {
        if (username) {
            const { data } = await axios.post("/api/login", { username, password });
            return Promise.resolve(data);
        }
    } catch (error) {
        return Promise.reject({ error });
    }
}

/**update user function */

export async function updateUser(response) {
    try {
        const token = await localStorage.getItem("token");
        const data = await axios.put("/api/updateUser", response, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return Promise.resolve({ data });
    } catch (error) {
        return Promise.reject({ error });
    }
}

/**generate OTP */
export async function generateOTP(username) {
    try {
        const {
            data: { code },
            status,
        } = await axios.get("/api/generateOTP", { params: { username } });
        //send email with otp
        if (status === 201) {
            let {
                data: { email },
            } = await getUser(username);
            let text = `Your Password Recovery OTP is ${code}.Verify and recover your password`;
            axios.post("/api/registerMail", {
                username,
                userEmail: email,
                text,
                subject: "Password Recovery OTP",
            });
        }
        return Promise.resolve({ code });
    } catch (error) {
        return Promise.reject({ error });
    }
}

/**verify otp */

export async function verifyOTP({ username, code }) {
    try {
        const { data, status } = await axios.get("/api/verifyOTP", {
            params: { username, code },
        });
        return { data, status };
    } catch (error) {
        return Promise.reject({ error });
    }
}

/**reset password */
export async function resetPassword({ username, password }) {
    try {
        const { data, status } = await axios.put("/api/resetPassword", {
            username,
            password,
        });
        return Promise.resolve({ data, status });
    } catch (error) {
        return Promise.reject({ error });
    }
}