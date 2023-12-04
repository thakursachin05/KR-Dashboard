import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showNotification } from "../../common/headerSlice";

function ActiveLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const totalEmployees = 50;
  const { leads } = useSelector((state) => state.lead);
  const [leadsPerEmployee, setLeadsPerEmployee] = useState(1);
  const [employeesWithoutLeads, setEmployeesWithoutLeads] = useState(0);
  const [remainingLeads, setRemainingLeads] = useState(0);

  useEffect(() => {
    let employeegetLeads = Math.floor(leads.length / leadsPerEmployee);
    const donothaveLeads = totalEmployees - employeegetLeads;
    setEmployeesWithoutLeads(Math.max(0, donothaveLeads));
    if (donothaveLeads < 0) {
      setRemainingLeads(donothaveLeads);
    }
  }, [leads, totalEmployees,employeesWithoutLeads, leadsPerEmployee]);

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
