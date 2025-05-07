import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/userSlice";
import { setAuthenticated } from "../redux/authSlice";
import { loginUser } from "../services/authServices";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginUser(form.email, form.password);
  
      const res = await axios.get("http://localhost:3000/api/auth/me", {
        withCredentials: true,
      });
  
      dispatch(setUser(res.data));
      dispatch(setAuthenticated(true));
  
      const { role, id } = res.data;
  
      if (role === "STUDENT") {
        // Check enrolled courses for the student
        const enrollRes = await axios.get("http://localhost:3000/api/student/enrollments",
          { withCredentials: true }
        );
  
        const enrolledCourses = enrollRes.data;
  
        if (enrolledCourses.length > 0) {
          navigate("/student/dashboard");
        } else {
          navigate("/student/all-courses");
        }
      } else if (role === "INSTRUCTOR") {
        navigate("/instructor/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 to-gray-800">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to Gotalo</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
        </form>
        {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
        <p className="text-sm text-gray-600 mt-6 text-center">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline font-medium">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
