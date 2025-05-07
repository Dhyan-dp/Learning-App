import React, { useEffect, useState } from "react";
import { fetchInstructorCourses } from "../../../services/courseService";
import { useNavigate } from "react-router-dom";
// import InstructorEnrollmentChart from "../../../components/InstructorEnrollmentChart"; // adjust if path differs
import InstructorEnrollmentChart from "../../../components/InstructorEnrollmentChart";
import axios from "axios";

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();

  // Fetch course list
  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await fetchInstructorCourses();
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching instructor dashboard data", err);
      }
    };
    getCourses();
  }, []);

  // Fetch chart data

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/enrollments");
        console.log(res.data)
        setChartData(res.data); // Axios auto-parses JSON
      } catch (err) {
        console.error("Error fetching enrollment chart", err);
      }
    };
  
    fetchChartData();
  }, []);
  
  const totalSessions = courses.reduce(
    (sum, course) => sum + course.sessions?.length,
    0
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Instructor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Courses</h2>
          <p className="text-4xl font-bold text-blue-500 mt-2">{courses.length}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold text-gray-700">Total Sessions</h2>
          <p className="text-4xl font-bold text-green-500 mt-2">{totalSessions}</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex flex-col justify-between">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate("/instructor/create")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              + Create New Course
            </button>
            <button
              onClick={() => navigate("/instructor/manage")}
              className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              📚 Manage Courses
            </button>
          </div>
        </div>
      </div>

      {/* Enrollment Chart */}
      <InstructorEnrollmentChart data={chartData} />

      {/* Course List */}
      <div className="bg-white rounded-2xl shadow p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition bg-gray-100"
            >
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-2">{course.description}</p>
              <div className="flex justify-between mt-2">
                <button
                  onClick={() => navigate(`/instructor/edit/${course.id}`)}
                  className="text-blue-600 hover:underline"
                >
                  Edit
                </button>
                <span className="text-sm text-gray-500">
                  {course.sessions?.length} Sessions
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
