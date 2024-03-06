import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { API } from "../../utils/constants";
import { sliceMemberDeleted } from "../leads/leadSlice";
import { showNotification } from "../common/headerSlice";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";
import { format } from "date-fns";

function UserPreviousLeads() {
  const dispatch = useDispatch();
  const [teamMember, setTeamMember] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");

  const memberDeleted = useSelector((state) => state.lead.memberDeleted);
  const storeUserData = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        // page: currentPage,
        limit: 1000,
        offset: 0,
        assignedDate: "notToday",
        dateClosed: "null",
      };
      const baseURL = `${API}/lead?&assigneeId=${storeUserData?._id}`;
      try {
        const response = await axios.get(baseURL, { params: params });
        localStorage.setItem("lead-details", JSON.stringify(response.data));
        setTeamMember(response.data.data);
      } catch (error) {
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        }
        // console.error("error", error);
      }
      dispatch(sliceMemberDeleted(false));
    };

    fetchData();
  }, [storeUserData._id, memberDeleted, dispatch]);

  const employeeData = JSON.parse(localStorage.getItem("lead-details"));

  const handleStatusChange = async (leadId, newStatus) => {
    // console.log("member id", leadId);
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const istDate = new Date(Date.now() + IST_OFFSET);
    const todayIST = istDate.toISOString().split("T")[0];
    try {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          await axios.put(
            `${API}/lead/${leadId}`,
            {
              assigneeStatus: newStatus,
              dateClosed: todayIST,
            },
            {
              headers,
            }
          );

          // console.log("status updated data", response.data);
          dispatch(sliceMemberDeleted(true));

          dispatch(
            showNotification({
              message: "Status Updated Successfully!",
              status: 1,
            })
          );
        }
      } else {
        dispatch(
          showNotification({ message: "Access token not found", status: 0 })
        );
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      }else{
      dispatch(
        showNotification({ message: "Error Status updating", status: 0 })
      );
      }
    }
  };

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

  const sortedLeads = teamMember?.slice().sort((a, b) => {
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
      lead?.activityStatus?.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead?.assigned?.assigneeStatus
        ?.toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  });

  return (
    <>
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="Filter by Name or Phone"
          value={filterValue}
          onChange={handleFilterChange}
          className="input input-sm input-bordered  w-full max-w-xs"
        />
      </div>
      {filteredLeads?.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <TitleCard
          title={`Previous Assigned Leads ${employeeData?.count}`}
          topMargin="mt-2"
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

                  <th>Assigned Date</th>

                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>{l.name}</td>

                      <td>{l.contact}</td>
                      <td>
                        <select
                          value={l.assigneeStatus}
                          onChange={(e) =>
                            handleStatusChange(l._id, e.target.value)
                          }
                        >
                          <option value="OPENED">Opened</option>
                          <option value="CLOSED">Closed</option>
                        </select>
                      </td>
                      <td>
                        {l.assignedDate
                          ? format(new Date(l?.assignedDate), "dd/MM/yyyy")
                          : "N/A"}
                      </td>
                      <td>
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() =>
                            (window.location.href = `tel:${l._contact}`)
                          }
                        >
                          <PhoneIcon className="w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </TitleCard>
      )}
    </>
  );
}

export default UserPreviousLeads;
