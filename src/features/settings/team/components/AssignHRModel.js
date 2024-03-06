import { useDispatch } from "react-redux";
import axios from "axios";
import { API } from "../../../../utils/constants";
import { sliceMemberDeleted } from "../../../leads/leadSlice";
import { showNotification } from "../../../common/headerSlice";
import { useState } from "react";
import InputText from "../../../../components/Input/InputText";
import { MODAL_BODY_TYPES } from "../../../../utils/globalConstantUtil";
function AssignHRModel({ extraObject, closeModal }) {
  const dispatch = useDispatch();
  const [contact, setContact] = useState("");
  const [HRname, setHRname] = useState("");
  const { message, TLid, type, hrId, NotApprovedMembers } = extraObject;
  // console.log("tlid and HRid",TLid,hrId)

  // console.log("body type",type)
  const proceedWithAssign = async () => {
    contact.contact = contact.contact.replace(/\s/g, "");
    if (type === MODAL_BODY_TYPES.ASSIGN_HR) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.put(
              `${API}/employee/addHRToTeamLeader/${TLid}`,
              {
                contact: contact.contact,
              },
              {
                headers,
              }
            );
            dispatch(sliceMemberDeleted(true));
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
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          dispatch(
            showNotification({
              message: `${error.response.data.message}`,
              status: 0,
            })
          );
        }
      }
    } else if (type === MODAL_BODY_TYPES.CHANGE_TL) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };

            const response = await axios.post(
              `${API}/employee/changeTl/${hrId}`,
              {
                contact: contact.contact,
              },
              {
                headers,
              }
            );
            dispatch(sliceMemberDeleted(true));
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
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          console.log(error);
          dispatch(
            showNotification({
              message: `${error.response.data.message}`,
              status: 0,
            })
          );
        }
      }
    } else if (type === MODAL_BODY_TYPES.ASSIGN_TL) {
      try {
        const storedToken = localStorage.getItem("accessToken");

        if (storedToken) {
          const accessToken = JSON.parse(storedToken).token;

          if (accessToken) {
            const headers = {
              Authorization: `Bearer ${accessToken}`,
            };
            const endpointPath = NotApprovedMembers
              ? "assignTlToNotApproved"
              : "addTeamLeaderToHR";

            const response = await axios.put(
              `${API}/employee/${endpointPath}/${hrId}`,
              {
                contact: contact.contact,
              },
              {
                headers,
              }
            );

            dispatch(sliceMemberDeleted(true));
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
        if (error.response.status === 409) {
          localStorage.clear();
          window.location.href = "/login";
        } else {
          dispatch(
            showNotification({
              message: `${error.response.data.message}`,
              status: 0,
            })
          );
        }
      }
    }
    closeModal();
  };

  const findEmployee = async () => {
    try {
      const response = await axios.get(
        `${API}/employee/?contact=${contact.contact}`
      );
      if (response.status === 200) {
        setHRname(response.data.data[0].name);
      }
    } catch (error) {
      if (error.response.status === 409) {
        localStorage.clear();
        window.location.href = "/login";
      } else {
        dispatch(
          showNotification({
            message: `${error.response.data.message}`,
            status: 0,
          })
        );
      }
    }
  };

  const updateFormValue = ({ updateType, value }) => {
    setContact({
      ...contact,
      [updateType]: value.trim(),
    });
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>
      <div className="mt-4">
        <InputText
          type="number"
          defaultValue={contact.contact}
          updateType="contact"
          containerStyle="mt-4 mb-4"
          updateFormValue={updateFormValue}
        />
        <div>
          <InputText
            type="text"
            defaultValue={HRname}
            updateType="HR name"
            containerStyle="mt-4 mb-4"
          />
        </div>
        <div className="items-center flex justify-center">
          <button
            onClick={() => findEmployee()}
            className={"btn mt-2  d-block btn-primary"}
          >
            Search
          </button>
        </div>
      </div>

      <div className="modal-action mt-12">
        <button className="btn btn-outline   " onClick={() => closeModal()}>
          Cancel
        </button>

        <button
          className="btn btn-primary w-36"
          onClick={() => proceedWithAssign()}
        >
          Assign
        </button>
      </div>
    </>
  );
}

export default AssignHRModel;
