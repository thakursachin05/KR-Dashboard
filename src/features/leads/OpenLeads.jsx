import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { sliceLeadDeleted } from "./leadSlice";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { API } from "../../utils/constants";
import { format } from "date-fns";

function OpenLeads() {
  const dispatch = useDispatch();
  const [leadData, setLeadData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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

  const leadDetails = JSON.parse(localStorage.getItem("lead-details"));
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        offset: Math.max(0, currentPage - 1) * 10,
        modifiedDate: "notToday",
        assigneeStatus: "OPENED",
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
                    {/* <th className="text-center">Action</th> */}
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
                          {l.name}
                        </td>
                        <td>                           
                          { l.contact}
                        </td>
                        <td>{l.assigned.assignedTo}</td>
                        <td>{l.assigned.assigneeContact}</td>
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

export default OpenLeads;
