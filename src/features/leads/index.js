import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { getLeadsContent } from "./leadSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";
import Pagination from "../../components/Pagination";
import * as XLSX from "xlsx";

const TopSideButtons = () => {
  const dispatch = useDispatch();

  const openAddNewLeadModal = () => {
    dispatch(
      openModal({
        title: "Add New Lead",
        bodyType: MODAL_BODY_TYPES.LEAD_ADD_NEW,
      })
    );
  };

  return (
    <div className="inline-block float-right">
      <button
        className="btn px-6 btn-sm normal-case btn-primary"
        onClick={() => openAddNewLeadModal()}
      >
        Add New
      </button>
    </div>
  );
};

function Leads() {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state.lead);
  const [localLeads, setLocalLeads] = useState([]);

  useEffect(() => {
    dispatch(getLeadsContent());
  }, [dispatch]);

  useEffect(() => {
    setLocalLeads(leads); // Use setLocalLeads to update the localLeads state
  }, [leads]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          // Assuming you have a single sheet in your workbook
          const sheetName = workbook.SheetNames[0];
          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          // Update localLeads state with the new data
          setLocalLeads((prevLeads) => [...prevLeads, ...jsonData]);
        } catch (error) {
          console.error("Error reading XLSX file:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

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
          message: `Are you sure you want to delete this lead?`,
          type: CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE,
          index,
        },
      })
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // You can adjust this based on your preference

  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page when changing items per page
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

  return (
    <>
      <div className="mb-4 flex items-center">
        <label className="mr-2 text-sm font-medium">Items Per Page:</label>
        <select
          className="border rounded p-2"
          value={itemsPerPage}
          onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
        >
          {itemsPerPageOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filter by Name or Phone Number"
          value={filterValue}
          onChange={handleFilterChange}
          className="border rounded p-2 ml-4"
        />
        <div className="ml-6">
          <input type="file" onChange={handleFileChange} />
        </div>
      </div>
      {sortedLeads.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <TitleCard
          title="Current Leads"
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons />}
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((l, k) => {
                  return (
                    <tr key={k}>
                      <td>{l.STUDENTNAME}</td>

                      <td>{l.STTIETEMAILID}</td>
                      <td>{l.STCELLNO}</td>

                      <td>{getDummyStatus(k)}</td>
                      <td>{l.ENROLLMENTNO}</td>
                      <td>
                        <button
                          className="btn btn-square btn-ghost"
                          onClick={() => deleteCurrentLead(k)}
                        >
                          <TrashIcon className="w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={localLeads.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </TitleCard>
      )}
    </>
  );
}

export default Leads;
