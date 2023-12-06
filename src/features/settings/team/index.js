import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
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

function TeamMembers() {
  const dispatch = useDispatch();
  // const [employee, setEmployee] = useState([]);
  // const [editableRows, setEditableRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({
    column: "name",
    order: "asc",
  });
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      // const params = {
      //   page: currentPage,
      //   limit: itemsPerPage,
      //   offset : ((Math.max(0,itemsPerPage-1))/10)
      // };
      const baseURL = `${API}/employee`;
      try {
        const response = await axios.get(baseURL);

        localStorage.setItem("employee-details", JSON.stringify(response.data));
        // console.log("employees data", response.data.data);
        // setEmployee(response.data.data);
      } catch (error) {
        console.log("eror", error);
      }
    };
    fetchData();
  }, [itemsPerPage, currentPage]);

  const employeeData = JSON.parse(localStorage.getItem("employee-details"));
  // console.log("employueee data count",employeeData.count)

  const   deleteCurrentLead = (id) => {
    console.log("index os in delete popup",id)
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this Member?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_DELETE,
            index : id
          // index,
        },
      })
    );
  };

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = employeeData ? employeeData.count : 0;
  const itemsPerPageOptions = Array.from(
    { length: Math.ceil(totalItems / 10) },
    (_, index) => (index + 1) * 10
  );

  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentMembers = employee.slice(indexOfFirstItem, indexOfLastItem);

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

  const sortedLeads = employeeData?.data?.slice().sort((a, b) => {
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
      lead.name.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead.contact.includes(filterValue) ||
      lead.activityStatus.includes(filterValue)
    );
  });

  // const toggleEdit = (index) => {
  //   setEditableRows((prevEditableRows) => {
  //     const updatedRows = [...prevEditableRows];
  //     updatedRows[index] = !updatedRows[index];
  //     return updatedRows;
  //   });
  // };

  // const handleEditChange = (index, field, value) => {
  //   setEmployee((prevLeads) => {
  //     const updatedLeads = [...prevLeads];
  //     const updatedLead = { ...updatedLeads[index], [field]: value };
  //     updatedLeads[index] = updatedLead;
  //     return updatedLeads;
  //   });
  // };

  const StatusEditRow = ({ initialStatus }) => {
    // const [selectedStatus, setSelectedStatus] = useState(initialStatus);

    return (
      <td>
        {/* {editableRows[index] ? (
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              //   onChange={(e) =>
              //     handleEditChange(index, "STATUS", e.target.value)
              //   }
            >
              <option value="Hold">Hold</option>
              <option value="Active">Active</option>
              <option value="Dead">Dead</option>
            </select>
          </div>
        ) : (
          <span>{initialStatus}</span>
        )} */}

        <span>{initialStatus}</span>
      </td>
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
          title={`Total Team Members ${employeeData?.count}`}
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
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads?.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>{l.name}</td>
                      <td>{l.email}</td>
                      <td>{l.contact}</td>
                      <StatusEditRow
                        index={k}
                        initialStatus={l.activityStatus}
                        onSave={(index, newStatus) => {
                          console.log("Saving status:", newStatus);
                        }}
                      />
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
          <div className="flex item-center justify-between">
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={employeeData?.count}
              currentPage={currentPage}
              onPageChange={handlePageChange}
            />
            <div className="flex items-center">
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
        </TitleCard>
      )}
    </>
  );
}

export default TeamMembers;
