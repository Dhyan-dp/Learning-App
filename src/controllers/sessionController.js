exports.createSession = async (req, res) => {
    const { title, videoUrl, content, courseId } = req.body;
  
    if (!title || !videoUrl || !content || !courseId) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const session = await prisma.session.create({
        data: {
          title,
          videoUrl,
          content,
          courseId,
        },
      });
  
      res.status(201).json(session);
    } catch (error) {
      console.error("Create session error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
      