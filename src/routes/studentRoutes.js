const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middlewares/authMiddleware'); 

const { PrismaClient } = require('../../generated/prisma');
const prisma = new PrismaClient();

router.post('/enroll', authenticateJWT, async (req, res) => {
  try {
    const studentId = req.user.id;
    const { courseId } = req.body;

    // Check if already enrolled
    const existing = await prisma.enrollment.findFirst({
      where: { studentId, courseId },
    });

    if (existing) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    // ✅ Create new enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        completedSessions: [],
      },
    });

    res.status(201).json({ message: "Enrollment successful", enrollment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to enroll' });
  }
});

// ✅ Mark a session as completed
router.post('/complete-session', authenticateJWT, async (req, res) => {
  const studentId = req.user.id;
  const { courseId, sessionId } = req.body;

  if (!courseId || !sessionId) {
    return res.status(400).json({ message: 'courseId and sessionId are required' });
  }

  try {
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        studentId,
        courseId,
      },
    });

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    if (!enrollment.completedSessions.includes(sessionId)) {
      await prisma.enrollment.update({
        where: { id: enrollment.id },
        data: {
          completedSessions: {
            set: [...enrollment.completedSessions, sessionId],
          },
        },
      });
    }

    res.json({ message: 'Session marked as completed' });
  } catch (err) {
    console.error('Error marking session complete:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// router.get('/enrollments', authenticateJWT, async (req, res) => {
//   try {
//     const studentId = req.user.id;

//     const enrollments = await prisma.enrollment.findMany({
//       where: { studentId },
//       include: {
//         course: {
//           include: {
//             sessions: true, // ✅ Include sessions in response
//           },
//         },
//       },
//     });

//     res.json(enrollments); // ✅ This now includes full course & session data
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Failed to fetch enrollments' });
//   }
// });

router.get('/enrollments', authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === "STUDENT") {
      const enrollments = await prisma.enrollment.findMany({
        where: { studentId: userId },
        include: {
          course: {
            include: {
              sessions: true,
            },
          },
        },
      });

      return res.json(enrollments);
    }

    // Instructor: Get enrollment count per course
    if (role === "INSTRUCTOR") {
      const courses = await prisma.course.findMany({
        where: { instructorId: userId },
        include: {
          enrollments: true,
        },
      });

      // Format for chart
      const chartData = courses.map((course) => ({
        title: course.title,
        count: course.enrollments.length,
      }));

      return res.json(chartData);
    }

    res.status(403).json({ message: "Unauthorized access" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch enrollments' });
  }
});


router.get('/course/:courseId/sessions', authenticateJWT, async (req, res) => {
    const studentId = req.user.id;
    const { courseId } = req.params; 
  
    try {
      const sessions = await prisma.session.findMany({
        where: { courseId },
        orderBy: { order: 'asc' }, // assuming sessions have an `order` field
      });
  
      const enrollment = await prisma.enrollment.findFirst({
        where: { studentId, courseId },
      });
  
      const completedSessions = enrollment?.completedSessions || [];
  
      const sessionsWithStatus = sessions.map((session) => ({
        ...session,
        isCompleted: completedSessions.includes(session.id),
      }));
  
      res.json(sessionsWithStatus);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to fetch sessions' });
    }
  });




router.get('/session/:sessionId', authenticateJWT, async (req, res) => {
    const { sessionId } = req.params;
  
    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      });
  
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
  
      res.json(session);
    } catch (err) {
      console.error("Error fetching session:", err);
      res.status(500).json({ message: "Failed to fetch session" });
    }
  });
  
module.exports = router;
