import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";

export default function SessionViewer() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/student/session/${sessionId}`, {
          withCredentials: true,
        });
        setSession(res.data);
      } catch (err) {
        setError("Failed to load session.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) return <p className="p-4">Loading session...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-blue-600 underline"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">{session?.title}</h1>

      {/* ✅ ReactPlayer for YouTube Video */}
      <div className="mb-6 aspect-video rounded overflow-hidden">
        <ReactPlayer url={session?.videoUrl} controls width="100%" height="100%" />
      </div>

      {/* ✅ Rich Text Explanation Content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: session?.content }}
      />
    </div>
  );
}
