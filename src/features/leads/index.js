import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { addNewLead, getLeadsContent } from "./leadSlice";
import {
  CONFIRMATION_MODAL_CLOSE_TYPES,
  MODAL_BODY_TYPES,
} from "../../utils/globalConstantUtil";
import TrashIcon from "@heroicons/react/24/outline/TrashIcon";

import Pagination from "../../components/Pagination";
import * as XLSX from "xlsx";
import { showNotification } from "../common/headerSlice";

function Leads() {
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

  // Function to find duplicates between two arrays
  const findDuplicates = (arr1, arr2) => {
    const duplicates = [];
    const uniqueValues = new Set(arr1.map((item) => JSON.stringify(item)));

    for (const item of arr2) {
      if (uniqueValues.has(JSON.stringify(item))) {
        duplicates.push(item);
      }
    }

    return duplicates;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });

          const sheetName = workbook.SheetNames[0];

          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

          const duplicates = findDuplicates(localLeads, jsonData);

          if (duplicates.length > 0) {
            dispatch(
              openModal({
                title: `Confirmation`,
                bodyType: MODAL_BODY_TYPES.DUPLICATE_LEADS,
                extraObject: {
                  message: `${duplicates.length} Duplicates Found`,
                  uniqueData: jsonData.filter(
                    (item) => !duplicates.includes(item)
                  ),
                  allData: jsonData,
                },
              })
            );
          } else {
            const updatedLeads = [...leads, ...jsonData];
            dispatch(addNewLead({ newLeadObj: updatedLeads }));
            dispatch(
              showNotification({ message: "New Lead Added!", status: 1 })
            );
          }
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

  // Function to convert the data to XLSX format
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

    return (
      <div className="inline-block float-right">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal()}
        >
          Assign Leads
        </button>
        <label
          htmlFor="xlsxInput"
          className="ml-6 cursor-pointer btn px-6 btn-sm normal-case btn-primary"
        >
          Import XLSX
        </label>
        <input
          type="file"
          id="xlsxInput"
          onChange={handleFileChange}
          className="hidden"
          accept=".xlsx"
        />
        <button
          className="btn ml-6 px-6 btn-sm normal-case btn-primary"
          onClick={onExportXLSX}
        >
          Export XLSX
        </button>
      </div>
    );
  };

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

  // const handleSaveEdit = async (index, updatedLead) => {
  //   await dispatch(editLead({ index, updatedLead }));
  // };


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
          title={`Total Leads ${localLeads.length}`}
          topMargin="mt-2"
          TopSideButtons={<TopSideButtons onExportXLSX={handleExportXLSX} />}
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

                      <td>{getDummyStatus(k)}</td>
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

export default Leads;
