import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { sliceLeadDeleted } from "../leadSlice";

function SingleLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  // const { leads } = useSelector((state) => state.lead);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [contact, setContact] = useState("");
//   const todayDate = new Date().toISOString().split("T")[0];

  // i want to count number of active employeees,
  // by checking the employee last present days,
  // if it has today date, then it will be marked as active member else not
  // let leadDetails = JSON.parse(localStorage.getItem("fresh-lead-count"));
  // let employeeDetails = JSON.parse(localStorage.getItem("total-employee-count"));
  const totalEmployees = JSON.parse(
    localStorage.getItem("total-employee-count")
  );
  const minimumLead = 1;
  const totalLeads = JSON.parse(localStorage.getItem("fresh-lead-count"));
  // console.log("lead details",leadDetails)

//   useEffect(() => {
//   }, [leadsPerEmployee]);

  const proceedWithYes = async () => {
    const activeEmployees = JSON.parse(
      localStorage.getItem("active-member-count")
    );
    console.log("active eda", activeEmployees);

    if (totalLeads === 0 || totalEmployees === 0 ) {
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
              `${API}/lead/assign/${contact}`,
              {
                leadPerEmployee: leadsPerEmployee,
                // typeOfEmployee: "present_today",
              },
              { headers }
            );

            if (response.status === 200) {
              localStorage.setItem(
                "lead-details",
                JSON.stringify(response.data)
              );
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
      <p className="text-xl mt-4 text-center my-3">Total Lead : {totalLeads}</p>
      <p className="text-xl  text-center my-3">
        Total Employees : {totalEmployees}
      </p>
      <p className="text-xl  text-secondary text-center my-3">
        Leads Remaining :{" "}
        {Math.max(0, totalLeads - leadsPerEmployee)}
      </p>

      <div className="mt-4 flex items-center justify-center">
        <label htmlFor="leadsInput" className="mr-2 text-xl">
          Leads Count:
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

      <div className="mt-4 flex items-center justify-center">
        <label htmlFor="employee_num" className="mr-2 text-xl">
          Employee Contact Number:
        </label>
        <input
          id="employee_num"
          type="number"
          value={contact}
          onChange={(e) => {
            setContact(e.target.value);
          }}
          className="border p-1"
        />
      </div>

      {/* <div className="mt-4">
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
      </div> */}

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

export default SingleLeadModalBody;
