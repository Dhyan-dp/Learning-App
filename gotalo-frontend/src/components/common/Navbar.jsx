import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import axios from "axios";

export default function Navbar() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post("/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      dispatch(logoutUser());
    }
  };

  return (
    <nav className="bg-white border-b shadow">
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center h-16">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          LearnSphere
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/student/all-courses" className="hover:text-blue-700">
            Courses
          </Link>
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1 border border-blue-600 text-blue-600 rounded hover:bg-blue-50"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="text-gray-700">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
