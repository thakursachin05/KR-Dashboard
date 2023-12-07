// eslint-disable-next-line
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPageTitle } from "../../features/common/headerSlice";
import { Link } from "react-router-dom";
import TemplatePointers from "../../features/user/components/TemplatePointers";
const user = localStorage.getItem("user");
function InternalPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle({ title: "" }));
  }, [dispatch]);

  return (
    <div className="hero h-4/5 bg-base-200">
      <div className="hero-content">
        <div className="max-w-md">
          <TemplatePointers />

          <Link
            to={`/app/${
              user.isAdmin
                ? "uploadLeads"
                : user.approvedAt !== null
                ? "settings-profile"
                : "userLeads"
            }`}
          >
            <button className="btn bg-base-100 btn-outline">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InternalPage;
