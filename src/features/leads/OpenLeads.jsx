import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { sliceLeadDeleted } from "./leadSlice";
import Pagination from "../../components/Pagination";
import { showNotification } from "../common/headerSlice";
import axios from "axios";
import { API } from "../../utils/constants";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { openModal } from "../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
function OpenLeads() {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editedData, setEditedData] = useState({ name: "", contact: "" });
  const [currentlyEditing, setCurrentlyEditing] = useState(null);

  const [sortConfig, setSortConfig] = useState({
    column: "name",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // const leadDetails = JSON.parse(localStorage.getItem("lead-details"));
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        offset: Math.max(0, currentPage - 1) * itemsPerPage,
        assignedTo: "null",
        dateClosed: "null",
      };
      const baseURL = `${API}/lead`;
      try {
        const response = await axios.get(baseURL, { params: params });
        if (response.status === 200) {
          localStorage.setItem(
            "fresh-lead-count",
            JSON.stringify(response.data.count)
          );
          setLeadData(response.data);
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

  const itemsPerPageOptions =
    leadData?.count > 200
      ? [10, 50, 100, 200, leadData?.count]
      : [10, 50, 100, 200];

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

  const sortedLeads = leadData?.data?.slice().sort((a, b) => {
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
      lead?.assignedTo?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.assigneeContact?.includes(filterValue) ||
      lead?.assigneeStatus?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.finalStatus?.toLowerCase().includes(filterValue?.toLowerCase())
    );
  });

  const convertDataToXLSX = (data) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    const blob = XLSX.write(wb, {
      bookType: "xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      type: "binary",
    });

    // Convert the binary string to a Blob
    const blobData = new Blob([s2ab(blob)], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    return blobData;
  };

  // Utility function to convert binary string to ArrayBuffer
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  };

  // Function to trigger the download
  const downloadXLSX = (data) => {
    const blob = convertDataToXLSX(data);
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "exported_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLSX = () => {
    // Assuming you have an array of objects representing the table data
    const dataToExport = filteredLeads;

    downloadXLSX(dataToExport);
  };

  const TopSideButtons = ({ onExportXLSX }) => {
    const dispatch = useDispatch();

    const openAddNewLeadModal = () => {
      dispatch(
        openModal({
          title: "Assign Leads",
          bodyType: MODAL_BODY_TYPES.ASSIGN_LEADS,
          extraObject: {
            message: `Choose employees to assign`,
          },
        })
      );
    };

    const deleteLeads = async () => {
      dispatch(
        openModal({
          title: "Confirmation",
          bodyType: MODAL_BODY_TYPES.CONFIRMATION,
          extraObject: {
            message: `Are you sure you want to delete ALL leads?`,
            type: CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_ALL_LEAD,
            params: {
              assignedTo: "null",
              dateClosed: "null",
            },
          },
        })
      );
    };

    return (
      <div className="flex-wrap gap-[10px] max-sm:mt-[10px] flex justify-center">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => deleteLeads()}
        >
          Delete Leads
        </button>
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal()}
        >
          Assign Leads
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={onExportXLSX}
        >
          Export Leads
        </button>
      </div>
    );
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

      <TitleCard
        title={`Not Assigned Leads ${leadData?.count}`}
        topMargin="mt-2"
        TopSideButtons={<TopSideButtons onExportXLSX={handleExportXLSX} />}
      >
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
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads?.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td>
                          {l?.dateAdded
                            ? format(new Date(l?.dateAdded), "dd/MM/yyyy")
                            : "N/A"}
                        </td>
                        <td>{l.name}</td>
                        <td>{l.contact}</td>
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
                totalItems={leadData?.count}
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

export default OpenLeads;
