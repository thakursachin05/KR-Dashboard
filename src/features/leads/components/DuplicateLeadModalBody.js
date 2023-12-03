import { useDispatch, useSelector } from "react-redux";
// import axios from 'axios'
import { DUPLICATE_LEADS } from "../../../utils/globalConstantUtil";
import { showNotification } from "../../common/headerSlice";
import { addNewLead } from "../leadSlice";

function DuplicateLeadsModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, allData, uniqueData } = extraObject;

  const state = useSelector((state) => state.lead);
  const proceedWithYes = async () => {
    if (type === DUPLICATE_LEADS) {
      const updatedLeads = [...state.leads, ...allData];
      dispatch(addNewLead({ newLeadObj: updatedLeads }));
      dispatch(
        showNotification({ message: "Duplicates Leads Added!", status: 1 })
      );
    }
    closeModal();
  };

  const proceedWithNo = async () => {
    if (type === DUPLICATE_LEADS) {
      const updatedLeads = [...state.leads, ...uniqueData];
      dispatch(addNewLead({ newLeadObj: updatedLeads }));
      dispatch(showNotification({ message: "Unique Leads Added!", status: 1 }));
    }
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">
        {message}, continue with duplicates ?
      </p>

      <div className="modal-action mt-12">
        <button
          className="btn btn-outline  w-36 "
          onClick={() => proceedWithNo()}
        >
          No
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Yes
        </button>
      </div>
    </>
  );
}

export default DuplicateLeadsModalBody;
