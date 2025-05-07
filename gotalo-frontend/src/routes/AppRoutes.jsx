import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';

import StudentLayout from '../layouts/StudentLayout';
import InstructorLayout from '../layouts/InstructorLayout';

import StudentDashboard from '../features/student/Dashboard/StudentDashboard';
import CourseList from '../features/student/CourseList/CourseList';
import CourseDetail from '../features/student/CourseDetail/CourseDetail';
import Enroll from '../features/student/Enroll/Enroll';
import Progress from '../features/student/Progress/Progress';

import InstructorDashboard from '../features/instructor/Dashboard/InstructorDashboard';
import CreateCourse from '../features/instructor/CreateCourse/CreateCourse';
import ManageCourses from '../features/instructor/ManageCourses/ManageCourses';
import AddSession from '../features/instructor/AddSession/AddSession';

// import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';


const ProtectedRoute = ({ children, role }) => {
  const { user } = useSelector((state)=> state.user);

  if (!user) return <Navigate to="/login" />;

  if (role && user.role !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute role="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<CourseList />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="enroll/:id" element={<Enroll />} />
        <Route path="progress/:id" element={<Progress />} />
      </Route>

      {/* Instructor Routes */}
      <Route
        path="/instructor/*"
        element={
          <ProtectedRoute role="INSTRUCTOR">
            <InstructorLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<InstructorDashboard />} />
        <Route path="create-course" element={<CreateCourse />} />
        <Route path="manage-courses" element={<ManageCourses />} />
        <Route path="add-session/:courseId" element={<AddSession />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
