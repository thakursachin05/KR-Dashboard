import axios from "axios";
import React, {useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import { API } from "../../../utils/constants";
import { showNotification } from "../../common/headerSlice";
import { sliceLeadDeleted } from "../../leads/leadSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

// import ErrorText from "../../../components/Typography/ErrorText";

const ProfileSettings = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState(user);
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  // const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API}/employee/?id=${user._id}`);
      setUserData(response.data.data[0]);
      localStorage.setItem("user", JSON.stringify(response.data.data[0]));
      console.log(response.data.data[0]);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "password" && value.trim() === "") {
      const { password, ...userDataWithoutPassword } = userData;
      setUserData(userDataWithoutPassword);
      return;
    }

    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const isPasswordValid = (password) => {
    return password.length >= 8;
  };

  const isEmailValid = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleUpdate = async () => {
    if (userData.password && !isPasswordValid(userData.password)) {
      dispatch(
        showNotification({
          message: "Password format is wrong!",
          status: 0,
        })
      );
      return;
    }

    if (!isEmailValid(userData.email)) {
      dispatch(
        showNotification({
          message: "Email is not valid!",
          status: 0,
        })
      );
      return;
    }
    try {
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;
      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`${API}/employee/${userData._id}`, userData, config);
      dispatch(sliceLeadDeleted(true));
      await fetchUserData();
      dispatch(
        showNotification({
          message: "Profile Updated Successfully!",
          status: 1,
        })
      );
    } catch (error) {
      dispatch(
        showNotification({
          message: "Error in updating Profile!",
          status: 1,
        })
      );
    }
  };

  return (
    <>
      <TitleCard title="Profile Settings" topMargin="mt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              className="input input-bordered w-full"
              value={userData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="label">Email</label>
            <input
              type="text"
              name="email"
              className="input input-bordered w-full"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="relative">
            <label className="label">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              className="input input-bordered w-full"
              // value={userData.password}
              onChange={handleInputChange}
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
          <div>
            <label className="label">Gender</label>
            <select
              name="gender"
              className="input input-bordered w-full"
              value={userData.gender || ""}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Other</option>
              <option value="none">Prefer Not to Say</option>
            </select>
          </div>
          <div>
            <label className="label">Contact</label>
            <input
              type="number"
              name="contact"
              className="input input-bordered w-full"
              value={userData.contact}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              name="dob"
              className="input input-bordered w-full"
              value={
                userData.dob
                  ? new Date(userData.dob).toISOString().split("T")[0]
                  : ""
              }
              onChange={handleInputChange}
            />
          </div>
          {userData.isAdmin === false ? (
            <>
              <div>
                <label className="label">Present Days</label>
                <input
                  type="text"
                  name="presentDays"
                  disabled
                  className="input input-bordered w-full"
                  value={userData.presentDays?.length}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="label">Status</label>
                <input
                  type="text"
                  name="activityStatus"
                  disabled
                  className="input input-bordered w-full"
                  value={
                    userData.activityStatus === null
                      ? "New Joinee"
                      : userData.activityStatus
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="label">
                  Last Date on which Lead was Assigned
                </label>
                <input
                  type="text"
                  name="lastDateLeadAssigned"
                  disabled
                  className="input input-bordered w-full"
                  value={
                    userData.lastDateLeadAssigned
                      ? format(
                          new Date(userData.lastDateLeadAssigned),
                          "dd/MM/yyyy"
                        )
                      : "N/A"
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="label">Last Number Of Lead Assigned</label>
                <input
                  type="text"
                  name="lastNumberOfLeadAssigned"
                  disabled
                  className="input input-bordered w-full"
                  value={userData.lastNumberOfLeadAssigned}
                  onChange={handleInputChange}
                />
              </div>
            </>
          ) : (
            ""
          )}
        </div>
        {/* <ErrorText styleClass="mt-8">{errorMessage}</ErrorText> */}

        <div className="mt-16">
          <button
            className="btn btn-primary float-right"
            onClick={handleUpdate}
          >
            Update
          </button>
        </div>
      </TitleCard>
    </>
  );
};

export default ProfileSettings;
