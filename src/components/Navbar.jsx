import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../config/firebase";


const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Generated Pitch", path: "/generate-pitch" },
    { name: "Your Pitch", path: "/your-pitch" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      navigate("/");
      toast.success("Logged out");
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
          isScrolled
            ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
            : "py-4 md:py-6"
        }`}
      >
        <Link
          to="/"
          className={`flex items-center gap-2 text-2xl font-bold text-gray-700 `}
        >
          Pitch Craft
        </Link>

        {/* Desktop Nav (content unchanged) */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              className={`group flex flex-col gap-0.5 text-gray-700`}
            >
              {link.name}
              <div
                className={`bg-gray-700 h-0.5 w-0 group-hover:w-full transition-all duration-300`}
              />
            </Link>
          ))}
        </div>

        
        {currentUser ? (
          <div className="hidden md:flex items-center gap-2">
            <Link
              onClick={handleLogout}
              className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 text-white bg-black`}
            >
              Logout
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 text-white bg-black`}
            >
              Login
            </Link>
          </div>
        )}

        
        <div className="flex items-center gap-3 md:hidden">
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`h-6 w-6 cursor-pointer ${isScrolled ? "invert" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks.map((link, i) => (
            <Link key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
              {link.name}
            </Link>
          ))}
          <Link
            to={"/login"}
            onClick={() => setIsMenuOpen(false)}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </Link>
        </div>
      </nav>
      <div className="pt-20 md:pt-24 lg:pt-28"></div>
    </>
  );
};

export default Navbar;
