import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CreateCourse = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    sessions: [{ title: "", videoLink: "", explanation: "" }],
  });
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSessions = [...form.sessions];
    updatedSessions[index] = { ...updatedSessions[index], [name]: value };
    setForm((prev) => ({ ...prev, sessions: updatedSessions }));
  };

  const handleAddSession = () => {
    setForm((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { title: "", videoLink: "", explanation: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // const token = sessionStorage.getItem("accessToken");

      // if (!token) {
      //   alert("Unauthorized! Please log in again.");
      //   return;
      // }
      
      const response = await axios.post(
        "http://localhost:3000/api/courses/courses",
        form,{withCredentials:true}
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/json",
        //   },
        // }
      );

      console.log("Course created:", response.data);
      navigate("/instructor/dashboard");
    } catch (err) {
      console.error("Error creating course:", err.response?.data || err.message);
      alert("Failed to create course. Please try again.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">
            Course Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-lg font-medium text-gray-700">
            Course Description
          </label>
          <textarea
            name="description"
            id="description"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Course Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-lg font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            id="category"
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          > 
            <option value="">Select Category</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
          </select>
        </div>

        {form.sessions.map((session, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Session {index + 1}</h3>

            <div className="mb-4">
              <label htmlFor={`session-title-${index}`} className="block text-lg font-medium text-gray-700">
                Session Title
              </label>
              <input
                type="text"
                name="title"
                id={`session-title-${index}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Session Title"
                value={session.title}
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor={`session-videoLink-${index}`} className="block text-lg font-medium text-gray-700">
                YouTube Video Link
              </label>
              <input
                type="text"
                name="videoLink"
                id={`session-videoLink-${index}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="YouTube Video Link"
                value={session.videoLink}
                onChange={(e) => handleChange(e, index)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor={`session-explanation-${index}`} className="block text-lg font-medium text-gray-700">
                Session Explanation
              </label>
              <textarea
                name="explanation"
                id={`session-explanation-${index}`}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Session Explanation"
                value={session.explanation}
                onChange={(e) => handleChange(e, index)}
              />
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddSession}
          className="w-full py-2 mb-6 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Another Session
        </button>

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
