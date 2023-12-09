import { useDispatch } from "react-redux";
import {
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";
import { API } from "../../../utils/constants";
import axios from "axios";

function AssignLeadModalBody({ extraObject, closeModal, optionType }) {
  const dispatch = useDispatch();

  const { message } = extraObject;



  const openAddNewLeadModal = async(optionType) => {
    const baseURL = `${API}/employee`;
    try {
      const response = await axios.get(baseURL);

      if (response.status === 200) {
        localStorage.setItem("employee-details", JSON.stringify(response.data));
      } else {
        console.log("access token incorrect");
      }
    } catch (error) {
      console.error("error", error);
    }
    switch (optionType) {
      case "active":
        dispatch(
          openModal({
            title: "Assign Leads to Active Employees",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_ACTIVE,
          })
        );
        break;
      case "inactive":
        dispatch(
          openModal({
            title: "Assign Leads to InActive Employees",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_INACTIVE
            ,
          })
        );
        break;
      case "all":
        dispatch(
          openModal({
            title: "Assign Leads to All Employees",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_TOTAL,
          })
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <p className="text-xl mt-8 text-center my-6">{message}</p>

      <div className="flex flex-col justify-center gap-5">
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("active")}
        >
          Assign Leads to Active
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("inactive")}
        >
          Assign Leads to Inactive
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("all")}
        >
          Assign Leads to All
        </button>
      </div>
    </>
  );
}

export default AssignLeadModalBody;
