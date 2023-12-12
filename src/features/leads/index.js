import { useDispatch } from "react-redux";
import { openModal } from "../common/modalSlice";
import { MODAL_BODY_TYPES } from "../../utils/globalConstantUtil";
import csvImage from "../../assets/images/csv_upload.png";
import excelImage from "../../assets/images/excel_upload.png";

import * as XLSX from "xlsx";
function Leads() {
  const dispatch = useDispatch();
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
          console.log("json data is ", jsonData);
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
        } catch (error) {
          console.error("Error reading XLSX file:", error);
        }
      };

      reader.readAsArrayBuffer(file);
    }
    fileInput.value = null;
  };

  const handleCSVFileChange = (e) => {
    const fileInput = e.target;
    const file = fileInput.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const csvData = e.target.result;
          const jsonData = csvToJSON(csvData);
          console.log("json data of csv file", jsonData);
          console.log("jsondata size", jsonData.length);

          dispatch(
            openModal({
              title: `Confirmation`,
              bodyType: MODAL_BODY_TYPES.DUPLICATE_LEADS,
              extraObject: {
                message: `Have you cross checked Leads?`,
                allData: jsonData,
              },
            })
          );
          // Now you can use the jsonData as needed
        } catch (error) {
          console.error("Error parsing CSV file:", error);
        }
      };

      reader.readAsText(file);
    }
    fileInput.value = null;
  };

  const csvToJSON = (csvData) => {
    const lines = csvData.split("\n");
    const result = [];

    // Trim headers to remove leading and trailing spaces
    const headers = lines[0].split(",").map((header) => header.trim());

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");

      if (currentLine.length === headers.length) {
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
          const value = currentLine[j].trim();
          entry[headers[j]] = isNaN(value)
            ? value
            : parseFloat(value.replace(/[^\d.]/g, ""));
        }
        result.push(entry);
      }
    }

    return result;
  };

  return (
    <>
      <div className="flex flex-col items-center sm:flex-row gap-4 max-sm:mt-4">
        {/* XLSX Input */}
        <div className="relative">
          <label
            htmlFor="xlsxInput"
            className="cursor-pointer btn px-6 btn-sm normal-case btn-primary half-width"
          >
            Import XLSX
          </label>
          <img
            src={excelImage}
            alt="Excel lead"
            className="cursor-pointer mt-2 sm:mt-0"
            onClick={() => document.getElementById("xlsxInput").click()}
          />
          <input
            type="file"
            id="xlsxInput"
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx"
          />
        </div>

        {/* CSV Input */}
        <div className="relative">
          <label
            htmlFor="csvInput"
            className="cursor-pointer btn px-6 btn-sm normal-case btn-primary half-width"
          >
            Import CSV
          </label>
          <img
            src={csvImage}
            alt="CSV lead"
            className="cursor-pointer mt-2 sm:mt-0"
            onClick={() => document.getElementById("csvInput").click()}
          />
          <input
            type="file"
            id="csvInput"
            onChange={handleCSVFileChange}
            className="hidden"
            accept=".csv"
          />
        </div>
      </div>
    </>
  );
}

export default Leads;
