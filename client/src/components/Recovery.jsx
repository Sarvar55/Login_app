import React from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/user.png";
import styles from "../styles/Username.module.css";
import { toast, Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import { useAuthStore } from "../store/store";
import { useState } from "react";
import { useEffect } from "react";
import { generateOTP, verifyOTP } from "../helper/helper";

function Recovery() {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then((otp) => {
      if (otp) {
        return toast.success("Otp has been email");
      }
      return toast.error("Problem while generatign otp");
    });
  }, [username]);

  async function onSubmit(e) {
    try {
      e.preventDefault();
      let { status } = await verifyOTP({ username, code: OTP });
      if (status === 201) {
        toast.success("Verify Succesfully");
        navigate("/reset");
      }
    } catch (error) {
      return toast.error("Wrong Otp");
    }
  }
  function resendOtp() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: "Sending...",
      success: <b>OTP has been to your email</b>,
      error: <b>Cloud not send it</b>,
    });
    sendPromise.then((opt) => {
      console.log(opt);
    });
  }

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div className="flex justify-center items-center h-screen">
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Recovery</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Enter OTP to recover password.
            </span>
          </div>

          <form className="pt-20">
            <div className="textbox flex flex-col items-center gap-6">
              <div className="input text-center">
                <span className="py-4 text-sm text-left text-gray-500">
                  Enter 6 digit OTP sent to your email address.
                </span>
                <input
                  className={styles.textbox}
                  type="text"
                  placeholder="OTP"
                />
              </div>

              <button
                onChange={(e) => setOTP(e.target.value)}
                className={styles.btn}
                type="submit"
              >
                Recover
              </button>
            </div>
          </form>

          <div className="text-center py-4">
            <span className="text-gray-500">
              Can't get OTP?{" "}
              <button onClick={resendOtp} className="text-red-500">
                Resend
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recovery;
