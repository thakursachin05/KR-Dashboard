import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { sliceLeadDeleted } from "../leadSlice";

function TotalLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const [activeEmployees, setActiveEmployees] = useState(0);
  // const { leads } = useSelector((state) => state.lead);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [employeesWithoutLeads, setEmployeesWithoutLeads] = useState(0);
  const [excessLeads, setExcessLeads] = useState(0);
  const todayDate = new Date().toISOString().split("T")[0];

  // i want to count number of active employeees,
  // by checking the employee last present days,
  // if it has today date, then it will be marked as active member else not
  let leadDetails = JSON.parse(localStorage.getItem("lead-details"));
  let employeeDetails = JSON.parse(localStorage.getItem("employee-details"));
  const totalEmployees = employeeDetails.count;
  const minimumLead = 1;
  const totalLeads = leadDetails?.count;
  // console.log("lead details",leadDetails)

  useEffect(() => {
    let employeegetLeads = Math.floor(totalLeads / leadsPerEmployee);
    const donothaveLeads = activeEmployees - employeegetLeads;
    setEmployeesWithoutLeads(Math.max(0, donothaveLeads));

    if (donothaveLeads < 0) {
      setExcessLeads(-1 * donothaveLeads);
    } else {
      setExcessLeads(totalLeads % leadsPerEmployee);
    }
  }, [totalLeads, activeEmployees, leadsPerEmployee]);

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = `${API}/employee`;
      try {
        const params = {
          page: 0,
          limit: employeeDetails.count,
          offset: 0,
        };
        const response = await axios.get(baseURL, { params: params });

        if (response.status === 200) {
          localStorage.setItem(
            "total-lead-details",
            JSON.stringify(response.data)
          );
          const activeEmployees = response.data.data;
          setActiveEmployees(activeEmployees.length);
          if (activeEmployees.length >= totalLeads) {
            setLeadsPerEmployee(1);
          } else {
            let perHead = Math.ceil(totalLeads / activeEmployees.length);
            setLeadsPerEmployee(perHead);
          }
        } else {
          console.log("access token incorrect");
        }
      } catch (error) {
        console.error("error", error);
      }
    };
    fetchData();
  }, [todayDate, employeeDetails.count, totalLeads]);

  const proceedWithYes = async () => {
    const activeEmployees = JSON.parse(
      localStorage.getItem("total-lead-details")
    );

    if (
      totalLeads === 0 ||
      totalEmployees === 0 ||
      activeEmployees.count === 0
    ) {
      dispatch(
        showNotification({
          message: "Leads or members is empty",
          status: 0,
        })
      );
      closeModal();
      return;
    }
    try {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const today = new Date();

          // Get the day of the week in lowercase (e.g., 'monday', 'tuesday', etc.)
          const dayOfWeek = today
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();

          try {
            const baseURL = `${API}/leadsCount`;
            let dbleadsCount = [];
            try {
              const response = await axios.get(baseURL);

              if (response.status === 200) {
                console.log("Lead count array", response.data.days);
                dbleadsCount = response.data.days;
                // Return the lead count array
              } else {
                console.log("Access token incorrect");
              }
            } catch (error) {
              console.error("Error fetching lead count array:", error);
            }
            // Fetch existing day-wise lead count array from the database

            // Find the index of the current day in the array
            const dayIndex = getDayIndex(dayOfWeek);

            // Update the lead count for the current day
            dbleadsCount[dayIndex - 1] = leadsPerEmployee; // Assuming response.data contains the lead count

            // Save the updated array back to the database
            saveLeadCountArrayToDatabase(dbleadsCount); // You should implement this function

            console.log("Updated day-wise lead count:", dbleadsCount);
          } catch (error) {
            console.error("Error updating day-wise lead count:", error);
          }
        }
        dispatch(sliceLeadDeleted(true));
      } else {
        dispatch(
          showNotification({ message: "Access token not found", status: 1 })
        );
      }
      dispatch(showNotification({ message: "Leads Assigned!", status: 1 }));
    } catch (error) {
      console.error("Error assigning leads", error);

      dispatch(
        showNotification({
          message: "Error assigning leads. Please try again.",
          status: 1,
        })
      );
    }

    closeModal();
  };

  function getDayIndex(dayOfWeek) {
    const daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    const lowercaseDay = dayOfWeek.toLowerCase();
    const dayIndex = daysOfWeek.indexOf(lowercaseDay);

    // If the day is not found in the array, you might want to handle it accordingly.
    // For example, you can return -1 or set a default day index.
    if (dayIndex === -1) {
      console.error("Invalid day of the week:", dayOfWeek);
      // Handle the error or set a default day index
      // return a default value or throw an error
      // return -1;
    }

    return dayIndex;
  }

  const getLeadCountArrayFromDatabase = async () => {
    const baseURL = `${API}/leadsCount`;

    try {
      const response = await axios.get(baseURL);

      if (response.status === 200) {
        console.log("Lead count array", response.data.days);

        // Return the lead count array
        return response.data.days;
      } else {
        console.log("Access token incorrect");
      }
    } catch (error) {
      console.error("Error fetching lead count array:", error);
    }

    // If there's an error or the response status is not 200, you might want to return a default value or handle it accordingly.
    return [0, 0, 0, 0, 0, 0, 0];
  };

  const saveLeadCountArrayToDatabase = async (leadCountArray) => {
    const baseURL = `${API}/leadsCount`;
    const storedToken = localStorage.getItem("accessToken");

    if (storedToken) {
      const accessToken = JSON.parse(storedToken).token;

      if (accessToken) {
        const headers = {
          Authorization: `Bearer ${accessToken}`,
        };

        console.log("elead count array apaswing to put api", leadCountArray);
        const leadBody = {
          days: leadCountArray,
        };

        try {
          const response = await axios.put(baseURL, leadBody, {
            headers,
          });

          if (response.status === 200) {
            console.log("Lead count array updated successfully", response.data);
            // Handle the response or do additional logic as needed
          } else {
            console.log(
              "Failed to update lead count array. Status:",
              response.status
            );
            // Handle the error
          }
        } catch (error) {
          console.error("Error updating lead count array:", error);
          // Handle the error
        }
      } else {
        console.log("Access token not found");
        // Handle the case where the access token is missing
      }
    } else {
      console.log("Access token not found");
      // Handle the case where the access token is missing
    }
  };

  return (
    <>
      <p className="text-xl mt-8 text-center my-3">Total Lead : {totalLeads}</p>
      <p className="text-xl  text-center my-3">
        Total Employees : {totalEmployees}
      </p>
      <div className="mt-4 flex items-center justify-center">
        <label htmlFor="leadsInput" className="mr-2">
          Leads per employee:
        </label>
        <input
          id="leadsInput"
          type="number"
          min={minimumLead}
          max={totalLeads}
          value={leadsPerEmployee}
          onChange={(e) => {
            const newValue = parseInt(e.target.value, 10);
            if (newValue === 0) {
              setLeadsPerEmployee(1);
            } else {
              setLeadsPerEmployee(newValue);
            }
          }}
          className="border p-1"
        />
      </div>

      <div className="mt-4">
        <p className="text-center">
          {`${employeesWithoutLeads} out of ${activeEmployees} employees will not receive leads.`}
        </p>
        <p className="text-center">
          {employeesWithoutLeads > 0
            ? excessLeads !== 0
              ? `1 employee will recieve ${excessLeads} leads`
              : "No Leads are Remaining"
            : `${
                totalLeads - leadsPerEmployee * activeEmployees
              } leads are remaining not assigned to anyone`}
        </p>
      </div>

      <div className="modal-action mt-12">
        <button className="btn btn-outline w-36" onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Assign
        </button>
      </div>
    </>
  );
}

export default TotalLeadModalBody;
