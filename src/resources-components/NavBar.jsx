import React, { Component } from "react";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

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
              <Link
                to="/resources/new"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Add Resource
              </Link>
              <Link
                to="/resources/modify"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Modify Resources
              </Link>
              <Link
                to="/"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Find Resources
              </Link>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default NavBar;
