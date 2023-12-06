import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import ToogleInput from "../../../components/Input/ToogleInput";
import { API } from "../../../utils/constants";
import { showNotification } from "../../common/headerSlice";

const ProfileSettings = () => {
  const [userData, setUserData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async (userId) => {
      try {
        const response = await axios.get(`${API}/employee/?id=${userId}`);
        setUserData(response.data.data[0]);
        console.log(response.data.data[0]);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const userDataString = localStorage.getItem("user");
    const userData = JSON.parse(userDataString);
    const userId = userData?._id;
    if (userId) {
      fetchUserData(userId);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;
      console.log(token);
      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.put(`${API}/employee/${userData._id}`, userData, config);
      dispatch(
        showNotification({
          message: "Profile Updated Successfully!",
          status: 1,
        })
      );
      console.log("Employee data updated successfully!");
    } catch (error) {
      console.error("Error updating employee data:", error);
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
              disabled
              className="input input-bordered w-full"
              value={userData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              className="input input-bordered w-full"
              value={userData.password}
              onChange={handleInputChange}
            />
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
              type="text"
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

          <div>
            <label className="label">Present Days</label>
            <input
              type="text"
              name="presentDays"
              disabled
              className="input input-bordered w-full"
              value={userData.presentDays}
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
              value={userData.activityStatus}
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
              value={userData.lastDateLeadAssigned}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="label">Role</label>
            <input
              type="text"
              name="role"
              disabled
              className="input input-bordered w-full"
              value={userData.role}
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
          <ToogleInput
            updateType="syncData"
            labelTitle="Sync Data"
            defaultValue={userData.syncData}
          />
        </div>

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
