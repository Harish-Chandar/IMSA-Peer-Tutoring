import React, { Component } from "react";
class NavBar extends Component {
  render() {
    return (
      <div className="display-flex flex-col">
        <nav className="bg-slate-50 w-full h-16 fixed top-0 left-0 flex flex-row px-6 shadow-md z-10">
          <h2 className="self-center text-4xl text-blue-500 font-bold text-left ">
            Peer Tutors @ IMSA
          </h2>

          <div className="self-center ml-auto relative group">
            <h3 className="text-slate-500 text-lg font-bold">
              Class Resources
            </h3>
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
      </div>
    );
  }
}

export default NavBar;
