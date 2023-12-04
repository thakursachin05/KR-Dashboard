import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import {  getLeadsContent } from "../../leads/leadSlice";
import { openModal } from "../../common/modalSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import TitleCard from "../../../components/Cards/TitleCard";
import Pagination from "../../../components/Pagination";

function TeamMembers() {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state.lead);
  const [localLeads, setLocalLeads] = useState([]);
  const [editableRows, setEditableRows] = useState([]);

  useEffect(() => {
    dispatch(getLeadsContent());
  }, [dispatch]);

  useEffect(() => {
    setLocalLeads(leads);
  }, [leads]);

  const getDummyStatus = (index) => {
    if (index % 5 === 0) return <div className="badge">Not Interested</div>;
    else if (index % 5 === 1)
      return <div className="badge badge-primary">In Progress</div>;
    else if (index % 5 === 2)
      return <div className="badge badge-secondary">Sold</div>;
    else if (index % 5 === 3)
      return <div className="badge badge-accent">Need Followup</div>;
    else return <div className="badge badge-ghost">Open</div>;
  };

  const deleteCurrentLead = (index) => {
    dispatch(
      openModal({
        title: "Confirmation",
        bodyType: MODAL_BODY_TYPES.CONFIRMATION,
        extraObject: {
          message: `Are you sure you want to delete this Member?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_DELETE,
          index,
        },
      })
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLeads = localLeads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = localLeads.length;
  const itemsPerPageOptions = Array.from(
    { length: Math.ceil(totalItems / 10) },
    (_, index) => (index + 1) * 10
  );

  const [sortConfig, setSortConfig] = useState({
    column: "STUDENTNAME",
    order: "asc",
  });

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

  const sortedLeads = currentLeads.slice().sort((a, b) => {
    const aValue = a[sortConfig.column] || "";
    const bValue = b[sortConfig.column] || "";

    if (sortConfig.order === "asc") {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  const [filterValue, setFilterValue] = useState("");

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
  };

  const filteredLeads = sortedLeads.filter((lead) => {
    return (
      lead.STUDENTNAME.toLowerCase().includes(filterValue.toLowerCase()) ||
      lead.STCELLNO.includes(filterValue)
    );
  });


  const toggleEdit = (index) => {
    setEditableRows((prevEditableRows) => {
      const updatedRows = [...prevEditableRows];
      updatedRows[index] = !updatedRows[index];
      return updatedRows;
    });
  };

  const handleEditChange = (index, field, value) => {
    setLocalLeads((prevLeads) => {
      const updatedLeads = [...prevLeads];
      const updatedLead = { ...updatedLeads[index], [field]: value };
      updatedLeads[index] = updatedLead;
      return updatedLeads;
    });
  };

  const StatusEditRow = ({ index, initialStatus, onSave }) => {
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);

    return (
      <td>
        {editableRows[index] ? (
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
        )}
      </td>
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
      {filteredLeads.length === 0 ? (
        <p>No Data Found</p>
      ) : (
        <TitleCard
          title={`Total Team Members ${localLeads.length}`}
          topMargin="mt-2"
        //   TopSideButtons={<TopSideButtons onExportXLSX={handleExportXLSX} />}
        >
          <div className="overflow-x-auto w-full">
            <table className="table w-full">
              <thead>
                <tr>
                  <th
                    onClick={() => handleSort("STUDENTNAME")}
                    className={`cursor-pointer ${
                      sortConfig.column === "STUDENTNAME" ? "font-bold" : ""
                    } ${
                      sortConfig.column === "STUDENTNAME"
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
                    onClick={() => handleSort("STCELLNO")}
                    className={`cursor-pointer ${
                      sortConfig.column === "STCELLNO" ? "font-bold" : ""
                    } ${
                      sortConfig.column === "STCELLNO"
                        ? sortConfig.order === "asc"
                          ? "sort-asc"
                          : "sort-desc"
                        : ""
                    }`}
                  >
                    Phone Number
                  </th>
                  <th>Status</th>
                  <th>Enrollment Number</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>
                        {editableRows[k] ? (
                          <input
                            type="text"
                            value={l.STUDENTNAME}
                            onChange={(e) =>
                              handleEditChange(k, "STUDENTNAME", e.target.value)
                            }
                          />
                        ) : (
                          l.STUDENTNAME
                        )}
                      </td>

                      <td>
                        {editableRows[k] ? (
                          <input
                            type="text"
                            value={l.STTIETEMAILID}
                            onChange={(e) =>
                              handleEditChange(
                                k,
                                "STTIETEMAILID",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          l.STTIETEMAILID
                        )}
                      </td>
                      <td>{l.STCELLNO}</td>

                      <StatusEditRow
                        index={k}
                        initialStatus={getDummyStatus(k)}
                        onSave={(index, newStatus) => {
                          // Implement logic to save the new status
                          console.log("Saving status:", newStatus);
                        }}
                      />
                      <td>{l.ENROLLMENTNO}</td>
                      <td>
                        <div className="flex item-center justify-between">
                          <button
                            className="btn btn-square btn-ghost"
                            onClick={() => deleteCurrentLead(k)}
                          >
                            <TrashIcon className="w-5" />
                          </button>
                          <button
                            className="btn btn-square btn-ghost"
                            onClick={() => toggleEdit(k)}
                          >
                            {editableRows[k] ? "Save" : "Edit"}
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
              totalItems={localLeads.length}
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
