import React from "react";

function NavBar() {
  return (
    <nav className="bg-slate-50 w-full h-15 flex flex-row px-6 shadow-md">
      <h2 className="self-center text-4xl text-blue-500 font-bold text-left ">
        Peer Tutors @ IMSA
      </h2>

      <div className="self-center ml-auto relative group">
        <h3 className="text-slate-500 text-lg font-bold">Class Resources</h3>
        <div className="absolute bg-slate-50 hidden group-hover:block">
          <a
            href="#"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Link 1
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Link 2
          </a>
          <a
            href="#"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
          >
            Link 3
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
