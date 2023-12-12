import { useDispatch } from "react-redux";
import { DUPLICATE_LEADS } from "../../../utils/globalConstantUtil";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";
import { sliceLeadDeleted } from "../leadSlice";

function DuplicateLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, allData } = extraObject;

  const proceedWithYes = async () => {
    if (type === DUPLICATE_LEADS) {
      /* your array with more than 15000 records */ const chunkSize = 700;

      const tokenResponse = localStorage.getItem("accessToken");
      const tokenData = JSON.parse(tokenResponse);
      const token = tokenData.token;
      const today = new Date();

      // Get the day of the week in lowercase (e.g., 'monday', 'tuesday', etc.)
      const dayOfWeek = today
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      // Set the Authorization header with the token
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.delete(
          `${API}/daywiseLeads/emptyAll?day=${dayOfWeek}`,
          config
        );

        if (response.status === 200) {
          dispatch(
            showNotification({
              message: "Lead db droped successfully!",
              status: 1,
            })
          );
          console.log("Lead db droped successfully!");
        } else {
          console.log("Access token incorrect");
        }
      } catch (error) {
        console.error("Error dropping lead data:", error);
      }

      const leadLength = allData.length;

      for (let offset = 0; offset < leadLength; offset += chunkSize) {
        try {
          // Extract a chunk of 700 records
          const chunk = allData.slice(offset, offset + chunkSize);

          // Create an array of objects for the API request
          const bulkData = chunk.map((obj) => ({
            name: obj.name,
            contact: obj.contact,
          }));

          // API request with the chunk of data
          const response = await axios.post(
            `${API}/daywiseLeads/bulkstore?day=${dayOfWeek}&limit=${chunkSize}`,
            bulkData,
            config
          );

          if (response.status === 200) {
            dispatch(
              showNotification({
                message: "Lead batch inserted successfully!",
                status: 1,
              })
            );
            console.log("Lead batch inserted successfully!");
          } else {
            console.log("Access token incorrect");
          }
        } catch (error) {
          console.error("Error pushing lead data:", error);
        }
      }
    }
    dispatch(sliceLeadDeleted(true));

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
