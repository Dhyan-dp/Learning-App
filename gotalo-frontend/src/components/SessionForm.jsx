const CreateSessionForm = ({ courseId, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [content, setContent] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit({ title, videoUrl, content, courseId });
    };
  
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Session Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
  
        <input
          type="url"
          placeholder="YouTube Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          required
        />
  
        <textarea
          placeholder="Session Content (Rich Text)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
  
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Session
        </button>
      </form>
    );
  };
  