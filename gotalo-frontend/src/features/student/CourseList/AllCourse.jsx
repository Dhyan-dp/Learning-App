import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ useNavigate for redirection

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅ used for redirect

  // 🔓 LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      // localStorage.removeItem("token");
      navigate("/login"); // redirect to login
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // 🔁 REDIRECT TO DASHBOARD
  const goToDashboard = () => {
    navigate("/student/dashboard"); // adjust path if needed
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/courses/published", {
          withCredentials: true,
        });
        const coursesData = Array.isArray(res.data) ? res.data : [];
        setCourses(coursesData);
      } catch (err) {
        setError("Failed to fetch courses.");
        console.error("Error fetching courses:", err.response || err.message);
      }
    };

    const fetchEnrollments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/enrollments", {
          withCredentials: true,
        });
        setEnrolledCourseIds(Array.isArray(res.data) ? res.data.map((e) => e.courseId) : []);
      } catch (err) {
        console.error("Error fetching enrollments", err);
      }
    };

    fetchCourses();
    fetchEnrollments();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/student/enroll",
        { courseId },
        { withCredentials: true }
      );
      setEnrolledCourseIds((prev) => [...prev, courseId]);
    } catch (err) {
      console.error("Error enrolling in course", err);
    }
  };

  return (
    <div className="p-6">
      {/* ✅ NAVBAR */}
      <div className="flex justify-between items-center mb-6 bg-gray-100 p-4 rounded shadow">
        <h1 className="text-xl font-bold">Student Portal</h1>
        <div className="space-x-4">
          <button
            onClick={goToDashboard}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            My Enrolled Courses
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-4">All Published Courses</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <p>No courses available in this category.</p>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="border p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{course.title}</h2>
              <p className="text-gray-600 mb-2">{course.description}</p>
              <p className="text-sm text-gray-500 mb-2">
                Category: <span className="font-medium">{course.category}</span>
              </p>
              {enrolledCourseIds.includes(course.id) ? (
                <p className="text-green-600 font-semibold">Already Enrolled</p>
              ) : (
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Enroll Now
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
