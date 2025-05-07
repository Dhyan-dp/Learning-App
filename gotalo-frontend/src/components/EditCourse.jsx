import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchInstructorCourses, updateCourse } from "../services/courseService";

const categoryOptions = ["Programming", "Design", "Marketing", "Business"];

const EditCourse = () => {
  const [course, setCourse] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getCourse = async () => {
      try {
        const res = await fetchInstructorCourses();
        console.log("Fetched courses:", res.data);

        console.log("URL id:", id);
        console.log("Available course IDs:", res.data.map(c => c.id));

        const courseToEdit = res.data.find((c) => c.id.toString() === id);
        console.log(courseToEdit);
        setCourse(courseToEdit);
      } catch (err) {
        console.error("Error fetching course", err);
      }
    };
    getCourse();
  }, [id]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSessions = [...(course.sessions || [])];
    updatedSessions[index] = { ...updatedSessions[index], [name]: value };
    setCourse((prev) => ({ ...prev, sessions: updatedSessions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse(course.id, course);
      navigate("/instructor/dashboard");
    } catch (err) {
      console.error("Error updating course", err);
      alert("Failed to update course. Please try again.");
    }
  };

  if (!course) return <div className="text-center py-10 text-lg">Loading course details...</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Edit Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={course.title}
          onChange={(e) => setCourse({ ...course, title: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />

        <textarea
          name="description"
          placeholder="Course Description"
          value={course.description}
          onChange={(e) => setCourse({ ...course, description: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        />

        <select
          name="category"
          value={course.category}
          onChange={(e) => setCourse({ ...course, category: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
        >
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="space-y-6">
          {course.sessions?.map((session, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold text-gray-700 mb-2">Session {index + 1}</h3>
              <input
                type="text"
                name="title"
                placeholder="Session Title"
                value={session.title}
                onChange={(e) => handleChange(e, index)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="videoLink"
                placeholder="YouTube Video Link"
                value={session.videoLink}
                onChange={(e) => handleChange(e, index)}
                className="w-full mb-2 p-2 border border-gray-300 rounded-md"
              />
              <textarea
                name="explanation"
                placeholder="Explanation"
                value={session.explanation}
                onChange={(e) => handleChange(e, index)}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
