import { useState } from "react";
import { useDispatch } from "react-redux";
import ErrorText from "../../../components/Typography/ErrorText";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";

function ResetPasswordHR() {
  const INITIAL_REGISTER_OBJ = {
    password: "",
    contact: "",
  };

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [registerObj, setRegisterObj] = useState(INITIAL_REGISTER_OBJ);
  const dispatch = useDispatch();
  const storeUserData = JSON.parse(localStorage.getItem("user"));

  const submitForm = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (registerObj.password.trim() === "")
      return setErrorMessage("Password is required!");
    if (registerObj.contact.trim() === "") {
      return setErrorMessage("Phone number is required!");
    } else {
      const cleanedContact = registerObj.contact.replace(/\s/g, "");
      registerObj.contact = cleanedContact;
    }
    if (!isPasswordValid(registerObj.password)) {
      return setErrorMessage("Password requirements: 8 characters minimum");
    } else {
      setLoading(true);
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
          contact: registerObj.contact,
        };
        const response = await axios.put(
          `${API}/employee/resetPass/${storeUserData?._id}`,
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

          // window.location.href = "/app/teamMembers";
        }
      } catch (error) {
        dispatch(
          showNotification({
            message: `${error.response.data.error}`,
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

export default ResetPasswordHR;
