import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../../../utils/constants";

const user = JSON.parse(localStorage.getItem("user"));
const TOKEN = localStorage.getItem("accessToken");

function TemplatePointers() {
  const [TLname, setTLName] = useState("");
  const [TLcontact, setTLContact] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${API}/employee/?id=${user.teamLeaderId}`
        );
        setTLName(response.data.data[0].name);
        setTLContact(response.data.data[0].contact);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user?.teamLeaderId]);

  return (
    <>
      {TOKEN ? (
        user.isAdmin ? (
          <>
            <h1 className="text-2xl mt-8 font-bold">Admin Dashboard</h1>

            <div className="mt-8">
              <h2 className="text-lg font-bold">Lead Assignment</h2>
              <p className="text-base">
                Assign leads to employees and manage lead distribution
                efficiently.
              </p>
              <Link to="/app/assignedLeads" className="text-blue-500 underline">
                Assign Leads
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">Employee Management</h2>
              <p className="text-base">
                Update employee profiles, reset passwords, and view today's
                present members.
              </p>
              <Link to="/app/teamMembers" className="text-blue-500 underline">
                Manage Employees
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">Member Approval</h2>
              <p className="text-base">
                Approve new members who have been assigned to your team.
              </p>
              <Link to="/app/notApproved" className="text-blue-500 underline">
                Approve Members
              </Link>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-bold">Upload Leads</h2>
              <p className="text-base">
                Upload leads in CSV and XLSX formats for efficient lead
                management.
              </p>
              <Link to="/app/uploadLeads" className="text-blue-500 underline">
                Upload Leads
              </Link>
            </div>
          </>
        ) : user.approvedAt ? (
          <>
            <div className="bg-base-100  p-6 rounded-lg shadow-lg">
              <p className="text-lg font-semibold mb-4">
                🌟 Welcome to <strong>KR Teleservices!</strong> 🌟
              </p>
              <p className="text-base mb-4">
                Dear{" "}
                <strong>
                  {user.role?.includes("TL") ? "Team Leader" : "HR"}{" "}
                  {user.name.toUpperCase()}
                </strong>{" "}
                , We are thrilled to have you on board! As part of our
                commitment to efficiency and excellence, we have outlined the
                following important procedures for your daily operations:
              </p>
              {user.role?.includes("HR") ? (
                <ol className="list-decimal pl-6 mb-4">
                  <li className="mb-2">
                    <strong>Attendance Marking:</strong> Please ensure you mark
                    your attendance promptly between 5:00 AM and 10:00 PM daily.
                    This is crucial for lead assignment and maintaining team
                    coordination. Late attendance may impact lead allocation. If
                    you encounter any issues or have questions, feel free to
                    contact your team leader, <strong>{TLname} </strong>, at{" "}
                    {TLcontact}.
                  </li>
                  <li className="mb-2">
                    <strong>Lead Assignment:</strong> Leads will be assigned
                    based on your punctual attendance. Make sure to regularly
                    check the lead dashboard to stay updated on your assigned
                    leads. Leads are an integral part of our success, and your
                    dedication is key to achieving our goals. If you have any
                    concerns or need assistance, please reach out to your team
                    leader, <strong>{TLname} </strong>, at {TLcontact}.
                  </li>
                  <li className="mb-2">
                    <strong>Daily Check-In:</strong> We encourage you to check
                    in daily to view and manage your leads. This ensures you are
                    well-prepared for your telecalling activities and
                    contributes to the overall success of the team. If you have
                    any problems or inquiries, don't hesitate to contact your
                    team leader, <strong>{TLname} </strong>, at {TLcontact}.
                  </li>
                </ol>
              ) : (
                <ol className="list-decimal pl-6 mb-4">
                  <li className="mb-2">
                    Check the attendance of the HR team and address any delays
                    or issues.
                  </li>
                  <li className="mb-2">
                    Review the number of leads each HR has called and assess
                    their performance.
                  </li>
                  <li className="mb-2">
                    Manage HR statuses: if someone is not working or on leave,
                    update their status to hold or dead.
                  </li>
                  <li className="mb-2">
                    Reset passwords for HR members who have forgotten them.
                  </li>
                  <li className="mb-2">
                    Assign additional leads to HR members who have completed
                    their current assignments.
                  </li>
                  <li className="mb-2">
                    Withdraw leads from HR members who are not actively working.
                  </li>
                </ol>
              )}

              <p className="text-base mb-4">
                ❓ <strong>Queries and Support:</strong> If you have any
                questions, concerns, or require support, please do not hesitate
                to reach out to the admin team. We are here to assist you in any
                way we can.
              </p>
              <p className="text-lg">
                Let's work together to achieve greatness! 🚀
              </p>
              <p className="text-sm mt-4">Best regards, KR Teleservices</p>
            </div>
          </>
        ) : (
          <div className="bg-base-100  p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold mb-4">
              🌟 Welcome to <strong>KR Teleservices!</strong> 🌟
            </p>
            <p className="text-base mb-4">
              We are thrilled to have you on board and look forward to your
              valuable contributions to our team. As you embark on this exciting
              journey with us, please note the following important information
              regarding the verification process:
            </p>
            <ol className="list-decimal pl-6 mb-4">
              <li className="mb-2">
                <strong>Verification Process:</strong> As a new joiner, your
                account is currently in the verification stage. Our
                administration team is diligently working to verify your details
                within the next 24 hours.
              </li>
              <li className="mb-2">
                <strong> Patience is Key:</strong> We understand the eagerness
                to get started, and we appreciate your patience during this
                process. Rest assured that we are committed to expediting the
                verification to ensure a smooth onboarding experience for you.
              </li>
              <li className="mb-2">
                <strong> Contacting Admin:</strong> If, by any chance, your
                account is not verified within the stipulated time, or if you
                have any urgent queries, feel free to reach out to our admin
                team.
              </li>
            </ol>
            <br></br>
            Keep an eye on your whatsapp for updates on your verification
            status. We will notify you promptly once your account has been
            successfully verified.
          </div>
        )
      ) : (
        <>
          <h1 className="text-2xl mt-8 font-bold">
            Welcome to KR Teleservices!
          </h1>
          <p className="text-lg mt-6">
            Ready to transform leads into success? Dive into your daily tasks,
            make those calls, and celebrate your victories! Check out your
            profile along the way.
          </p>

          <p className="text-lg mt-6">
            Ready to boost your career? Join KR Teleservices today!
            <a
              href="https://www.thekrteleservices.com/apply"
              className="text-blue-500 underline ml-2"
            >
              Get Started
            </a>
          </p>
        </>
      )}
    </>
  );
}

export default TemplatePointers;
