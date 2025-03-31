import React from 'react'

function NavBar() {
    return (
      <header className="bg-white text-black p-4 ">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/logoS.png" alt="SpamSleuth Logo" className="mr-2" />
            <h1 className="text-2xl font-bold">SpamSleuth</h1>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li><a href="/" className="hover:underline">Home</a></li>
              <li><a href="/information" className="hover:underline">Information</a></li>
              <li><a href="/about" className="hover:underline">About Us</a></li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

export default NavBar
