import React, { useEffect, useState } from "react";
import { fetchInstructorCourses, deleteCourse } from "../services/courseService";
import { useNavigate } from "react-router-dom";
import CourseCard from "./CourseCard";

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  // Fetch courses on component mount
  useEffect(() => {
    const getCourses = async () => {
      try {
        const res = await fetchInstructorCourses();
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses", err);
      }
    };

    getCourses(); // Fetch courses when the component mounts
  }, []); // Empty dependency array ensures this runs only once on mount

  // Handle deleting a course
  const handleDelete = async (id) => {
    try {
      await deleteCourse(id); // Call API to delete the course
      setCourses((prevCourses) => prevCourses.filter(course => course.id !== id)); // Update state to reflect the deletion
    } catch (err) {
      console.error("Error deleting course", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your Courses</h2>
      <button
        onClick={() => navigate("/instructor/create")}
        className="bg-blue-600 text-white px-4 py-2 rounded-md mb-6 hover:bg-blue-700"
      >
        Create New Course
      </button>

      <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <div key={course.id} className="course-card bg-white border rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
            <CourseCard course={course} />
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleDelete(course.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => navigate(`/instructor/edit/${course.id}`)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseManagement;
