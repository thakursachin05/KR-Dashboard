import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { sliceLeadDeleted } from "../leadSlice";

function ActiveLeadModalBody({ extraObject, closeModal }) {
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
  const totalEmployees = employeeDetails?.count;
  const minimumLead = 1;
  const totalLeads = leadDetails?.count;
  // console.log("lead details",leadDetails)

  useEffect(() => {
    let employeegetLeads = Math.ceil(totalLeads / leadsPerEmployee);
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
          limit: 0,
          offset: 0,
          presentDays: todayDate,
          approvedAt: "notNull",
        };
        const response = await axios.get(baseURL, { params: params });

        if (response.status === 200) {
          localStorage.setItem(
            "active-member-count",
            JSON.stringify(response.data.count)
          );
          const activeEmployees = response.data.data;
          setActiveEmployees(activeEmployees.length);
          if (activeEmployees.length >= totalLeads) {
            setLeadsPerEmployee(1);
          } else {
            let perHead = Math.floor(totalLeads / activeEmployees.length);
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
  }, [todayDate, employeeDetails?.count, totalLeads]);

  const proceedWithYes = async () => {
    const activeEmployees = JSON.parse(localStorage.getItem("active-details"));
    console.log("active eda", activeEmployees);

    if (
      totalLeads === 0 ||
      totalEmployees === 0 ||
      activeEmployees
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
          try {
            const response = await axios.post(`${API}/lead/assign`, {leadPerEmployee: leadsPerEmployee, typeOfEmployee: 'present_today'},  { headers });

            if (response.status === 200) {
              localStorage.setItem(
                "lead-details",
                JSON.stringify(response.data)
              );
              leadDetails = response.data;
              console.log("all lead data", response.data);
            } else {
              console.log("access token incorrect");
            }
          } catch (error) {
            console.error("error", error);
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

  return (
    <>
      <p className="text-xl mt-8 text-center my-3">Total Lead : {totalLeads}</p>
      <p className="text-xl  text-center my-3">
        Total Employees : {totalEmployees}
      </p>
      <p className="text-xl mb-5 text-center my-3">
        Active Employees : {activeEmployees}
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

export default ActiveLeadModalBody;
