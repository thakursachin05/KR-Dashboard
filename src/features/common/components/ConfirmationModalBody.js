import { useDispatch } from "react-redux";
// import axios from 'axios'
import { CONFIRMATION_MODAL_CLOSE_TYPES } from "../../../utils/globalConstantUtil";
import { sliceLeadDeleted, sliceMemberDeleted } from "../../leads/leadSlice";
import { showNotification } from "../headerSlice";
import axios from "axios";
import { API } from "../../../utils/constants";
function ConfirmationModalBody({ extraObject, closeModal }) {
  //   const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const { message, type, index, contact, params } = extraObject;

  const proceedWithYes = async () => {
    if (type === CONFIRMATION_MODAL_CLOSE_TYPES.WITHDRAW_LEADS) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.post(
              `${API}/lead/takeLeadsBack`,
              {
                contact: contact,
              },
              {
                headers,
              }
            );

            console.log("response", response.data);

            dispatch(sliceLeadDeleted(true));
            dispatch(
              showNotification({
                message: `${response.data.message}`,
                status: 1,
              })
            );
          }
        } else {
          dispatch(
            showNotification({ message: "Access token not found", status: 0 })
          );
        }
      } catch (error) {
        console.log("error", error);
        dispatch(
          showNotification({
            message: `${error.response.data.message}`,
            status: 0,
          })
        );
      }
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MERGE_WEBSITE_LEADS) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

           const response =  await axios.post(
              `${API}/lead/webLeadToLeads`,
              {},
              {
                headers,
              }
            );

            dispatch(sliceLeadDeleted(true));
            dispatch(showNotification({ message: `${response.data.message}`, status: 1 }));
          }
        } else {
          dispatch(
            showNotification({ message: `Access token not found`, status: 0 })
          );
        }
      } catch (error) {
        dispatch(
          showNotification({ message: `${error.response.data.message}`, status: 0 })
        );
      }
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.DELETE_ALL_LEAD) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

           const response = await axios.delete(`${API}/lead/delete/bulk`, {
              headers,
              params: params,
            });

            dispatch(sliceLeadDeleted(true));
            dispatch(showNotification({ message: `${response.data.message}`, status: 1 }));
          }
        } else {
          dispatch(
            showNotification({ message: "Access token not found", status: 0 })
          );
        }
      } catch (error) {
        dispatch(
          showNotification({ message: `${error.response.data.message}`, status: 0 })
        );
      }
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.LEAD_DELETE) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.delete(`${API}/lead/${index}`, {
              headers,
            });
            dispatch(sliceLeadDeleted(true));
            dispatch(showNotification({ message: `${response.data.message}`, status: 1 }));
          }
        } else {
          dispatch(
            showNotification({ message: "Access token not found", status: 0 })
          );
        }
      } catch (error) {
        dispatch(
          showNotification({ message: `${error.response.data.message}`, status: 0 })
        );
      }
    } else if (type === CONFIRMATION_MODAL_CLOSE_TYPES.MEMBER_DELETE) {
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
            dispatch(sliceMemberDeleted(true));
            dispatch(
              showNotification({ message: `${response.data.message}`, status: 1 })
            );
          }
        } else {
          dispatch(
            showNotification({ message: "Access token not found", status: 0 })
          );
        }
      } catch (error) {
        dispatch(
          showNotification({ message: `${error.response.data.message}`, status: 0 })
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
