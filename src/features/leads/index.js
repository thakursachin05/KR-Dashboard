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
  const { leads } = useSelector((state) => state.lead);
  const dispatch = useDispatch();
  console.log("leds are", leads);
  useEffect(() => {
    dispatch(getLeadsContent());
  }, [dispatch]);

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
  const currentLeads = leads.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalItems = leads.length;
  const itemsPerPageOptions = Array.from(
    { length: Math.ceil(totalItems / 10) },
    (_, index) => (index + 1) * 10
  );

  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
  const [sortColumn, setSortColumn] = useState('Name');

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

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
      </div>
      {currentLeads.length === 0 ? (
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
                  <th onClick={() => handleSort('Name')}>Name</th>
                  <th>Email Id</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Enrollment Number</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentLeads.map((l, k) => {
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
            totalItems={leads.length}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </TitleCard>
      )}
    </>
  );
}

export default Leads;
