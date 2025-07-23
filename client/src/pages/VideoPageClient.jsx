import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import VideoPlayer from "../components/VideoPlayerClient";
import ClientCommentsSection from "../components/CommentsSectionClient";

const API = import.meta.env.VITE_API_URL;

function VideoPageClient() {
    const user = JSON.parse(localStorage.getItem("user"));
    const { id } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    // const [name, setName] = useState(user.name || "");
    const [name, setName] = useState(() => {
        const storedClientName = localStorage.getItem("clientName");
        return user?.name || storedClientName || "";
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const videoRef = useRef(null);

    useEffect(() => {
        if (!user && name) {
            localStorage.setItem("clientName", name);
        }
    }, [name]);
    useEffect(() => {

        const fetchVideo = async () => {
            try {
                const res = await fetch(`${API}/api/video/share/${id}`);
                if (!res.ok) throw new Error("This video is private or does not exist.");
                const data = await res.json();
                setVideo(data);
                setComments(data.comments || []);
            } catch (err) {
                console.error("Error fetching video:", err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchVideo();
    }, [id]);

    const handleAddComment = async () => {
        if (!name.trim()) {
            setError("Please enter your name.");
            return;
        }
        if (!commentText.trim()) {
            setError("Comment cannot be empty.");
            return;
        }
        setError("");
        const timestamp = videoRef.current.currentTime.toFixed(2);
        const newComment = { name, text: commentText, timestamp };
        try {
            const res = await fetch(`${API}/api/video/${id}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });
            if (res.ok) {
                const savedComment = await res.json();
                setComments(prev => [...prev, newComment]);
                setCommentText("");
            } else {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to add comment.");
            }
        } catch (err) {
            console.error("Error adding comment:", err);
            setError(err.message);
        }
    };

    const handlePauseVideo = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleCommentClick = (timestamp) => {
        if (videoRef.current && timestamp !== undefined) {
            videoRef.current.currentTime = parseFloat(timestamp);
            videoRef.current.pause();
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            {/* <Navbar /> */}

            <main className="flex-1 p-4 md:p-6 flex flex-row flex-wrap md:flex-row gap-6">
                <VideoPlayer
                    ref={videoRef}
                    video={video}
                    isLoading={isLoading}
                    error={error}
                />
                <ClientCommentsSection
                    comments={comments}
                    isLoading={isLoading}
                    error={error}
                    name={name}
                    setName={setName}
                    commentText={commentText}
                    setCommentText={setCommentText}
                    onAddComment={handleAddComment}
                    onCommentClick={handleCommentClick}
                    onCommentTextFocus={handlePauseVideo}
                />
            </main>
            <Footer />
        </div>
    );
}

export default VideoPageClient;