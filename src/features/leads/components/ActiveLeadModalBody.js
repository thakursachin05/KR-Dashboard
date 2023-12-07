import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";

function ActiveLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  // const { leads } = useSelector((state) => state.lead);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [employeesWithoutLeads, setEmployeesWithoutLeads] = useState(0);
  const [excessLeads, setExcessLeads] = useState(0);

  // i want to count number of active employeees,
  // by checking the employee last present days,
  // if it has today date, then it will be marked as active member else not
  let leadDetails = JSON.parse(localStorage.getItem("lead-details"));
  const employeeDetails = JSON.parse(localStorage.getItem("employee-details"));

  const totalLeads = leadDetails.count;
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
            "employee-details",
            JSON.stringify(response.data)
          );
          // Assuming employee.presentDays is the field containing an array of present days
          const activeEmployees = response.data.data.filter((employee) => {
            const presentDays = employee.presentDays;
            // Check if the presentDays array includes today's date
            const isTodayPresent = presentDays.some((date) => {
              const today = new Date().toISOString().split("T")[0];
              return date.split("T")[0] === today;
            });
            return isTodayPresent;
          });
          setActiveEmployees(activeEmployees.length);
          setTotalEmployees(response.data.count);
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
  }, [employeeDetails,totalLeads]);

  const proceedWithYes = async () => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          try {
            const params = {
              page: 0,
              limit: leadDetails.count,
              offset: 0,
            };
            const response = await axios.get(`${API}/lead`, { params: params });

            if (response.status === 200) {
              localStorage.setItem(
                "lead-details",
                JSON.stringify(response.data)
              );
              leadDetails = response.data;
              console.log("all elad data", response.data);
            } else {
              console.log("access token incorrect");
            }
          } catch (error) {
            console.error("error", error);
          }

          // Assuming employeeDetails and leadDetails are arrays
          for (let i = 0; i < employeeDetails.count; i++) {
            let leadCount = leadsPerEmployee;
            const todayDate = new Date().toISOString().split("T")[0];

            for (let j = 0; j < leadDetails.count && leadCount > 0; j++) {
              // const employeeId = employeeDetails[i]._id;
              const leadId = leadDetails.data[j]._id;
              let assigneeId = employeeDetails.data[i]._id;
              let assigneeName = employeeDetails.data[i].name;

              const existingLeadResponse = await axios.get(
                `${API}/lead/?id=${leadId}`
              );
              const existingLeadData = existingLeadResponse.data.data; // Assuming your data structure

              const newModifiedObject = {
                assignedTo: assigneeName,
                assigneeId: assigneeId,
                date: todayDate,
                status: "open",
              };

              // Check if existingLeadData.modified is an array before spreading
              const modifiedArray = Array.isArray(existingLeadData.modified)
                ? existingLeadData.modified
                : [];

              // Update the lead with employee details
              await axios.put(
                `${API}/lead/${leadId}`,
                {
                  userData: {
                    assigned: {
                      assignedTo: assigneeName,
                      assigneeId: assigneeId,
                      assigneeStatus: "open",
                    },
                    modified: [...modifiedArray, newModifiedObject],
                  },
                },
                { headers }
              );

              // Update your state or whatever logic you need here
              // dispatch(sliceLeadDeleted(true));

              // Reduce the leadPerEmployee count
              leadCount--;
            }

            if (leadCount > 0) {
              leadCount = leadsPerEmployee - leadCount;
            } else {
              leadCount = leadsPerEmployee;
            }

            // After completing the above put API, update employee data

            const updateData = {
              lastDateLeadAssigned: todayDate,
              lastNumberOfLeadAssigned: leadCount,
            };

            // Update the employee data
            await axios.put(
              `${API}/employee/${employeeDetails.data[i]._id}`,
              updateData,
              { headers }
            );
            // dispatch(sliceLeadDeleted(false));
          }

          dispatch(showNotification({ message: "Leads Assigned!", status: 1 }));
        }
      } else {
        dispatch(
          showNotification({ message: "Access token not found", status: 1 })
        );
      }
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
          min={"1"}
          max={totalLeads}
          value={leadsPerEmployee}
          onChange={(e) => setLeadsPerEmployee(parseInt(e.target.value, 10))}
          className="border p-1"
        />
      </div>

      <div className="mt-4">
        <p className="text-center">
          {`${employeesWithoutLeads} out of ${activeEmployees} employees will not receive leads.`}
        </p>
        <p className="text-center">
          {employeesWithoutLeads > 0
            ? `1 employee will recieve ${excessLeads} leads`
            : `${totalLeads - (leadsPerEmployee*activeEmployees)} leads are remaining not assigned to anyone`}
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
