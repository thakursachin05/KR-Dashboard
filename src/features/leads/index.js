import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TitleCard from "../../components/Cards/TitleCard";
import { openModal } from "../common/modalSlice";
import { sliceLeadDeleted } from "./leadSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";

import Pagination from "../../components/Pagination";
import * as XLSX from "xlsx";
import axios from "axios";
import { API } from "../../utils/constants";
import { format } from "date-fns";

function Leads() {
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

  // console.log("lead details from local storage", leadDetails);
  const leadDeleted = useSelector((state) => state.lead.leadDeleted);

  useEffect(() => {
    const fetchData = async () => {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        offset: Math.max(0, currentPage - 1) * 10,
        assignedTo : "null"
      };

      const baseURL = `${API}/lead?`;
      try {
        const response = await axios.get(baseURL, { params: params });

        if (response.status === 200) {
          localStorage.setItem("lead-details", JSON.stringify(response.data));
          setLeadData(response.data);
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

  const handleCSVFileChange = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const csvData = e.target.result;
          const jsonData = csvToJSON(csvData);
          const duplicates = await findDuplicates(jsonData);
          const uniqueDataLength = jsonData?.length - duplicates?.length;
          if (duplicates.length > 0) {
            dispatch(
              openModal({
                title: `Confirmation`,
                bodyType: MODAL_BODY_TYPES.DUPLICATE_LEADS,
                extraObject: {
                  message: `${duplicates?.length} Duplicates Found and ${uniqueDataLength} Unique Data`,
                  uniqueData: jsonData?.filter(
                    (item) => !duplicates?.includes(item)
                  ),
                  allData: jsonData,
                  duplicates: true,
                },
              })
            );
          } else {
            dispatch(
              openModal({
                title: `Confirmation`,
                bodyType: MODAL_BODY_TYPES.DUPLICATE_LEADS,
                extraObject: {
                  message: `Have you cross checked Leads?`,
                  uniqueData: jsonData,
                  allData: jsonData,
                  duplicates: false,
                },
              })
            );
          }
          // Now you can use the jsonData as needed
          console.log(jsonData);
        } catch (error) {
          console.error("Error parsing CSV file:", error);
        }
      };

      reader.readAsText(file);
    }
    fileInput.value = null;
  };

  const csvToJSON = (csvData) => {
    const lines = csvData.split('\n');
    const result = [];
  
    // Trim headers to remove leading and trailing spaces
    const headers = lines[0].split(',').map(header => header.trim());
  
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
  
      if (currentLine.length === headers.length) {
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
          const value = currentLine[j].trim();
          entry[headers[j]] = isNaN(value) ? value : parseFloat(value.replace(/[^\d.]/g, ''));
        }
        result.push(entry);
      }
    }
  
    return result;
  };
  
  

  // Function to find duplicates between two arrays
  const findDuplicates = async (arr2) => {
    let totalLeads = 0;
    try {
      const params = {
        page: 1,
        limit: 10,
        offset: 0,
      };
      const LeadbaseURL = `${API}/lead`;
      const response = await axios.get(LeadbaseURL, { params: params });
      if (response.status === 200) {
        totalLeads = response.data.count;
        console.log(
          "total count of leads to check duplicates",
          response.data.count
        );
      }
    } catch (error) {
      console.log("error", error);
    }

    const params = {
      page: 1,
      limit: totalLeads,
      offset: 0,
    };
    const baseURL = `${API}/lead`;
    try {
      const response = await axios.get(baseURL, { params: params });
      if (response.status === 200) {
        const allData = response.data.data;
        const duplicates = [];
        const uniqueValues = new Set(
          arr2.map((item) => {
            const jsonString = JSON.stringify({
              name: item?.name,
              contact: item?.contact?.toString(),
            });
            // console.log("jsonData, items",item)
            return jsonString;
          })
        );
        for (const item of allData) {
          const stringifiedData = JSON.stringify({
            name: item.name,
            contact: item.contact,
          });
          if (uniqueValues.has(stringifiedData)) {
            duplicates.push(item);
          }
          // console.log("data of lead", JSON.stringify({ name: item.name, contact: item.contact }));
        }

        return duplicates;
      } else {
        console.log("access token incorrect");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleFileChange = async (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];

          const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
          const duplicates = await findDuplicates(jsonData);
          console.log("json data of excel file",jsonData)
          const uniqueDataLength = jsonData?.length - duplicates?.length;
          if (duplicates.length > 0) {
            dispatch(
              openModal({
                title: `Confirmation`,
                bodyType: MODAL_BODY_TYPES.DUPLICATE_LEADS,
                extraObject: {
                  message: `${duplicates?.length} Duplicates Found and ${uniqueDataLength} Unique Data`,
                  uniqueData: jsonData?.filter(
                    (item) => !duplicates?.includes(item)
                  ),
                  allData: jsonData,
                  duplicates: true,
                },
              })
            );
          } else {
            dispatch(
              openModal({
                title: `Confirmation`,
                bodyType: MODAL_BODY_TYPES.DUPLICATE_LEADS,
                extraObject: {
                  message: `Have you cross checked Leads?`,
                  uniqueData: jsonData,
                  allData: jsonData,
                  duplicates: false,
                },
              })
            );
          }
        } catch (error) {
          console.error("Error reading XLSX file:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
    fileInput.value = null;
  };

  const totalItems = leadData?.count;
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

  const sortedLeads = leadData?.data?.slice().sort((a, b) => {
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
      lead.contact?.includes(filterValue)
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
      <div className="flex-wrap gap-[10px] max-sm:mt-[10px] flex justify-center">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal()}
        >
          Assign Leads
        </button>

        <label
          htmlFor="xlsxInput"
          className="cursor-pointer btn px-6 btn-sm normal-case btn-primary"
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

        <label
          htmlFor="csvInput"
          className="cursor-pointer btn px-6 btn-sm normal-case btn-primary"
        >
          Import CSV
        </label>
        <input
          type="file"
          id="csvInput"
          onChange={handleCSVFileChange}
          className="hidden"
          accept=".csv"
        />

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={onExportXLSX}
        >
          Export
        </button>
      </div>
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
          className="input input-sm input-bordered  w-full sm:max-w-xs"
        />
      </div>

      <TitleCard
        title={`Total Leads ${leadData.count}`}
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
                    {/* <th className="text-center">Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads?.map((l, k) => {
                    return (
                      <tr key={k}>
                        <td>
                          {l?.dateAdded
                            ? format(new Date(l?.dateAdded), "dd/MM/yyyy")
                            : "N/A"}
                        </td>
                        <td>{l.name}</td>
                        <td>{l.contact}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex item-center max-sm:flex-col justify-between">
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={leadData.count}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
              <div className="flex items-center max-sm:mt-[15px] max-sm:mx-auto ">
                <label className="mr-2 text-sm font-medium">
                  Items Per Page:
                </label>
                <select
                  className="border rounded p-2  max-sm:p-[.5vw]"
                  value={itemsPerPage}
                  onChange={(e) =>
                    handleItemsPerPageChange(Number(e.target.value))
                  }
                >
                  {itemsPerPageOptions.map((option) => (
                    <option className="max-h-[1vh]" key={option} value={option}>
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

export default Leads;
