import { Link } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));
const TOKEN = localStorage.getItem("accessToken");

function TemplatePointers() {
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
                🌟 Welcome to KR Teleservices! 🌟
              </p>
              <p className="text-base mb-4">
                Dear Team, We are thrilled to have you on board! As part of our
                commitment to efficiency and excellence, we have outlined the
                following important procedures for your daily operations:
              </p>
              <ol className="list-decimal pl-6 mb-4">
                <li className="mb-2">
                  <strong>Attendance Marking:</strong> Please ensure you mark
                  your attendance promptly between 6:00 AM and 12:00 PM daily.
                  This is crucial for lead assignment and maintaining team
                  coordination. Late attendance may impact lead allocation.
                </li>
                <li className="mb-2">
                  <strong>Lead Assignment:</strong> Leads will be assigned based
                  on your punctual attendance. Make sure to regularly check the
                  lead dashboard to stay updated on your assigned leads. Leads
                  are an integral part of our success, and your dedication is
                  key to achieving our goals.
                </li>
                <li className="mb-2">
                  <strong>Daily Check-In:</strong> We encourage you to check in
                  daily to view and manage your leads. This ensures you are
                  well-prepared for your telecalling activities and contributes
                  to the overall success of the team.
                </li>
              </ol>
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
          <div className="text-center">
            <h1 className="text-2xl mt-8 font-bold">
              Welcome To KR Teleservices
            </h1>

            <h1 className="text-2xl mt-8 mb-8 font-bold">
              Verification in Progress
            </h1>

            <p className="text-lg">
              We're excited to have you on board! Your profile verification is
              currently in progress. Soon, you'll have full access to your
              account, till you can update your profile information.
            </p>

            <p className="text-lg mt-4">
              If you encounter any delays or have urgent updates, please don't
              hesitate to reach out to our admin team.
            </p>
          </div>
        )
      ) : (
        <>
          <h1 className="text-2xl mt-8 font-bold">
            Welcome to KR Teleservices!
          </h1>

          <p className="text-lg mt-4">
            Join our team of dynamic telecallers and elevate your career in
            communication!
          </p>

          <p className="text-lg mt-4">
            Unleash your potential in teleservices and connect with
            opportunities.
          </p>
        </>
      )}
    </>
  );
}

export default TemplatePointers;
