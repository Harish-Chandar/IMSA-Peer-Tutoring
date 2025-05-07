import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-50 w-full h-15 fixed top-0 left-0 flex  items-center px-6 shadow-md z-50">

      <button
        className="!bg-slate-50 !border-slate-50 !text-blue-500 text-3xl md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        ☰
      </button>

      <h2 className="text-4xl text-blue-500 font-bold md:block md:text-lg lg:text-4xl hidden cursor-pointer" onClick={() => window.location.href='/'}>
        Peer Tutors @ IMSA
      </h2>

      <div
        className={`fixed md:static top-[60px] left-0 bg-slate-50 shadow-lg flex flex-col md:flex md:flex-row md:shadow-none md:items-center items-start w-full md:w-auto md:ml-auto transition-all duration-300 ease-in-out ${
          isMenuOpen 
            ? "opacity-100 translate-y-0" 
            : "opacity-0 -translate-y-4 pointer-events-none md:opacity-100 md:translate-y-0 md:pointer-events-auto"
        }`}
      >
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-10 my-2 md:hidden"><a href="/" className="!text-slate-500 !font-bold">Home</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-10 md:ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">Class Resources</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-10 md:ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">Bulletin Board</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-10 md:ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">Tutors</a></h3>
        <h3 className="!bg-slate-50 text-slate-500 text-md font-bold ml-10 md:ml-3 my-2 md:my-0"><a href="youtube.com" className="!text-slate-500 !font-bold">About Us</a></h3>
        
        <button className="bg-blue-500 text-slate-50 text-md font-bold mt-1 mb-3 ml-10 md:ml-3 rounded mb-1 md:mb-0 md:mt-0 md:ml-3">
          Login In
        </button>
      </div>
    </nav>
  );
}

export default Navbar;