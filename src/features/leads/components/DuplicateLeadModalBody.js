import { useDispatch } from "react-redux";
import { DUPLICATE_LEADS, MODAL_BODY_TYPES } from "../../../utils/globalConstantUtil";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { openModal } from "../../common/modalSlice";

function DuplicateLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, allData } = extraObject;

  const proceedWithYes = async () => {
    if (type === DUPLICATE_LEADS) {
      try {
        const tokenResponse = localStorage.getItem("accessToken");
        const tokenData = JSON.parse(tokenResponse);
        const token = tokenData.token;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const chunkSize = 1000
        const leadLength = allData.length;
        let duplicateData = 0;

        for (let offset = 0; offset < leadLength; offset += chunkSize) {
          try {
            // Extract a chunk of 700 records
            const chunk = allData.slice(offset, offset + chunkSize);
            console.log("chunk data!",chunk);

            const response = await axios.post(
              `${API}/lead/bulk`,
              chunk,
              config
            );

            if (response.status === 200) {
              dispatch(
                showNotification({
                  message: "Lead batch inserted successfully!",
                  status: 1,
                })
              );
              localStorage.setItem("unassigned-lead-count",leadLength)
              duplicateData += response.data.stats.matchedCount;
              console.log("Lead batch inserted successfully!",response.data);
            } else {
              console.log("Access token incorrect");
            }
          } catch (error) {
            console.error("Error pushing lead data:", error);
          }
        }

        console.log("duplciated data found",duplicateData)
        dispatch(
          openModal({
            title: `Confirmation`,
            bodyType: MODAL_BODY_TYPES.STATS_LEADS,
            extraObject: {
              message: `Stats of your Data?`,
              duplicateData : duplicateData
            },
          })
        );
      } catch (error) {
        // console.error("Error pushing lead data:", error);
      }
    }
    closeModal();
  };

  const proceedWithNo = async () => {
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <div className="modal-action mt-12">
        <button
          className="btn btn-outline  w-36 "
          onClick={() => proceedWithNo()}
        >
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithYes()}
        >
          Continue
        </button>
      </div>
    </>
  );
}

export default DuplicateLeadModalBody;
