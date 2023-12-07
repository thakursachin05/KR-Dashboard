import { useDispatch } from "react-redux";
// import axios from 'axios'
import { DUPLICATE_LEADS } from "../../../utils/globalConstantUtil";
import { showNotification } from "../../common/headerSlice";
import { API } from "../../../utils/constants";
import axios from "axios";

function DuplicateLeadModalBody({ extraObject, closeModal }) {
  const dispatch = useDispatch();

  const { message, type, allData, uniqueData, duplicates } = extraObject;

  const proceedWithYes = async () => {
    let leadData = allData
    if (duplicates === true) leadData = uniqueData;
    if (type === DUPLICATE_LEADS) {
      for (const obj of leadData) {
        try {
          const tokenResponse = localStorage.getItem("accessToken");
          const tokenData = JSON.parse(tokenResponse);
          const token = tokenData.token;

          const singleLead = {
            name: obj.name,
            contact: obj.contact,
          };

          // Set the Authorization header with the token
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const response = await axios.post(`${API}/lead/`, singleLead, config);

          if (response.status === 201) {
            dispatch(
              showNotification({
                message: "Lead inserted successfully!",
                status: 1,
              })
            );
            console.log("Lead data inserted successfully!");
          } else {
            console.log("Access token incorrect");
          }
        } catch (error) {
          console.error("Error pushing lead data:", error);
        }
      }

    }
    closeModal();
  };

  const proceedWithNo = async () => {
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message},</p>

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

export default DuplicateLeadModalBody;
