const user = JSON.parse(localStorage.getItem("user"));
const TOKEN = localStorage.getItem("accessToken");

function TemplatePointers() {
  return (
    <>
      <h1 className="text-2xl mt-8 font-bold">Welcome To KR Teleservices</h1>
      {TOKEN ? (
        user.approvedAt ? (
          <>
            <p className="py-2 mt-4">
              ✓ <span className="font-semibold">Light/dark</span> mode toggle
            </p>
            <p className="py-2 mb-4">
              ✓{" "}
              <span className="font-semibold">
                Effortless administration starts here.{" "}
              </span>
              Explore our user-friendly admin panel for a stress-free experience
            </p>
          </>
        ) : (
          <h1 className="text-2xl mt-8 mb-8 font-bold">
            You Are Not Verified, Contact Admin!
          </h1>
        )
      ) : (
        <>
          <p className="py-2 mt-4">
            ✓ <span className="font-semibold">Light/dark</span> mode toggle
          </p>
          <p className="py-2 mb-4">
            ✓{" "}
            <span className="font-semibold">
              Effortless administration starts here.{" "}
            </span>
            Explore our user-friendly admin panel for a stress-free experience
          </p>
        </>
      )}
    </>
  );
}

export default TemplatePointers;
