import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="bg-slate-100 border-t border-slate-200 mt-20">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Main Footer Content */}
                <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-8 md:gap-16">
                    {/* Brand Section */}
                    <div className="flex-1 min-w-0 max-w-sm">
                        <h3 className="text-2xl font-bold text-blue-500 mb-4">
                            Peer Tutors @ IMSA
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                            Connecting IMSA students with peer tutors and academic resources to further collaborative learning and academic success.
                        </p>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-blue-600 transition-colors mb-3">
                            <a href="/about" className="text-white">
                                Meet The Developers
                            </a>
                        </button>
                    </div>

                    {/* Quick Links */}
                    <div className="flex-1 min-w-0 max-w-xs">
                        <h4 className="text-lg font-bold text-gray-700 mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/resources" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                                    Class Resources
                                </Link>
                            </li>
                            <li>
                                <Link to="/findTutors" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                                    Find Tutors
                                </Link>
                            </li>
                            <li>
                                <a href="/#bulletinboard" className="text-gray-600 hover:text-blue-500 text-sm transition-colors">
                                    Bulletin Board
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact & Support */}
                    <div className="flex-1 min-w-0 max-w-xs">
                        <h4 className="text-lg font-bold text-gray-700 mb-4">Get Involved</h4>
                        <p className="text-gray-600 text-sm mb-4">
                            Want to become a peer tutor or need help with the platform?
                        </p>
                        <button className="bg-blue-500 text-white py-2 px-4 rounded text-sm font-semibold hover:bg-blue-600 transition-colors mb-3">
                            <a
                                href="mailto:ashah2@imsa.edu,hchandar@imsa.edu,akeck@imsa.edu,cschlesser@imsa.edu"
                                className="text-white"
                            >
                                Contact Us
                            </a>
                        </button>
                        <p className="text-gray-500 text-xs">
                            Contact your hall's resident counselor for more information.
                        </p>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-slate-200 mt-8 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-sm text-center md:text-left">
                            © 2025 Peer Tutors @ IMSA. Made by IMSA students.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <span className="text-gray-400 text-xs">
                                Illinois Mathematics and Science Academy
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer; 
