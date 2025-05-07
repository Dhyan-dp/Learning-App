// const { PrismaClient } = require("../../generated/prisma");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createCourse = async (req, res) => {
  try {
    const { title, description, category, sessions } = req.body;
    const instructorId = req.user.id;

    const existingCourse = await prisma.course.findUnique({
      where: { title },
    });

    if (existingCourse) {
      return res.status(400).json({ message: "Course with this title already exists." });
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        category,
        instructorId,
        sessions: {
          create: sessions.map((session) => ({
            title: session.title,
            videoUrl: session.videoLink,
            content: session.explanation,
          })),
        },
      },
      include: { sessions: true },
    });

    res.status(201).json({ message: "Course created successfully!", newCourse });
  } catch (err) {
    console.error("Create course error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: true,  // Include instructor details (for showing who is the instructor)
      },
    });

    res.status(200).json(courses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching courses." });
  }
};

// Get a specific course by ID
const getCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: true,  // Include instructor details
        sessions: true,    // Assuming sessions are related to courses
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching course." });
  }
};

// Get all published courses
const getPublishedCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      
      orderBy: {
        createdAt: "desc", // optional: latest first
      },
    });
// console.log(courses)
    // Even if no courses, it's not an error — just return empty array
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching published courses:", error);
    res.status(500).json({ message: "Server error occurred while fetching published courses." });
  }
};


// Other controller methods like createCourse, getAllCourses, etc. go here


// Update a course (Only accessible by instructor)
const updateCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { title, description, category } = req.body;

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        category,
      },
    });

    res.status(200).json({ message: "Course updated successfully!", updatedCourse });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating course." });
  }
};

// Delete a course (Only accessible by instructor)
const deleteCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Delete course
    await prisma.course.delete({
      where: { id: courseId },
    });

    res.status(200).json({ message: "Course deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting course." });
  }
};




// GET /api/instructor/analytics/enrollment-chart

  // const getEnrollmentChartData = async (req, res) => {
  //   try {
  //     const instructorId = req.user.id;
  //     console.log("get id 3:", instructorId);
      

  //     // Fetch courses by instructor
  //     const courses = await prisma.course.findMany({
  //       where:  {instructorId} ,
  //       include: {
  //         enrollments: true, // assuming each course has enrollments relation
  //       },
  //     });
  //     console.log("course 1:",courses);
      

  //     // Prepare chart data
  //     const chartData = courses.map(course => ({
  //       title: course.title,
  //       enrollmentCount: course.enrollments.length,
  //     }));
      
  //     console.log("data 2:", chartData);
      

  //     res.json(chartData);
  //   } catch (err) {
  //     console.error("Enrollment chart error:", err);
  //     res.status(500).json({ error: "Failed to fetch enrollment chart data" });
  //   }
  // };


module.exports = {createCourse, getAllCourses, getCourseById,getPublishedCourses, updateCourse, deleteCourse }
// module.exports.createCourse = createCourse;
// module.exports.getAllCourses = getAllCourses;
// module.exports.getCourseById = getCourseById;
// module.exports.updateCourse = updateCourse;
// module.exports.deleteCourse = deleteCourse;
