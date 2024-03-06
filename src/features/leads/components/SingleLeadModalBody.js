import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { sliceLeadDeleted } from "../leadSlice";

function SingleLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [contact, setContact] = useState("");
  const totalEmployees = JSON.parse(
    localStorage.getItem("total-employee-count")
  );
  const minimumLead = 1;
  const totalLeads = JSON.parse(localStorage.getItem("fresh-lead-count"));
  const storedUserData = JSON.parse(localStorage.getItem("user"));

  const proceedWithYes = async () => {
    if (totalLeads === 0 || totalEmployees === 0) {
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
            let response;
            if (storedUserData.isAdmin) {
              response = await axios.post(
                `${API}/lead/assign/${contact}`,
                {
                  leadPerEmployee: leadsPerEmployee,
                },
                { headers }
              );
            } else {
              response = await axios.post(
                `${API}/lead/assign/tl/${storedUserData._id}/${contact}`,
                {
                  leadPerEmployee: leadsPerEmployee,
                },
                { headers }
              );
            }

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
              console.log("erorr", error);
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
      }
      console.log("erorr", error);

      dispatch(
        showNotification({
          message: `${error.response.data.message}`,
          status: 0,
        })
      );
    }

    closeModal();
  };

  return (
    <>
      <p className="text-xl mt-4 text-center my-3">Total Lead : {totalLeads}</p>
      <p className="text-xl  text-center my-3">Total HR : {totalEmployees}</p>
      <p className="text-xl  text-secondary text-center my-3">
        Leads Remaining : {Math.max(0, totalLeads - leadsPerEmployee)}
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
          HR Contact Number:
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
