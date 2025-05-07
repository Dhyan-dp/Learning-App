import API from "./authServices";


export const createCourse = async (courseData) => {
  return await API.post("/courses", courseData);
};

export const fetchInstructorCourses = async () => {
  return await API.get("/courses/courses");
};

export const updateCourse = async (id, updatedData) => {
  return await API.put(`/courses/${id}`, updatedData);
};

export const deleteCourse = async (id) => {
  return await API.delete(`/courses/courses/${id}`);
};

export const addSessionToCourse = async (courseId, sessionData) => {
    return await API.post(`/courses/${courseId}/sessions`, sessionData);
  };
  
  // Update a session
  export const updateSession = async (sessionId, sessionData) => {
    return await API.put(`/sessions/${sessionId}`, sessionData);
  };
  
  // Delete a session
  export const deleteSession = async (sessionId) => {
    return await API.delete(`/sessions/${sessionId}`);
  };
