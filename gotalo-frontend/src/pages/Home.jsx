// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";

const HomePage = () => {
  return (
    <>
      <Navbar />

      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to LearnSphere!
        </h1>
        <p className="text-lg mb-6">
          Explore and enroll in a variety of courses to start learning today!
        </p>
        <Link
          to="/student/all-courses"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          View All Courses
        </Link>
      </div>
    </>
  );
};

export default HomePage;
