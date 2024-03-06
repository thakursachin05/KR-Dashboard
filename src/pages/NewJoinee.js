// eslint-disable-next-line
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../features/common/headerSlice";
// import { Link } from "react-router-dom";
// import TemplatePointers from "../../features/user/components/TemplatePointers";

function NewJoinee() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "" }));
  }, [dispatch]);

  return (
    <div className="hero  bg-base-200">
      <div className="hero-content">
        <div className="max-w-md flex items-center justify-center flex-col">
          Welcome to <strong>Earn From Talent</strong>
          <br></br>
          We are thrilled to have you on board and look forward to your valuable
          contributions to our team. As you embark on this exciting journey with
          us, please note the following important information regarding the
          verification process:<br></br>
          <strong>Verification Process:</strong> As a new joiner, your account
          is currently in the verification stage. Our administration team is
          diligently working to verify your details within the next 24 hours.
          <strong> Patience is Key:</strong> We understand the eagerness to get
          started, and we appreciate your patience during this process. Rest
          assured that we are committed to expediting the verification to ensure
          a smooth onboarding experience for you.<br></br>
          <strong> Contacting Admin:</strong> If, by any chance, your account is
          not verified within the stipulated time, or if you have any urgent
          queries, feel free to reach out to our admin team.
          <br></br>
          Keep an eye on your whatsapp for updates on your verification status.
          We will notify you promptly once your account has been successfully
          verified.
        </div>
      </div>
    </div>
  );
}

export default NewJoinee;
