import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../common/headerSlice";

function ActiveLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const totalEmployees = 50;
  const { leads } = useSelector((state) => state.lead);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [employeesWithoutLeads, setEmployeesWithoutLeads] = useState([]);
  
  useEffect(() => {
    let calculatedLeadsPerEmployee = Math.floor(leads.length / totalEmployees);

    if (leads.length < totalEmployees) {
      calculatedLeadsPerEmployee = 1;
    }

    setLeadsPerEmployee(calculatedLeadsPerEmployee);

    const employeesWithoutLeadsArray = Array.from(
      { length: totalEmployees },
      (_, index) => index + 1
    )
      .filter(
        (employeeIndex) =>
          employeeIndex > leads.length / calculatedLeadsPerEmployee
      )
      .slice(0, totalEmployees - leads.length);

    setEmployeesWithoutLeads(employeesWithoutLeadsArray);
  }, [leads, totalEmployees]);

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
          min={"0"}
          value={leadsPerEmployee}
          onChange={(e) => setLeadsPerEmployee(parseInt(e.target.value, 10))}
          className="border p-1"
        />
      </div>

      <div className="mt-4">
        <p className="text-center">
          {employeesWithoutLeads.length} out of {totalEmployees} employees will
          not receive leads.
        </p>
      </div>

      <div className="modal-action mt-12">
        <button className="btn btn-outline w-36" onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => {
            // Additional logic for lead assignment
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
