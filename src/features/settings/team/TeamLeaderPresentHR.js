import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TitleCard from "../../../components/Cards/TitleCard";
import Pagination from "../../../components/Pagination";
import axios from "axios";
import { API } from "../.../../../../utils/constants";
import { sliceMemberDeleted, sliceMemberStatus } from "../../leads/leadSlice";
import { showNotification } from "../../common/headerSlice";
import { format } from "date-fns";
import * as XLSX from "xlsx";
import { useParams } from "react-router-dom";

function TeamLeaderPresentHR() {
  const { teamLeaderId } = useParams();
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
  const tlDataString = localStorage.getItem("tlData");
  let tlData;

  if (tlDataString) {
    tlData = JSON.parse(tlDataString);
  }
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
      const todayDate = new Date().toISOString().split("T")[0];

      const params = {
        page: currentPage,
        limit: itemsPerPage,
        offset: Math.max(0, currentPage - 1) * itemsPerPage,
        teamLeaderId: teamLeaderId,
        presentDays: todayDate,
      };
      const baseURL = `${API}/employee`;
      try {
        const response = await axios.get(baseURL, { params: params });
        localStorage.setItem(
          "total-member-count",
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
    teamLeaderId,
    memberStatus,
    dispatch,
    currentPage,
  ]);

  const deleteCurrentLead = (id) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this Member?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_DELETE,
          index: id,
        },
      })
    );
  };

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

  const ChangeTeamLeader = (hrId) => {
    dispatch(
      openModal({
        title: "Change Team Leader",
        bodyType: MODAL_BODY_TYPES.CHANGE_TL,
        extraObject: {
          message: `Enter the phone number of Team Leader`,
          type: MODAL_BODY_TYPES.CHANGE_TL,
          hrId: hrId,
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

          dispatch(sliceMemberStatus(newStatus));
          dispatch(
            showNotification({
              message: `Status updated Successfully!`,
              status: 1,
            })
          );
        }
      } else {
        dispatch(
          showNotification({
            message: `Access Token not found`,
            status: 0,
          })
        );
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({ message: `Error in updating Status`, status: 0 })
        );
      }
    }
  };

  const handleRoleChange = async (memberId, newStatus) => {
    try {
      const storedToken = localStorage.getItem("accessToken");
      const employeeData = {
        role: [newStatus],
        teamLeaderId: null,
        calledLeads: [],
        presentDays: [],
      };
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const response = await axios.put(
            `${API}/employee/${memberId}`,
            employeeData,
            {
              headers,
            }
          );

          dispatch(sliceMemberStatus(newStatus));
          dispatch(
            showNotification({
              message: `${response.data.message}`,
              status: 1,
            })
          );
        }
      } else {
        dispatch(
          showNotification({
            message: `Access Token not found`,
            status: 0,
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
      lead?.name?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.contact?.includes(filterValue) ||
      lead?.activityStatus?.toLowerCase().includes(filterValue.toLowerCase())
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

  const handleExportXLSX = async () => {
    const params = {
      limit: teamMember.count,
      offset: 0,
      teamLeaderId: teamLeaderId,
      presentDays: todayDate,
    };
    const baseURL = `${API}/employee`;
    try {
      const response = await axios.get(baseURL, { params: params });
      downloadXLSX(response.data.data);

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
          className="input input-sm input-bordered  w-full sm:max-w-xs"
        />
      </div>

      <TitleCard
        title={`${teamMember?.count} HR Present Today under TL ${tlData?.name}`}
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
                    <th>Joined On</th>
                    <th>Role</th>

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
                    <th>Status</th>
                    <th>Attendance</th>
                    <th>RollBack Leads</th>
                    <th>RollBack Date</th>
                    <th>Changle TL</th>
                    <td>Last Lead </td>
                    <td>Called </td>
                    <td>Closed </td>
                    <td>Date Assigned</td>

                    <th>Email Id</th>

                    <th>Open Leads</th>
                    <th>Action</th>
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
                        <td>
                          {l.approvedAt
                            ? format(new Date(l?.approvedAt), "dd/MM/yyyy")
                            : "N/A"}
                        </td>
                        <td>
                          <select
                            value={l.role?.[0]}
                            onChange={(e) =>
                              handleRoleChange(l._id, e.target.value)
                            }
                          >
                            <option value="HR">HR</option>
                            <option value="TL">TL</option>
                          </select>
                        </td>
                        <td>{l.name}</td>

                        <td>{l.contact}</td>
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
                        <td>
                          {l.leadsWithdrawn[0] ? l.leadsWithdrawn[0].count : 0}
                        </td>
                        <td>
                          {l.leadsWithdrawn[0]
                            ? format(
                                new Date(l?.leadsWithdrawn[0].date),
                                "dd/MM/yyyy"
                              )
                            : "N/A"}
                        </td>
                        <td>
                          <button
                            onClick={() => ChangeTeamLeader(l._id)}
                            className={`btn ${
                              l.teamLeaderName ? "btn-primary" : "btn-secondary"
                            }  normal-case btn-sm`}
                          >
                            {l.teamLeaderName ? "Change" : "Assign"}
                          </button>
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

                        <td>{l.email}</td>

                        <td className="text-center">
                          <button
                            onClick={() => WithdrawLeads(l.contact)}
                            className="btn btn-primary  normal-case btn-sm"
                          >
                            Withdraw
                          </button>
                        </td>
                        <td>
                          <div className="flex item-center justify-between">
                            <button
                              className="btn btn-square btn-ghost"
                              onClick={() => deleteCurrentLead(l._id)}
                            >
                              <TrashIcon className="w-5" />
                            </button>
                          </div>
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
          </>
        )}
      </TitleCard>
    </>
  );
}

export default TeamLeaderPresentHR;
