import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";

function ActiveLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const totalEmployees = 50;
  const { leads } = useSelector((state) => state.lead);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [employeesWithoutLeads, setEmployeesWithoutLeads] = useState(0);
  const [remainingLeads, setRemainingLeads] = useState(0);
  // i want to count number of active employeees, 
  // by checking the employee last present days, 
  // if it has today date, then it will be marked as active member else not

  useEffect(() => {
    const fetchData = async () => {
      const baseURL = `${API}/employee`;
      try {
        const response = await axios.get(baseURL);
        if (response.status === 200) {
          localStorage.setItem("employee-details", JSON.stringify(response.data));
  
          // Assuming employee.presentDays is the field containing an array of present days
          const activeEmployees = response.data.data.filter((employee) => {
            const presentDays = employee.presentDays;
            if (presentDays.length > 0) {
              // Get the last entry in the presentDays array
              const lastPresentDay = presentDays[presentDays.length - 1];
  
              // Get today's date
              const today = new Date().toISOString().split("T")[0];
  
              // Check if the last entry is today
              return lastPresentDay === today;
            }
  
            // If presentDays is empty, consider the employee inactive
            return false;
          });
  
          console.log("Active employees:", activeEmployees);
        } else {
          console.log("access token incorrect");
        }
      } catch (error) {
        console.error("error", error);
      }
    };
  
    fetchData();
  }, []);
  
  

  useEffect(() => {
    let employeegetLeads = Math.floor(leads.length / leadsPerEmployee);
    const donothaveLeads = totalEmployees - employeegetLeads;
    setEmployeesWithoutLeads(Math.max(0, donothaveLeads));
    if (donothaveLeads < 0) {
      setRemainingLeads(donothaveLeads);
    }
  }, [leads, totalEmployees, employeesWithoutLeads, leadsPerEmployee]);

  return (
    <>
      <p className="text-xl mt-8 text-center my-6">
        Number of leads per employee: {leadsPerEmployee}
      </p>

      <div className="mt-4 flex items-center justify-center">
        <label htmlFor="leadsInput" className="mr-2">
          Leads per employee:
        </label>
        <input
          id="leadsInput"
          type="number"
          min={"1"}
          max={leads.length}
          value={leadsPerEmployee}
          onChange={(e) => setLeadsPerEmployee(parseInt(e.target.value, 10))}
          className="border p-1"
        />
      </div>

      <div className="mt-4">
        <p className="text-center">
          {remainingLeads >= 0
            ? `${employeesWithoutLeads} out of ${totalEmployees} employees will not receive leads.`
            : `${remainingLeads} leads are remaining, not assigned to anyone.`}
        </p>
      </div>

      <div className="modal-action mt-12">
        <button className="btn btn-outline w-36" onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => {
            dispatch(
              showNotification({ message: "Leads assigned!", status: 1 })
            );
            closeModal();
          }}
        >
          Assign
        </button>
      </div>
    </>
  );
}

export default ActiveLeadModalBody;
