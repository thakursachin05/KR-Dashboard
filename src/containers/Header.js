import { themeChange } from "theme-change";
import React, { useEffect, useState } from "react";
// import {  useDispatch } from 'react-redux'
// import BellIcon  from '@heroicons/react/24/outline/BellIcon'
import Bars3Icon from "@heroicons/react/24/outline/Bars3Icon";
import MoonIcon from "@heroicons/react/24/outline/MoonIcon";
import SunIcon from "@heroicons/react/24/outline/SunIcon";
// import { openRightDrawer } from '../features/common/rightDrawerSlice';
// import { RIGHT_DRAWER_TYPES } from '../utils/globalConstantUtil'
import logo from "../assets/images/user.jpg";
import { Link } from "react-router-dom";
import axios from "axios";
import { API } from "../utils/constants";
import { useDispatch } from "react-redux";
import { sliceLeadDeleted } from "../features/leads/leadSlice";
import { showNotification } from "../features/common/headerSlice";

function Header() {
  const storedUserData = JSON.parse(localStorage.getItem("user"));
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const isTodayPresent = storedUserData?.presentDays?.some((date) => {
    // Assuming date is a string in the format "YYYY-MM-DDTHH:mm:ss.sssZ"
    const today = new Date().toISOString().split("T")[0];
    return date.startsWith(today);
  });

  const [attendanceMarked, setAttendanceMarked] = useState(isTodayPresent);
  const dispatch = useDispatch();
  // Function to get today's date in the format "YYYY-MM-DD"
  //   function getTodayDateString() {
  //     const today = new Date();
  //     const year = today.getFullYear();
  //     const month = String(today.getMonth() + 1).padStart(2, "0");
  //     const day = String(today.getDate()).padStart(2, "0");
  //     return `${year}-${month}-${day}`;
  //   }

  // const dispatch = useDispatch()
  // const {noOfNotifications, pageTitle} = useSelector(state => state.header)
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.getItem("theme")
  );

  useEffect(() => {
    themeChange(false);
    if (currentTheme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setCurrentTheme("dark");
      } else {
        setCurrentTheme("light");
      }
    }
    // 👆 false parameter is required for react project
  }, [currentTheme]);

// testing of attendace button
  // useEffect(() => {
  //   const now = new Date();
  //   const currentHour = now.getHours();
  //   const currentMinutes = now.getMinutes();

  //   // Check if the current time is between 6:16 and 6:18
  //   const isTimeInRange = currentHour === 18 && currentMinutes >= 28 && currentMinutes <= 30;

  //   setIsButtonEnabled(isTimeInRange);
  // }, []);

  useEffect(() => {
    const now = new Date();
    const currentHour = now.getHours();

    // Check if the current time is between 6 am and 12 pm
    const isTimeInRange = currentHour >= 6 && currentHour < 12;

    setIsButtonEnabled(isTimeInRange);
  }, []);

  const handleAttendanceMarking = async () => {
    if (attendanceMarked) return;

    try {
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // Get the user data from local storage
      const storedUserData = JSON.parse(localStorage.getItem("user"));

      // Get today's date in the format "YYYY-MM-DD"
      const today = new Date().toISOString().split("T")[0];

      // Clone the user object to avoid modifying the original directly
      const updatedUser = { ...storedUserData };

      // Update the presentDays array by pushing today's date
      updatedUser.presentDays = [...updatedUser.presentDays, today];

      // Make the API call to update the user data
      await axios.put(
        `${API}/employee/${updatedUser._id}`,
        updatedUser,
        config
      );

      // Update the local storage with the modified user data
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // Update the state if needed
      setAttendanceMarked(true);

      dispatch(sliceLeadDeleted(true));

      dispatch(
        showNotification({
          message: "Attendance Marked!",
          status: 1,
        })
      );
    } catch (error) {
      console.error("Error updating attendance", error);

      dispatch(
        showNotification({
          message: "Error updating attendance. Please try again.",
          status: 2,
        })
      );
    }
  };

  function logoutUser() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      <div className="navbar  flex justify-between bg-base-100  z-10 shadow-md ">
        {/* Menu toogle for mobile view or small screen */}
        <div className="">
          <label
            htmlFor="left-sidebar-drawer"
            className="btn btn-primary drawer-button lg:hidden"
          >
            <Bars3Icon className="h-5 inline-block w-5" />
          </label>
          {/* <h1 className="text-2xl font-semibold ml-2">{pageTitle}</h1> */}
        </div>

        <div className="order-last">
          {storedUserData.isAdmin === false ? (
            storedUserData.approvedAt !== null ? (
              <div
                className={
                  attendanceMarked
                    ? "text-black cursor-pointer bg-green-500 rounded p-1 mr-5"
                    : "text-black cursor-pointer bg-red-500 rounded p-1 mr-5"
                }
                onClick={isButtonEnabled ? handleAttendanceMarking : null}
                style={{
                  opacity: isButtonEnabled ? 1 : 0.5,
                  pointerEvents: isButtonEnabled ? "auto" : "none",
                }}
              >
                {attendanceMarked ? <h5>Present</h5> : <h5>Absent</h5>}
              </div>
            ) : (
              ""
            )
          ) : (
            ""
          )}

          <label className="swap ">
            <input type="checkbox" />
            <SunIcon
              data-set-theme="light"
              data-act-class="ACTIVECLASS"
              className={
                "fill-current w-6 h-6 " +
                (currentTheme === "dark" ? "swap-on" : "swap-off")
              }
            />
            <MoonIcon
              data-set-theme="dark"
              data-act-class="ACTIVECLASS"
              className={
                "fill-current w-6 h-6 " +
                (currentTheme === "light" ? "swap-on" : "swap-off")
              }
            />
          </label>

          <div className="dropdown dropdown-end ml-4">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src={logo} alt="profile" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="justify-between">
                <Link to={"/app/settings-profile"}>
                  Profile Settings
                  <span className="badge">New</span>
                </Link>
              </li>

              <div className="divider mt-0 mb-0"></div>
              <li>
                <span onClick={logoutUser}>Logout</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
