import { useState } from "react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-50 w-full h-15 fixed top-0 left-0 flex items-center px-6 shadow-md z-50">

      <h2 className="text-4xl text-blue-500 font-bold md:block hidden">
        Peer Tutors @ IMSA
      </h2>

      <button
        className="ml-auto !bg-slate-50 text-blue-500 text-3xl md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      <div
        className={`fixed md:static top-[60px] left-0 bg-slate-50 shadow-lg flex-col md:flex md:flex-row md:shadow-none items-center w-full md:w-auto md:ml-auto ${
          isMenuOpen ? "flex" : "hidden"
        }`}
      >
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">Class Resources</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">Bulletin Board</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">Tutors</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">About Us</a></h3>

        <button className="bg-blue-500 text-slate-50 text-md font-bold ml-3 rounded mb-1">
          Login In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;