import React from "react";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ course, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.description}</p>
      <button onClick={() => navigate(`/instructor/edit/${course.id}`)}>Edit</button>
      <button onClick={() => onDelete(course.id)}>Delete</button>
    </div>
  );
};

export default CourseCard;
