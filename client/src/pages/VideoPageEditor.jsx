import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "../components/CreateWorkspaceModel";
import Footer from "../components/Footer";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import CommentsSection from "../components/CommentsSection";

const API = import.meta.env.VITE_API_URL;

function VideoPageEditor() {
    const { wsid, vid } = useParams();
    const [video, setVideo] = useState(null);
    const [comments, setComments] = useState(null);
    const [commentText, setCommentText] = useState("");
    const [name, setName] = useState(localStorage.getItem("username") || "");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const videoRef = useRef(null);
    const [isPublic, setIsPublic] = useState(null);
    const [shareUrl, setShareUrl] = useState("");
    const [workspaces, setWorkspaces] = useState([]);
    const [selectedWorkspaceName, setSelectedWorkspaceName] = useState("");
    const navigate = useNavigate();
    const [createWorkspace, setCreateWorkspace] = useState(false);

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const res = await fetch(`${API}/api/workspace`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (!res.ok) throw new Error("Failed to fetch workspaces");
                const data = await res.json();
                setWorkspaces(data);
            } catch (err) {
                console.error("Error fetching workspaces:", err);
            }
        };
        fetchWorkspaces();
    }, []);

    useEffect(() => {
        const fetchVideo = async () => {
            setIsLoading(true);
            try {
                const res = await fetch(`${API}/api/video/${vid}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setVideo(data);
                    setComments(data.comments || []);
                    setIsPublic(data.isPublic);
                    if (data.isPublic) {
                        setShareUrl(`${window.location.origin}/video/${data._id}`);
                    }
                    const linkedWorkspace = workspaces.find(ws => ws._id === data.workspace);
                    if (linkedWorkspace) {
                        setSelectedWorkspaceName(linkedWorkspace.name);
                    }
                }
            } catch (err) {
                console.error("Error fetching video:", err);
            } finally {
                setIsLoading(false);
            }
        };

        if (vid && workspaces.length > 0) fetchVideo();
    }, [vid, workspaces]);

    function onToggleTick(cid, ticked) {
        fetch(`${API}/api/video/${vid}/comments/${cid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ ticked }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.comment) {
                    setComments(prev =>
                        prev.map(comment =>
                            comment._id === cid ? { ...comment, ticked: data.comment.ticked } : comment
                        )
                    );
                }
            })
            .catch(err => console.error("Error updating tick:", err));
    }

    function onDeleteComment(cid) {
        fetch(`${API}/api/video/${vid}/comments/${cid}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === "Comment deleted successfully") {
                    setComments(prev => prev.filter(comment => comment._id !== cid));
                }
            })
            .catch(err => console.error("Error deleting comment:", err));
    }


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
        const timestamp = parseFloat(videoRef.current.currentTime.toFixed(2));

        const newComment = { name, text: commentText, timestamp };

        try {
            const res = await fetch(`${API}/api/video/${vid}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });

            if (res.ok) {
                const savedComments = await res.json();
                const latestComment = savedComments[savedComments.length - 1];
                setComments(prev => [...prev, latestComment]);
                setCommentText("");
            }
        } catch (err) {
            console.error("Error adding comment:", err);
        }
    };

    const handlePrivacyChange = async (newIsPublic) => {
        try {
            const res = await fetch(`${API}/api/video/${vid}/privacy`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ isPublic: newIsPublic }),
            });
            const data = await res.json();
            if (res.ok) {
                setIsPublic(newIsPublic);
                setShareUrl(newIsPublic ? `${window.location.origin}/video/${data.id}` : "");
            } else {
                throw new Error(data.message || "Failed to update privacy");
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleShare = () => {
        if (isPublic && shareUrl) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => alert("Share URL copied to clipboard!"))
                .catch((err) => console.error("Failed to copy:", err));
        }
    };

    const handleCommentClick = (timestamp) => {
        if (videoRef.current && timestamp !== undefined) {
            videoRef.current.currentTime = parseFloat(timestamp);
            videoRef.current.pause();
        }
    };

    const handleCommentTextFocus = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-black text-white">

            <div className="flex flex-1 overflow-y-auto">
                <WorkspaceSidebar
                    workspaces={workspaces}
                    currentWorkspaceId={wsid}
                    onCreateClick={() => setCreateWorkspace(true)}
                />

                <main className="flex-1 p-4 md:p-6 overflow-contain flex flex-row flex-wrap md:flex-row gap-6">
                    <div className="flex-1 w-full  bg-zinc-900 p-4 rounded-lg">
                        <div className="flex justify-between items-start md:items-center flex-row flex-wrap md:flex-row gap-4 mb-4">
                            <h2 className="text-xl break-words">
                                {selectedWorkspaceName && (
                                    <span className="text-lg font-semibold text-gray-400 mr-2">
                                        {selectedWorkspaceName} /
                                    </span>
                                )}
                                {video ? video.title : "Loading..."}
                            </h2>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <button
                                    disabled={isPublic === null}
                                    onClick={() => handlePrivacyChange(!isPublic)}
                                    className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${isPublic ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' : 'bg-gray-600/50 text-gray-300 hover:bg-gray-600/80'}`}
                                >
                                    {isPublic ? <FaEye /> : <FaEyeSlash />}
                                    <span>{isPublic ? 'Public' : 'Private'}</span>
                                </button>
                                <button
                                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm font-semibold rounded-md disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed"
                                    onClick={handleShare}
                                    disabled={!isPublic}
                                >
                                    Share
                                </button>
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="w-full aspect-video flex items-center justify-center bg-zinc-900 rounded-lg">
                                <div className="animate-spin border-4 border-gray-400 border-t-white rounded-full w-12 h-12"></div>
                            </div>
                        ) : (
                            <div className="w-full max-w-full overflow-hidden rounded-lg bg-black">
                                <video ref={videoRef} controls className="w-full h-[70vh] aspect-video">
                                    <source src={video?.url} type="video/mp4" />
                                </video>
                            </div>
                        )}
                    </div>

                    <CommentsSection
                        comments={comments}
                        isLoading={comments === null}
                        error={error}
                        name={name}
                        setName={setName}
                        commentText={commentText}
                        setCommentText={setCommentText}
                        onAddComment={handleAddComment}
                        onCommentClick={handleCommentClick}
                        onCommentTextFocus={handleCommentTextFocus}
                        onToggleTick={onToggleTick}
                        onDeleteComment={onDeleteComment}
                    />
                </main>
            </div>

            {createWorkspace && <CreateWorkspaceModal setShowModal={setCreateWorkspace} setWorkspaces={setWorkspaces} />}
            <Footer />
        </div>
    );
}

export default VideoPageEditor;