import { use, useState, useEffect} from "react";
import { Link , useLocation} from "react-router-dom";
import { isTokenExpired, getTokenAccess } from "../util.ts"

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation()

  const token = localStorage.getItem("token");

  useEffect(() => {
	  if (!token || isTokenExpired(token) || getTokenAccess(token) !== 1) {
		setLoggedIn(false);
	  }else {
        setLoggedIn(true);
    }
  }, [token]);

  return (
    <nav className="bg-slate-50 w-full p-3 fixed top-0 left-0 flex  items-center px-6 shadow-md z-50">
      <button
        type="button"
        className="!bg-slate-50 !border-slate-50 !text-blue-500 text-3xl md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

            <h2
                className="text-4xl text-blue-500 font-bold md:block md:text-lg lg:text-4xl hidden cursor-pointer"
                onClick={() => (window.location.href = "/")}
            >
                Peer Tutors @ IMSA
            </h2>

      <div
        className={`fixed md:static top-[60px] left-0 bg-slate-50 shadow-lg flex flex-col md:flex md:flex-row md:shadow-none md:items-center items-start w-full md:w-auto md:ml-auto transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto"
        }`}
      >
        <h3 className="!bg-slate-50 text-slate-500 text-lg font-bold ml-10 my-2 md:hidden">
          <a href="/" className={"!font-bold" + (location.pathname === "/" && location.hash === "" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
            Home
          </a>
        </h3>
        <h3 className="!bg-slate-50 bg-blue-500 text-slate-500 text-lg font-bold ml-10 md:ml-3 my-2 md:my-0 hover:text-slate-700">
          <a href="/resources" className={"!font-bold" + (location.pathname === "/resources" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
            Class Resources 
          </a>
        </h3>
        <h3 className="!bg-slate-50 text-slate-500 text-lg font-bold ml-10 md:ml-3 my-2 md:my-0 hover:text-slate-700">
          <Link to="/#bulletinboard" className={"!font-bold" + (location.pathname === "/" && location.hash === "#bulletinboard" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
            Bulletin
          </Link>
        </h3>
        <h3 className="!bg-slate-50 text-slate-500 text-lg font-bold ml-10 md:ml-3 my-2 md:my-0 hover:text-slate-700">
          <a href="/findTutors" className={"!font-bold" + (location.pathname === "/findTutors" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
            Tutors
          </a>
        </h3>
        { loggedIn && (
        <h3 className="!bg-slate-50 text-slate-500 text-lg font-bold ml-10 md:ml-3 my-2 md:my-0 hover:text-slate-700">
            <a href="/checkin" className={"!font-bold" + (location.pathname === "/checkin" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
                Check-In Tutors
            </a>
        </h3>
        )}
        {loggedIn && (
          <h3 className="!bg-slate-50 text-slate-500 text-lg font-bold ml-10 md:ml-3 my-2 md:my-0 hover:text-slate-700">
            <a href="/adminDashboard" className={"!font-bold" + (location.pathname === "/adminDashboard" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
              Dashboard
            </a>
          </h3>
        )}
        { !loggedIn && (
        <h3 className="!bg-slate-50 text-slate-500 text-lg font-bold ml-10 md:ml-3 my-2 md:my-0 hover:text-slate-700">
          <a href="/login" className={"!font-bold" + (location.pathname === "/login" ? "underline !bg-blue-500 rounded-2xl p-1 px-2 !text-slate-50" : "")}>
            Login
          </a>
        </h3>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
