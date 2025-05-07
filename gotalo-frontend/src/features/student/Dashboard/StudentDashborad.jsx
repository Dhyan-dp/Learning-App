import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingCourseId, setUpdatingCourseId] = useState(null);
  const coursesRef = useRef(null);

  const navigate=useNavigate();

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/student/enrollments", {
          withCredentials: true,
        });
        console.log(res.data);
        setEnrollments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Failed to fetch enrolled courses");
        console.error("Error fetching enrollments:", err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const markSessionCompleted = async (courseId, sessionId) => {
    try {
      setUpdatingCourseId(courseId);
      await axios.post(
        "http://localhost:3000/api/student/complete-session",
        { courseId, sessionId },
        { withCredentials: true }
      );

      setEnrollments((prev) =>
        prev.map((enrollment) =>
          enrollment.course.id === courseId
            ? {
                ...enrollment,
                completedSessions: [
                  ...new Set([...enrollment.completedSessions, sessionId]),
                ],
              }
            : enrollment
        )
      );
    } catch (err) {
      console.error("Error marking session completed:", err);
    } finally {
      setUpdatingCourseId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true });
      // window.location.href = "/login";
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const scrollToCourses = () => {
    navigate("/student/all-courses")  
    coursesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Gotalo - Student</h1>
        <div className="space-x-4">
          <button
            onClick={scrollToCourses}
            className="hover:bg-blue-800 px-4 py-2 rounded transition"
          >
            My Courses
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Main Dashboard */}
      <div className="p-6" ref={coursesRef}>
        <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>

        {loading ? (
          <p>Loading your dashboard...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : enrollments.length === 0 ? (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold mb-2">You haven’t enrolled in any courses yet.</p>
            <p className="text-sm text-gray-600 mb-4">
              Browse available courses and start learning today!
            </p>
            <a
              href="/student/all-courses"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View All Courses
            </a>
          </div>
        ) : (
          enrollments.map((enrollment) => {
            const { course, completedSessions } = enrollment;
            const total = course?.sessions.length;
            const completed = completedSessions?.length;
            const progress = Math.round((completed / total) * 100);

            return (
              <div key={course?.id} className="border rounded-lg p-4 mb-6 shadow">
                <h3 className="text-xl font-semibold">{course?.title}</h3>
                <p className="text-gray-600 mb-2">{course?.description}</p>

                <div className="mb-2">
                  <div className="w-full bg-gray-200 h-4 rounded-full">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {completed} of {total} sessions completed ({progress}%)
                  </p>
                </div>

                <h4 className="font-medium mt-4 mb-2">Sessions:</h4>
                {course?.sessions.map((session) => (
                  <div key={session.id} className="mb-6 p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold">{session?.title}</h5>
                      {!completedSessions.includes(session?.id) ? (
                        <button
                          onClick={() => markSessionCompleted(course?.id, session?.id)}
                          className="text-blue-600 underline text-xs"
                        >
                          Mark as Completed
                        </button>
                      ) : (
                        <span className="text-green-600 text-xs">Completed</span>
                      )}
                    </div>

                    {/* YouTube Video Embed */}
                    {session.videoUrl && (
                      <div className="mb-2">
                        <iframe
                          className="w-full h-64 rounded"
                          src={`https://www.youtube.com/embed/${session.videoUrl.split("v=")[1]}`}
                          title={session.title}
                          frameBorder="0"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}

                    {/* Explanation */}
                    {session.explanation && (
                      <div
                        className="prose max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: session.explanation }}
                      />
                    )}

                    {updatingCourseId === course.id && (
                      <p className="text-blue-500 text-xs mt-1">Updating...</p>
                    )}
                  </div>
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
