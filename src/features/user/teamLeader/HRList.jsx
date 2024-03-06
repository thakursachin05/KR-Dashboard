import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../../components/Cards/TitleCard";
import Pagination from "../../../components/Pagination";
import axios from "axios";
import { API } from "../../../utils/constants";
import { sliceMemberDeleted, sliceMemberStatus } from "../../leads/leadSlice";
import { showNotification } from "../../common/headerSlice";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { PhoneIcon } from "@heroicons/react/24/outline";

function HRList() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [teamMember, setTeamMember] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");

  const memberDeleted = useSelector((state) => state.lead.memberDeleted);
  const memberStatus = useSelector((state) => state.lead.memberStatus);
  const storeUserData = JSON.parse(localStorage.getItem("user"));

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const todayDate = new Date().toISOString().split("T")[0];

  const isSameDate = (date1, date2) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        offset: Math.max(0, (currentPage - 1) * itemsPerPage),
        teamLeaderId: storeUserData._id,
      };
      const baseURL = `${API}/employee`;
      try {
        const response = await axios.get(baseURL, { params: params });
        localStorage.setItem(
          "active-member-count",
          JSON.stringify(response.data.count)
        );
        setTeamMember(response.data);
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        console.error("error", error);
      }
      dispatch(sliceMemberStatus(""));
      dispatch(sliceMemberDeleted(false));
    };

    fetchData();
  }, [
    itemsPerPage,
    memberDeleted,
    storeUserData._id,
    memberStatus,
    dispatch,
    currentPage,
  ]);

  const WithdrawLeads = (contact) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to withdraw all open leads of this Member?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.WITHDRAW_LEADS,
          contact: contact,
        },
      })
    );
  };
  const handleStatusChange = async (memberId, newStatus) => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const employeeData = {
        activityStatus: newStatus,
      };
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          await axios.put(`${API}/employee/${memberId}`, employeeData, {
            headers,
          });

          // console.log("status updated data", response.data);
          dispatch(sliceMemberStatus(newStatus));
          dispatch(
            showNotification({
              message: `Status Updated Successfully!`,
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
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({
            message: `Error in updating status`,
            status: 0,
          })
        );
      }
    }
  };

  const itemsPerPageOptions =
    teamMember?.count > 200
      ? [10, 50, 200, teamMember?.count]
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

  const sortedLeads = teamMember?.data?.slice().sort((a, b) => {
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
      lead.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead.contact?.includes(filterValue) ||
      lead.activityStatus?.toLowerCase().includes(filterValue.toLowerCase())
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
    link.download = `HR_List_${todayDate}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLSX = () => {
    const dataToExport = filteredLeads;

    downloadXLSX(dataToExport);
  };

  const TopSideButtons = ({ onExportXLSX }) => {
    return (
      <div className="flex-wrap gap-[10px] max-sm:mt-[10px] flex justify-center">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={onExportXLSX}
        >
          Export HR
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by Name or Phone or Status"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered  w-full max-w-xs"
        />
      </div>
      {filteredLeads?.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <TitleCard
          title={`Total HR ${teamMember?.count}`}
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onExportXLSX={handleExportXLSX} />}
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
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

                  <th>Email Id</th>
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
                  <th>Attendance</th>

                  <td>Last Lead Assigned</td>
                  <td>Called Leads</td>
                  <td>Closed Leads</td>

                  <td>Last Date Assigned</td>
                  <td>Activity Status</td>
                  <td>Open Leads</td>
                  <td>Call</td>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((l, k) => {
                  return (
                    <tr
                      key={k}
                      className={
                        l.activityStatus !== "ACTIVE" ? "text-red-600" : ""
                      }
                    >
                      <td>{l.name}</td>
                      <td>{l.email}</td>
                      <td>{l.contact}</td>
                      <td>
                        <div
                          className={`btn ${
                            l.presentDays.some((date) =>
                              isSameDate(new Date(date), new Date(todayDate))
                            )
                              ? "btn-success"
                              : "btn-tertiary"
                          } normal-case btn-sm`}
                        >
                          {l.presentDays.some((date) =>
                            isSameDate(new Date(date), new Date(todayDate))
                          )
                            ? "Present"
                            : "Absent"}
                        </div>
                      </td>
                      <td>{l.lastNumberOfLeadAssigned}</td>
                      <td>{l.calledLeads ? l.calledLeads.length : 0}</td>
                      <td>{l.closedLeads ? l.closedLeads.length : 0}</td>

                      <td>
                        {l.lastDateLeadAssigned
                          ? format(
                              new Date(l?.lastDateLeadAssigned),
                              "dd/MM/yyyy"
                            )
                          : "N/A"}
                      </td>
                      <td>
                        <select
                          value={l.activityStatus}
                          onChange={(e) =>
                            handleStatusChange(l._id, e.target.value)
                          }
                        >
                          <option value="HOLD">Hold</option>
                          <option value="DEAD">Dead</option>
                          <option value="ACTIVE">Active</option>
                        </select>
                      </td>
                      <td className="text-center">
                        <button
                          onClick={() => WithdrawLeads(l.contact)}
                          className="btn btn-primary  normal-case btn-sm"
                        >
                          Withdraw
                        </button>
                      </td>
                      <td>
                        <a href={`tel:${l.contact}`}>
                          <div className="btn btn-square btn-ghost">
                            <PhoneIcon className="w-5" />
                          </div>
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex  max-sm:flex-col item-center justify-between">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={teamMember?.count}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            <div className="flex items-center max-sm:mt-[20px] justify-center">
              <label className="mr-2   text-sm font-medium">
                Items Per Page:
              </label>
              <select
                className="border rounded p-2 max-sm:p-[.5vw]"
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
        </TitleCard>
      )}
    </>
  );
}

export default HRList;
