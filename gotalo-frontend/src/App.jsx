import { Routes, Route } from "react-router-dom";

import StudentDashboard from "./features/student/Dashboard/StudentDashborad";
import AllCourses from "./features/student/CourseList/AllCourse";
import SessionViewer from "./features/student/SessionViewer/SessionViewer";
import HomePage from "./pages/Home";
import Register from "./pages/Register";
import Login from './pages/Login'
import InstructorDashboard from "./features/student/Dashboard/InstructorDashboard";
import CreateCourse from "./components/CreateCourse";
import EditCourse from "./components/EditCourse";
import CourseManagement from "./components/CourseManagement";
const AppRoutes = () => { 
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Home Page */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/all-courses" element={<AllCourses />} /> {/* <-- add this */}
      <Route path="/student/session/:sessionId" element={<SessionViewer />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/instructor/dashboard" element={<InstructorDashboard/>}/>
      <Route path="/instructor/create" element={<CreateCourse/>}/>
      <Route path="/instructor/edit/:id" element={<EditCourse/>}/>
      <Route path="/instructor/manage" element={<CourseManagement />} />
    </Routes>
  );
};

export default AppRoutes;
