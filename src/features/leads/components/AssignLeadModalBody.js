import { useDispatch } from "react-redux";
import { MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import { openModal } from "../../common/modalSlice";
import { API } from "../../../utils/constants";
import axios from "axios";

function AssignLeadModalBody({ extraObject, closeModal, optionType }) {
  const dispatch = useDispatch();
  const storedUserData = JSON.parse(localStorage.getItem("user"));

  const { message } = extraObject;

  const openAddNewLeadModal = async (optionType) => {
    const baseURL = `${API}/employee`;
    const params = {
      page: 1,
      limit: 10,
      offset: 0,
      approvedAt: "notNull",
      isAdmin: "false",
      activityStatus: "ACTIVE",
      ...(storedUserData.isAdmin
        ? {}
        : { teamLeaderId: storedUserData._id }),
    };
    try {
      const response = await axios.get(baseURL, { params: params });

      if (response.status === 200) {
        localStorage.setItem(
          "total-employee-count",
          JSON.stringify(response.data.count)
        );
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      }
      console.error("error", error);
    }
    switch (optionType) {
      case "active":
        dispatch(
          openModal({
            title: "Today Present HR",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_ACTIVE,
          })
        );
        break;
      case "inactive":
        dispatch(
          openModal({
            title: "Present HR who didn't get Leads Today",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_INACTIVE,
          })
        );
        break;
      case "all":
        dispatch(
          openModal({
            title: "To All HR with Active Status",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_TOTAL,
          })
        );
        break;

      case "single":
        dispatch(
          openModal({
            title: "To Particular Employee",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_SINGLE,
          })
        );
        break;
      case "teamLeaders":
        dispatch(
          openModal({
            title: "To Team Leaders",
            bodyType: MODAL_BODY_TYPES.ASSIGN_TO_TL,
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
          Present HR Today
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("inactive")}
        >
          Present HR who didn't get Leads Today
        </button>

        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("all")}
        >
          To All HR with Active Status
        </button>
        <button
          className="btn px-6 btn-sm normal-case btn-primary"
          onClick={() => openAddNewLeadModal("single")}
        >
          To Particular Employee
        </button>
        {storedUserData.isAdmin ? (
          <button
            className="btn px-6 btn-sm normal-case btn-primary"
            onClick={() => openAddNewLeadModal("teamLeaders")}
          >
            To Team Leaders
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default AssignLeadModalBody;
