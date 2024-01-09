import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ErrorText from "../../../components/Typography/ErrorText";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";

function ForgotPassword() {
  const INITIAL_REGISTER_OBJ = {
    password: "",
    contact: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);
  const dispatch = useDispatch();
  let userId = "";

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (registerObj.contact.trim() === "")
      return setErrorMessage("Phone number is required!");
    if (!isPasswordValid(registerObj.password)) {
      return setErrorMessage("Password requirements: 8 characters minimum");
    } else {
      setLoading(true);
      await fetchData();
      registerObj.password = registerObj.password.replace(/\s/g, "");
      registerObj.contact = registerObj.contact.replace(/\s/g, "");
      try {
        const tokenResponse = localStorage.getItem("accessToken");
        const tokenData = JSON.parse(tokenResponse);
        const token = tokenData.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const userData = {
          password: registerObj.password,
        };
        const response = await axios.put(
          `${API}/employee/${userId}`,
          userData,
          config
        );
        if (response.status === 200) {
          dispatch(
            showNotification({
              message: "Password Updated Successfully!",
              status: 1,
            })
          );

          setRegisterObj(INITIAL_REGISTER_OBJ);
        }
      } catch (error) {
        dispatch(
          showNotification({
            message: `${error.response.data.message}`,
            status: 0,
          })
        );
      }
      setLoading(false);
    }
  };

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  // const isEmailValid = (email) => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   return emailRegex.test(email);
  // };

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${API}/employee?contact=${registerObj.contact}`
      );
      if (response.status === 200) {
        // console.log("response dat of user", response.data);
        userId = response.data.data[0]._id;
        // window.location.href = "/app/teamMembers";
      }
    } catch (error) {
      alert("Phone Number not found");
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setErrorMessage("");
    setRegisterObj({ ...registerObj, [updateType]: value });
  };

  return (
    <div className="min-h-screen  bg-base-200 flex items-center">
      <div className="card mx-auto max-w-xl w-full  shadow-xl">
        <div className="grid grid-cols-1  bg-base-100 rounded-xl">
          <div className="py-24 px-10">
            <h2 className="text-2xl font-semibold mb-2 text-center">
              Reset Password
            </h2>
            <form onSubmit={(e) => submitForm(e)}>
              <div className="mb-4">
                {/* <InputText
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
                /> */}
                <InputText
                  defaultValue={registerObj.contact}
                  type="text"
                  updateType="contact"
                  containerStyle="mt-4"
                  labelTitle="Phone Number"
                  updateFormValue={updateFormValue}
                />

                <InputText
                  defaultValue={registerObj.password}
                  type="password"
                  updateType="password"
                  containerStyle="mt-4"
                  labelTitle="Password"
                  updateFormValue={updateFormValue}
                />
              </div>

              <ErrorText styleClass="mt-8">{errorMessage}</ErrorText>
              <button
                type="submit"
                className={
                  "btn mt-2 w-full btn-primary" + (loading ? " loading" : "")
                }
              >
                Submit
              </button>

              {/* <div className='text-center mt-4'>Already have an account? <Link to="/login"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
