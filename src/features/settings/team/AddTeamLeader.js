import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { showNotification } from "../../common/headerSlice";
import InputText from "../../../components/Input/InputText";
import ErrorText from "../../../components/Typography/ErrorText";
import { API } from "../../../utils/constants";

function AddTeamLeader() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    password: "",
    email: "",
    contact: "",
    role:["teamLeader"],
  };
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);
  const dispatch = useDispatch();

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (registerObj.name.trim() === "")
      return setErrorMessage("Name is required!");
    if (registerObj.email.trim() === "")
      return setErrorMessage("Email Id is required!");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (registerObj.contact.trim() === "")
      return setErrorMessage("Phone number is required!");
    if (!isEmailValid(registerObj.email)) {
      return setErrorMessage("Email is not valid!");
    }
    if (!isPasswordValid(registerObj.password)) {
      return setErrorMessage(
        "Password requirements: 8 characters minimum"
      );
    } else {
      try {
        const response = await axios.post(`${API}/auth/signup`, registerObj);
        if (response.status === 200) {
          dispatch(
            showNotification({ message: "Registered Successfully!", status: 1 })
          );

          window.location.href = "/login";
        }
      } catch (error) {
        alert("Signup failed");
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const isPasswordValid = (password) => {
    // return (
    //   password.length >= 8 &&
    //   /[A-Z]/.test(password) &&
    //   /[a-z]/.test(password) &&
    //   /\d/.test(password)
    // );
    return password.length >= 8;
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center">
      <div className="card mx-auto w-full max-w-sm  shadow-xl">
        <div className="grid  md:grid-cols-1 grid-cols-1  bg-base-100 rounded-xl">
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Register Team Leader
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                <InputText
                  defaultValue={registerObj.name}
                  updateType="name"
                  containerStyle="mt-4"
                  labelTitle="Name"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.email}
                  updateType="email"
                  containerStyle="mt-4"
                  labelTitle="Email Id"
                  updateFormValue={updateFormValue}
                />
                <InputText
                  defaultValue={registerObj.contact}
                  type="number"
                  updateType="contact"
                  containerStyle="mt-4"
                  labelTitle="Phone Number"
                  updateFormValue={updateFormValue}
                />
                <div className="relative">
                  <InputText
                    defaultValue={registerObj.password}
                    type={showPassword ? "text" : "password"}
                    updateType="password"
                    containerStyle="mt-4"
                    labelTitle="Password"
                    updateFormValue={updateFormValue}
                  />
                  <button
                    className="text-sm absolute right-0 top-[62%] mr-2"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {!showPassword ? (
                      <EyeIcon className="h-5 w-5" />
                    ) : (
                      <EyeSlashIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button type="submit" className={"btn mt-2 w-full btn-primary"}>
                Register
              </button>

              <div className="text-center mt-4">
                Already have an account?{" "}
                <Link to="/login">
                  <span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">
                    Login
                  </span>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTeamLeader;
