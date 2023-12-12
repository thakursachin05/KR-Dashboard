import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { API } from "../../utils/constants";
import { sliceLeadDeleted } from "../leads/leadSlice";
import { showNotification } from "../common/headerSlice";
import PhoneIcon from "@heroicons/react/24/outline/PhoneIcon";

function UserTodayLeads() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [teamMember, setTeamMember] = useState([]);
  const [leadCount,setLeadCount] = useState('')
  const [sortConfig, setSortConfig] = useState({
    column: "",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");

  const storeUserData = JSON.parse(localStorage.getItem("user"));
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Define daysOfWeek array
        const daysOfWeek = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];

        // Step 1: Fetch employee count
        const countParams = { limit: 0 };
        const employeeCountResponse = await axios.get(`${API}/employee`, {
          params: countParams,
        });
        const employeeCount = employeeCountResponse.data.count;

        // Step 2: Fetch all employee data
        const allEmployeeParams = { page: 0, limit: employeeCount, offset: 0 };
        const allEmployeeResponse = await axios.get(`${API}/employee`, {
          params: allEmployeeParams,
        });
        const allEmployeeData = allEmployeeResponse.data.data;

        // Step 3: Find the index of the current user
        const userid = storeUserData._id;
        const indexOfUser = allEmployeeData.findIndex(
          (employee) => employee._id === userid
        );

        if (indexOfUser !== -1) {
          // Step 4: Fetch leads count array
          const leadsCountResponse = await axios.get(`${API}/leadsCount`);
          const leadsCountArray = leadsCountResponse.data?.days;
          console.log("leads count array",leadsCountArray)

          // Step 5: Get lead count for today
          const todayDayOfWeek = new Date()
            .toLocaleDateString("en-US", { weekday: "long" })
            .toLowerCase();
          const todayLeadCount =
            leadsCountArray[daysOfWeek.indexOf(todayDayOfWeek)-1];

            console.log("today wekk ",todayDayOfWeek)
            console.log("todayLeadCount",todayLeadCount)
            console.log("index of user",indexOfUser)


          // Step 6: Fetch leads based on lead count and user index
          const todayLeadParams = {
            limit: todayLeadCount,
            offset: (indexOfUser-1) * (todayLeadCount),
          };
          const todayLeadResponse = await axios.get(`${API}/daywiseLeads?day=${todayDayOfWeek}`, {
            params: todayLeadParams,
          });
          const todayLeadData = todayLeadResponse.data;
          localStorage.setItem("lead-details",JSON.stringify(todayLeadResponse.data))
          setTeamMember(todayLeadResponse.data.data)
          // Now you can use todayLeadData as needed
          console.log("Today's leads:", todayLeadData);
        } else {
          console.log("User not found in employee data");
        }
      } catch (error) {
        console.error("Error during data fetching:", error);
      }
    };

    fetchData();
  }, [storeUserData._id]); // Only trigger the effect when storeUserData._id changes

  const employeeData = JSON.parse(localStorage.getItem("lead-details"));

  const handleStatusChange = async (leadId, newStatus) => {
    console.log("member id", leadId);
    try {
      const storedToken = localStorage.getItem("accessToken");
      if (storedToken) {
        const accessToken = JSON.parse(storedToken).token;

        if (accessToken) {
          const headers = {
            Authorization: `Bearer ${accessToken}`,
          };

          const response = await axios.put(
            `${API}/lead/${leadId}`,
            {
              assigned: {
                assigneeStatus: newStatus,
              },
            },
            {
              headers,
            }
          );

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
        showNotification({ message: "Error Status updating", status: 0 })
      );
    }
  };

  const totalItems = employeeData?.count;

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
      lead?.assigned.assigneeStatus
        ?.toLowerCase()
        .includes(filterValue.toLowerCase())
    );
  });

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
          <div className="flex  max-sm:flex-col item-center justify-between">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={employeeData?.count}
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

export default UserTodayLeads;
