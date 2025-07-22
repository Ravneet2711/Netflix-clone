import React, { useRef, useState } from "react";
import logo from "../assets/Netflix-LOGO.png";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, Search, X, Menu } from "lucide-react";
import profilePicture from "../assets/profile.jpg";

const Navbar = () => {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(null);

  const mainInputRef = useRef(null);
  const mobileInputRef = useRef(null);

  const toggleSearch = (type) => {
    if (type === "mobile") {
      mobileInputRef.current?.focus();
    } else {
      mainInputRef.current?.focus();
    }
    setIsSearchActive((prev) => !prev);
  };

  const handleSearch = (e) => {};

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col px-5 md:px-10 transition-all duration-300 ease-in-out text-white">
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-x-6 md:gap-x-8 items-center">
          <Link to="/">
            <img src={logo} alt="Netflix logo" className="w-28" />
          </Link>
          <nav className="hidden text-sm lg:flex space-x-4">
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link to="/" className="hover:text-gray-300">
              TV Shows
            </Link>
            <Link to="/" className="hover:text-gray-300">
              Movies
            </Link>
            <Link to="/" className="hover:text-gray-300">
              New & Popular
            </Link>
            <Link to="/mylist" className="hover:text-gray-300">
              My List
            </Link>
            <Link to="/" className="hover:text-gray-300">
              Browse By Language
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className={` hidden md:flex relative items-center transition-all duration-300 ${
              isSearchActive ? "w-72 p-2" : "w-auto"
            }`}
          >
            <button
              className={`flex items-center justify-center p-2 ${
                isSearchActive ? "absolute left-0" : ""
              }`}
              aria-label="Toggle Search"
              onClick={(e) => {
                e.stopPropagation();
                toggleSearch("main");
              }}
            >
              {!isSearchActive && <Search size={20} color="white" />}
            </button>
            <input
              ref={mainInputRef}
              type="text"
              placeholder="Search"
              aria-label="Search"
              className={`absolute left-10 bg-black bg-opacity-75 text-white rounded-md
                            border border-transparent focus:outline-none transition-all duration-300
                            ${
                              isSearchActive
                                ? "w-60 p-2 border-white opacity-100"
                                : "w-0 p-0 opacity-0"
                            }  `}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleSearch}
            />
          </div>
          <Bell size={20} color="white" />
          <img
            src={profilePicture}
            alt="Profile Image"
            className="w-8 h-8 rounded cursor-pointer"
          />
          <ChevronRight size={20} color="white" />
          <button
            onClick={toggleMenu}
            className={`lg:hidden ml-4 focus:outline-none`}
            aria-label="Hamburger-Menu"
          >
            <Menu size={20} color="white" />
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black bg-opacity-95 p-8 flex flex-col gap-4 transition-transform duration-300
      z-40 ${isMenuOpen ? "translate-y-0" : "translate-y-full"} lg:hidden`}
      >
        <button className="self-end" onClick={closeMenu}>
          <X color="white" size={24} />
        </button>
        <nav className="flex flex-col space-y-2 mt-4">
          <div
            className={`relative flex transition-all duration-300 ${
              isSearchActive ? "" : "w-auto"
            }`}
          >
            <button
              className={`flex items-center justify-center  ${
                isSearchActive ? "absolute left-0" : ""
              }`}
              aria-label="Toggle Search"
              onClick={(e) => {
                e.stopPropagation();
                toggleSearch("mobile");
              }}
            >
              {!isSearchActive && <Search size={20} color="white" />}
            </button>
            <input
              ref={mobileInputRef}
              type="text"
              placeholder="Search"
              aria-label="Search"
              className={` bg-black bg-opacity-75 text-white rounded-md
                            border border-transparent focus:outline-none transition-all duration-300
                            ${
                              isSearchActive
                                ? "w-60 p-2 border-white opacity-100"
                                : "w-0 p-0 opacity-0"
                            }  `}
              onChange={(e) => {
                setSearchQuery(e.target.value);
              }}
              onKeyDown={handleSearch}
            />
          </div>
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          <Link to="/" className="hover:text-gray-300">
            TV Shows
          </Link>
          <Link to="/" className="hover:text-gray-300">
            Movies
          </Link>
          <Link to="/" className="hover:text-gray-300">
            New & Popular
          </Link>
          <Link to="/mylist" className="hover:text-gray-300">
            My List
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
