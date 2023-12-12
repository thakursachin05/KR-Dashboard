// import axios from 'axios'

function StatsLeadModalBody({ extraObject, closeModal }) {

  const { message, duplicateData } = extraObject;

  console.log("it si sowing or not")
  const proceedWithYes = async () => {


    closeModal();
  };

  const proceedWithNo = async () => {
    closeModal();
  };

  return (
    <>
      <p className=" text-xl mt-8 text-center">{message}</p>

      <p className="text-xl  text-center my-3">
        Duplicate Leads : {duplicateData}
      </p>
      {/* <p className="text-xl mb-5 text-center my-3">
        Unique Leads : {activeEmployees}
      </p> */}


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

export default StatsLeadModalBody;
