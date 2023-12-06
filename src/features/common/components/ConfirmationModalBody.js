import { useDispatch } from "react-redux";
// import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
import { deleteLead } from "../../leads/leadSlice";
import { showNotification } from "../headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";
function ConfirmationModalBody({ extraObject, closeModal }) {
//   const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { message, type, index } = extraObject;
  console.log("employee id to delete",index)

  const proceedWithYes = async () => {
    if(type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE){
        // positive response, call api or dispatch redux function
        dispatch(deleteLead({index}))
        dispatch(showNotification({message : "Lead Deleted!", status : 1}))
    }
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_DELETE) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.delete(`${API}/employee/${index}`, {
              headers,
            });
            console.log("response after deleteing", response.data);
            // localStorage.removeItem("employee-details")
            dispatch(
              showNotification({ message: "Employee Deleted!", status: 1 })
            );
          }
        } else {
          dispatch(
            showNotification({ message: "Access token not found", status: 1 })
          );
        }
      } catch (error) {
        dispatch(
          showNotification({ message: "Error deleting employee", status: 1 })
        );
      }
    }
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button className="btn btn-outline   " onClick={() => closeModal()}>
          Cancel
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

export default ConfirmationModalBody;
