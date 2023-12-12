import { useDispatch } from "react-redux";
import {
  MODAL_BODY_TYPES,
} from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";
// import { API } from "../../../utils/constants";
// import axios from "axios";

function AssignLeadModalBody({ extraObject, closeModal, optionType }) {
  const dispatch = useDispatch();

  const { message } = extraObject;



  const openAddNewLeadModal = async(optionType) => {
    // const baseURL = `${API}/employee`;
    // const params = {
    //   page: 1,
    //   limit: 10,
    //   offset: 0,
    //   approvedAt : "notNull"
    // };
    // try {
    //   const response = await axios.get(baseURL, { params: params });

    //   if (response.status === 200) {
    //     localStorage.setItem("employee-details", JSON.stringify(response.data));
    //   } else {
    //     console.log("access token incorrect");
    //   }
    // } catch (error) {
    //   console.error("error", error);
    // }
    switch (optionType) {
      case "active":
        dispatch(
          openModal({
            title: "Today Present Employees",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_ACTIVE,
          })
        );
        break;
      case "inactive":
        dispatch(
          openModal({
            title: "Employees who didn't get Leads Today",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_INACTIVE
            ,
          })
        );
        break;
      case "all":
        dispatch(
          openModal({
            title: "To All Employees with Active Status",
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
           Present Employees Today
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("inactive")}
        >
          Employees who didn't get Leads Today
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("all")}
        >
          To All Employees with Active Status
        </button>
      </div>
    </>
  );
}

export default AssignLeadModalBody;
