import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/user.png";
import styles from "../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import useFetch from "../hooks/fetch.hook";
import { useAuthStore } from "../store/store";
import { verifyPassword } from "../helper/helper";
function Password() {
  const { username } = useAuthStore((state) => state.auth.username);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      let loginPromise = verifyPassword({
        username,
        password: values.password,
      });
      toast.promise(loginPromise, {
        loading: "Checking...",
        success: <b>Login Succesfully...</b>,
        error: <b>Login Failed</b>,
      });
      loginPromise.then((res) => {
        const { token } = res.data;
        localStorage.setItem("token", token);
        navigate("/navigate");
      });
    },
  });
  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-2xl text-red-600">{serverError.message}</h1>;
  return (
    <div className="containet mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>
      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Hello {apiData?.firstName || apiData?.username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-200">
              Explore more by connecting with us
            </span>
          </div>
          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                className={styles.profile_img}
                alt="avatar"
              />
            </div>
            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                type="text"
                className="p-3 outline-none rounded-sm w-[50%]"
                placeholder="Username"
              />
              <button type="submit" className={styles.btn}>
                Sign in
              </button>
            </div>
            <div className="text-center py-4">
              <span className="text-gray-500">
                Forgot Password
                <Link to="/recovery" className="text-red-600">
                  <span></span> Recovery Now
                </Link>{" "}
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Password;
