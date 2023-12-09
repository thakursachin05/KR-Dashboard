import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { sliceLeadDeleted } from "./leadSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import Pagination from "../../components/Pagination";
import { showNotification } from "../common/headerSlice";
import axios from "axios";
import { API } from "../../utils/constants";
import { format } from "date-fns";

function TotalAssignedLeads() {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    column: "name",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");
  const [currentlyEditing, setCurrentlyEditing] = useState(null);
  const [editedData, setEditedData] = useState({ name: "", contact: "" });
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const leadDetails = JSON.parse(localStorage.getItem("lead-details"));
  // console.log("lead details from local storage", leadDetails);
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  useEffect(() => {
    const fetchData = async () => {
      const todayDate = new Date();
      const yesterdayDate = new Date(todayDate);
      yesterdayDate.setDate(todayDate.getDate() - 1);

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        offset: Math.max(0, currentPage - 1) * 10,
        finalStatus: "OPENED",
      };
      const baseURL = `${API}/lead`;
      try {
        const response = await axios.get(baseURL, { params: params });
        if (response.status === 200) {
          localStorage.setItem("lead-details", JSON.stringify(response.data));
          setLeadData(response.data.data);
        } else {
          console.log("access token incorrect");
        }
      } catch (error) {
        console.error("error", error);
      }
      dispatch(sliceLeadDeleted(false));
    };

    fetchData();
  }, [itemsPerPage, leadDeleted, dispatch, currentPage]);

  const deleteCurrentLead = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this lead?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          index: index,
        },
      })
    );
  };

  const totalItems = leadDetails?.count;

  const itemsPerPageOptions = Array.from(
    { length: Math.ceil(totalItems / 10) },
    (_, index) => (index + 1) * 10
  );

  const handleSort = (column) => {
    if (column === sortConfig.column) {
      setSortConfig({
        ...sortConfig,
        order: sortConfig.order === "asc" ? "desc" : "asc",
      });
    } else {
      setSortConfig({ column, order: "asc" });
    }
  };

  const sortedLeads = leadData.slice().sort((a, b) => {
    const aValue = a[sortConfig.column] || "";
    const bValue = b[sortConfig.column] || "";

    if (sortConfig.order === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = sortedLeads?.filter((lead) => {
    return (
      lead?.name?.toLowerCase().includes(filterValue?.toLowerCase()) ||
      lead?.contact?.includes(filterValue) ||
      lead?.assigned?.assignedTo
        ?.toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      lead?.assigned?.assigneeContact?.includes(filterValue) ||
      lead?.assigned?.assigneeStatus
        ?.toLowerCase()
        .includes(filterValue.toLowerCase()) ||
      lead?.finalStatus?.toLowerCase().includes(filterValue?.toLowerCase())
    );
  });

  const toggleEdit = (index) => {
    setEditedData({
      name: filteredLeads[index].name,
      contact: filteredLeads[index].contact,
    });

    setCurrentlyEditing((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleSaveEdit = async (leadId, index) => {
    try {
      // Validate edited data (you can add more validation as needed)
      if (!editedData.name || !editedData.contact) {
        dispatch(
          showNotification({
            message: "Name and contact are required.",
            status: 2,
          })
        );
        return;
      }
      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;

      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const updatedLead = {
        name: editedData.name,
        contact: editedData.contact,
      };

      await axios.put(`${API}/lead/${leadId}`, updatedLead, config);
      dispatch(sliceLeadDeleted(true));

      dispatch(
        showNotification({
          message: "Lead updated successfully!",
          status: 1,
        })
      );

      // Clear the edited values and toggle off editing mode
      setEditedData({ name: "", contact: "" });
      setCurrentlyEditing(null);
    } catch (error) {
      console.error("Error updating lead:", error);

      dispatch(
        showNotification({
          message: "Error updating lead. Please try again.",
          status: 2,
        })
      );
    }
  };
  const handleChange = (key, value) => {
    setEditedData((prevData) => ({ ...prevData, [key]: value }));
  };

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const leadData = {
        finalStatus: newStatus,
      };
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const response = await axios.put(`${API}/lead/${leadId}`, leadData, {
            headers,
          });

          console.log("status updated data", response.data);
          dispatch(sliceLeadDeleted(true));

          dispatch(
            showNotification({
              message: "Status Updated Successfully!",
              status: 1,
            })
          );
        }
      } else {
        dispatch(
          showNotification({ message: "Access token not found", status: 1 })
        );
      }
    } catch (error) {
      dispatch(
        showNotification({ message: "Error Status updating", status: 1 })
      );
    }
    // console.log(`Updating status for lead ${leadId} to ${newStatus}`);
  };
  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by Name or Phone Number"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered  w-full max-w-xs"
        />
      </div>

      <TitleCard title={`Total Leads ${leadDetails?.count}`} topMargin="mt-2">
        {filteredLeads?.length === 0 ? (
          <p>No Data Found</p>
        ) : (
          <>
            <div className="overflow-x-auto w-full">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th
                      onClick={() => handleSort("name")}
                      className={`cursor-pointer ${
                        sortConfig.column === "name" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "name"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Name
                    </th>

                    <th
                      onClick={() => handleSort("contact")}
                      className={`cursor-pointer ${
                        sortConfig.column === "contact" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "contact"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Phone Number
                    </th>
                    <th
                      onClick={() => handleSort("assigneeName")}
                      className={`cursor-pointer ${
                        sortConfig.column === "assigneeName" ? "font-bold" : ""
                      } ${
                        sortConfig.column === "assigneeName"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Assignee Name
                    </th>
                    <th
                      onClick={() => handleSort("assigneeContact")}
                      className={`cursor-pointer ${
                        sortConfig.column === "assigneeContact"
                          ? "font-bold"
                          : ""
                      } ${
                        sortConfig.column === "assigneeContact"
                          ? sortConfig.order === "asc"
                            ? "sort-asc"
                            : "sort-desc"
                          : ""
                      }`}
                    >
                      Assignee Contact
                    </th>
                    <th>Assignee Status</th>
                    <th>Final Status</th>

                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads?.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td>
                          {l.modified?.slice(-1)[0]?.date
                            ? format(
                                new Date(l?.modified?.slice(-1)[0]?.date),
                                "dd/MM/yyyy"
                              )
                            : "N/A"}
                        </td>
                        <td>
                          {currentlyEditing === k ? (
                            <input
                              type="text"
                              value={editedData.name}
                              onChange={(e) =>
                                handleChange("name", e.target.value)
                              }
                            />
                          ) : (
                            l.name
                          )}
                        </td>
                        <td>
                          {currentlyEditing === k ? (
                            <input
                              type="text"
                              value={editedData.contact}
                              onChange={(e) =>
                                handleChange("contact", e.target.value)
                              }
                            />
                          ) : (
                            l.contact
                          )}
                        </td>
                        <td>{l.assigned.assignedTo}</td>
                        <td>{l.assigned.assigneeContact}</td>
                        <td>{l.assigned.assigneeStatus}</td>
                        <td>
                          <select
                            value={l.finalStatus}
                            onChange={(e) =>
                              handleStatusChange(l._id, e.target.value)
                            }
                          >
                            <option value="OPENED">OPENED</option>
                            <option value="CLOSED">CLOSED</option>
                          </select>
                        </td>

                        <td>
                          <div className="flex item-center justify-between">
                            <button
                              className="btn btn-square btn-ghost"
                              onClick={() => deleteCurrentLead(l._id)}
                            >
                              <TrashIcon className="w-5" />
                            </button>
                            <div className="flex flex-col items-center justify-center">
                              <button
                                className="btn btn-square btn-ghost"
                                onClick={() => toggleEdit(k)}
                              >
                                {currentlyEditing === k ? "Cancel" : "Edit"}
                              </button>
                              {currentlyEditing === k && (
                                <button
                                  onClick={() => handleSaveEdit(l._id, k)}
                                >
                                  SAVE
                                </button>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex item-center max-sm:flex-col justify-between">
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={leadDetails.count}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <div className="flex items-center max-sm:mt-[15px] max-sm:mx-auto">
                <label className="mr-2 text-sm font-medium">
                  Items Per Page:
                </label>
                <select
                  className="border rounded p-2"
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                >
                  {itemsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </>
        )}
      </TitleCard>
    </>
  );
}

export default TotalAssignedLeads;
