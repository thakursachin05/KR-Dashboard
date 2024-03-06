import TemplatePointers from "./components/TemplatePointers";
// import logo from '../../assets/images/logo.png'

function LandingIntro() {
  return (
    <div className="hero min-h-full rounded-l-xl bg-base-200">
      <div className="hero-content py-12">
        <div className="max-w-md">
          <h1 className="text-3xl text-center font-bold ">
            <img
              src="/logo192.png"
              className="w-12 inline-block mr-2 mask mask-circle"
              alt="Earn-from-talent-logo"
            />
            Earn From Talent
          </h1>

          <div className="text-center mt-8">
            <img
              src="./new_year.gif"
              alt="Earn From Talent Leads Management"
              className="w-48 inline-block"
            ></img>
          </div>

          {/* Importing pointers component */}
          <TemplatePointers />
        </div>
      </div>
    </div>
  );
}

export default LandingIntro;
