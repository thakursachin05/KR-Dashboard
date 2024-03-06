import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { sliceLeadDeleted } from "../leadSlice";

function TLLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [employeesWithoutLeads, setEmployeesWithoutLeads] = useState(0);
  const [employeegetLeads, setEmployeesGetLeads] = useState(0);
  const [excessLeads, setExcessLeads] = useState(0);
  const todayDate = new Date().toISOString().split("T")[0];
  const totalEmployees = JSON.parse(
    localStorage.getItem("total-employee-count")
  );
  const minimumLead = 1;
  const totalLeads = JSON.parse(localStorage.getItem("fresh-lead-count"));

  useEffect(() => {
    let employeegetLeads = Math.ceil(totalLeads / leadsPerEmployee);
    const donothaveLeads = activeEmployees - employeegetLeads;
    setEmployeesWithoutLeads(Math.max(0, Math.floor(donothaveLeads)));
    setEmployeesGetLeads(
      activeEmployees - Math.max(0, Math.floor(donothaveLeads))
    );

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
          role: "TL",
          activityStatus: "ACTIVE",
          isAdmin: "false",
        };
        const response = await axios.get(baseURL, { params: params });

        if (response.status === 200) {
          localStorage.setItem(
            "active-member-count",
            JSON.stringify(response.data.count)
          );
          const activeEmployees = response.data.count;
          setActiveEmployees(activeEmployees);
          if (activeEmployees >= totalLeads) {
            setLeadsPerEmployee(1);
          } else {
            let perHead = Math.floor(totalLeads / activeEmployees);
            setLeadsPerEmployee(perHead);
          }
        } else {
          console.log("access token incorrect");
        }
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("error", error);
      }
    };
    fetchData();
  }, [todayDate, totalLeads]);

  const proceedWithYes = async () => {
    const activeEmployees = JSON.parse(
      localStorage.getItem("active-member-count")
    );

    if (totalLeads === 0 || totalEmployees === 0 || activeEmployees === 0) {
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
            const response = await axios.post(
              `${API}/lead/assign`,
              {
                leadPerEmployee: leadsPerEmployee,
                typeOfEmployee: "active_status",
                role: "TL",
              },
              { headers }
            );

            if (response.status === 200) {
              localStorage.setItem(
                "lead-details",
                JSON.stringify(response.data)
              );
              dispatch(
                showNotification({
                  message: `${response.data.message}`,
                  status: 1,
                })
              );
            }
          } catch (error) {
            if (error.response.status === 409) {
              localStorage.clear();
              window.location.href = "/login";
            } else {
              dispatch(
                showNotification({
                  message: `${error.response.data.message}`,

                  status: 0,
                })
              );
            }
          }
        }
        dispatch(sliceLeadDeleted(true));
      } else {
        dispatch(
          showNotification({ message: "Access token not found", status: 0 })
        );
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({
            message: `${error.response.data.message}`,

            status: 0,
          })
        );
      }
    }

    closeModal();
  };

  return (
    <>
      <p className="text-xl mt-4 text-center my-3">Total Lead : {totalLeads}</p>
      <p className="text-xl text-blue-400 text-center my-3">
        Total Team Leader: {activeEmployees}
      </p>
      <p className="text-xl text-success  text-center my-3">
        TL Receive Leads : {employeegetLeads}
      </p>
      <p className="text-xl text-amber-500 text-center my-3">
        TL Not Receive Leads : {employeesWithoutLeads}
      </p>
      {excessLeads !== 0 && employeesWithoutLeads > 0 ? (
        <p className="text-xl text-red-600 text-center my-3">
          1 TL will recieve {excessLeads} leads
        </p>
      ) : (
        ""
      )}

      <p className="text-xl  text-secondary text-center my-3">
        Leads Remaining :{" "}
        {Math.max(0, totalLeads - leadsPerEmployee * activeEmployees)}
      </p>

      <div className="mt-4 flex items-center justify-center">
        <label htmlFor="leadsInput" className="mr-2 text-xl">
          Leads per Team Leader:
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

export default TLLeadModalBody;
