import { useState } from "react";
// import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import ErrorText from "../../../components/Typography/ErrorText";
import InputText from "../../../components/Input/InputText";
import { showNotification } from "../../common/headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";

function AddMember() {
  const INITIAL_REGISTER_OBJ = {
    name: "",
    password: "",
    email: "",
    contact: "",
  };
  
  const [loading, setLoading] = useState(false);
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
    else {
      setLoading(true);
      try {
        const response = await axios.post(`${API}/auth/signup`, registerObj);
        if (response.status === 200) {
          dispatch(
            showNotification({ message: "New Member Added!", status: 1 })
          );
          
          // window.location.href = "/app/teamMembers";
        }
      } catch (error) {
        alert("Signup failed");
      }
      setLoading(false);
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
              Register Member
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
                  // type="text"
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
                Add Member
              </button>

              {/* <div className='text-center mt-4'>Already have an account? <Link to="/login"><span className="  inline-block  hover:text-primary hover:underline hover:cursor-pointer transition duration-200">Login</span></Link></div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMember;
