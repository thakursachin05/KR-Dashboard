import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import axios from "axios";
import { API } from "../../utils/constants";
import { sliceLeadDeleted } from "../leads/leadSlice";
import { showNotification } from "../common/headerSlice";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";

function UserTodayLeads() {
  const dispatch = useDispatch();
  const [teamMember, setTeamMember] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    column: "",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");

  const storedUserData = JSON.parse(localStorage.getItem("user"));

  const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  useEffect(() => {
    const fetchData = async () => {
      const IST_OFFSET = 5.5 * 60 * 60 * 1000;
      const istDate = new Date(Date.now() + IST_OFFSET);
      const todayIST = istDate.toISOString().split("T")[0];
      const params = {
        limit: 250,
        offset: 0,
        // createdAt: todayIST,
        assignedDate: todayIST,

        assigneeId: storedUserData?._id,
        dateClosed: "null",
      };
      const baseURL = `${API}/lead`;
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
      dispatch(sliceLeadDeleted(false));
    };

    fetchData();
  }, [leadDeleted, storedUserData._id, dispatch]);

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

          await axios.put(
            `${API}/employee/${storedUserData._id}/closedLead`,
            { leadId },
            {
              headers,
            }
          );

          // console.log("status updated data", response.data);
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
          showNotification({ message: "Access token not found", status: 0 })
        );
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({ message: "Error Status updating", status: 0 })
        );
      }
    }
  };

  const handleCalled = async (leadId) => {
    try {
      const tokenResponse = localStorage.getItem("accessToken");

      if (tokenResponse) {
        const tokenData = JSON.parse(tokenResponse);
        const token = tokenData.token;

        if (token) {
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          await axios.put(
            `${API}/lead/${leadId}`,
            {
              assigneeStatus: "CALLED",
            },
            config
          );

          await axios.put(
            `${API}/employee/${storedUserData._id}/callLead`,
            { leadId },
            config
          );

          localStorage.setItem("user", JSON.stringify(storedUserData));

          // console.log("status updated data", response.data);
          dispatch(sliceLeadDeleted(true));
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
      }
      // dispatch(
      //   showNotification({ message: "Error Status updating", status: 0 })
      // );
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
      lead?.assigneeStatus?.toLowerCase().includes(filterValue.toLowerCase())
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
          title={`Today Assigned Leads ${employeeData?.count}`}
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
                        <a href={`tel:${l.contact}`}>
                          <div
                            onClick={() => handleCalled(l._id)}
                            className="btn btn-square btn-ghost"
                          >
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
        </TitleCard>
      )}
    </>
  );
}

export default UserTodayLeads;
