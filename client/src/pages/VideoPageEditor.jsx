import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CreateWorkspaceModal from "../components/CreateWorkspaceModel";
import Footer from "../components/Footer";
import { FaChevronDown, FaEye, FaEyeSlash } from "react-icons/fa";
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
    const [showLeftSidebar, setShowLeftSidebar] = useState(false);
    const sidebarRef = useRef(null);
    const [CreateWorkspace, setCreateWorkspace] = useState(false)

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const res = await fetch(`${API}/api/workspace`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || "Failed to fetch workspaces");
                }
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
                    if (data.workspace) {
                        const workspaceRes = await fetch(`${API}/api/workspace/${data.workspace}`, {
                            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                        });
                        if (workspaceRes.ok) {
                            const workspaceData = await workspaceRes.json();
                            setSelectedWorkspaceName(workspaceData.name);
                        } else {
                            console.error("Failed to fetch workspace for video");
                        }
                    }

                }
            } catch (err) {
                console.error("Error fetching video:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVideo();
    }, [vid]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target) && showLeftSidebar) {
                setShowLeftSidebar(false);
            }
        };
        if (showLeftSidebar) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showLeftSidebar]);

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
            const res = await fetch(`${API}/api/video/${vid}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newComment),
            });

            const data = await res.json();

            if (res.ok) {
                setComments([...comments, newComment]);
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
                if (newIsPublic) {
                    setShareUrl(`${window.location.origin}/video/${data.id}`);
                } else {
                    setShareUrl("");
                }
            } else {
                throw new Error(data.message || "Failed to update privacy setting");
            }

        } catch (err) {
            console.error("Error changing privacy:", err);
            setError(err.message || "Failed to change privacy settings.");
        }
    };

    const handleShare = () => {
        if (isPublic) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => {
                    alert("Share URL copied to clipboard!");
                })
                .catch((err) => {
                    console.error("Failed to copy:", err);
                    alert("Failed to copy URL. Please copy manually.");
                });
        } else {
            alert("This video is private and cannot be shared.");
        }
    };


    return (
        <div className="flex flex-col min-h-screen bg-[#0f172a] text-white">
            <nav className="bg-[#1e293b] sticky top-0 z-50 p-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xl font-bold">
                    <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className="md:hidden text-white mr-2">
                        <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                    <Link to={'/'}>
                    <div className="flex items-center space-x-2 text-xl font-bold">
                        <span>🔥</span>
                        <h2>Flame</h2>
                    </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={isPublic === null ? '' : (isPublic ? 'public' : 'private')}
                        onChange={(e) => handlePrivacyChange(e.target.value === 'public')}
                        className="hidden sm:block bg-[#374151] text-white px-4 py-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isPublic === null}
                    >
                        <option value="" disabled>Select Privacy</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <button
                        disabled={isPublic === null}
                        onClick={() => {
                            const next = isPublic === null ? true : !isPublic;
                            handlePrivacyChange(next);
                        }}
                        className="block sm:hidden bg-[#374151] text-white p-2 rounded-md border border-gray-600 hover:bg-[#4b5563] transition"
                        title={isPublic ? 'Public' : 'Private'}
                    >
                        {isPublic ? <FaEye className="w-5 h-5" /> : <FaEyeSlash className="w-5 h-5" />}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md ${isPublic
                                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            }`}
                        onClick={handleShare}
                        disabled={!isPublic}
                    >
                        Share
                    </button>
                </div>
            </nav>

            <div className="flex flex-grow">
                <div
                    ref={sidebarRef}
                    className={`${showLeftSidebar ? "block" : "hidden"} md:block fixed md:static top-[60px] md:top-0 left-0 bg-[#1e293b] w-64 min-h-screen md:h-auto z-40 transition-transform duration-300 ease-in-out`}
                >
                    <h3 className="text-lg font-semibold p-4">Workspaces</h3>
                    <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-60px-56px-56px)] md:h-auto">
                        {workspaces.map((ws) => (
                            <button
                                key={ws._id}
                                className={`w-full text-left px-4 py-2 rounded-md ${ws._id === wsid ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
                                    }`}
                                onClick={() => { navigate(`/workspace/${ws._id}`); setShowLeftSidebar(false); }}
                            >
                                {ws.name}
                            </button>
                        ))}
                    </div>
                    <div className="p-4">
                        <button
                            className="w-full bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-300"
                            onClick={() => { setCreateWorkspace(true); setShowLeftSidebar(false) }}
                        >
                            Create New Workspace
                        </button>
                    </div>
                </div>

                <div className="flex-grow md:flex md:p-4">
                    <div className="md:w-2/3 md:pr-4 mb-4 md:mb-0 p-4 md:p-0">
                        <h2 className="text-2xl font-bold mb-2">
                            {selectedWorkspaceName && (
                                <span className="text-lg font-semibold text-gray-400 mr-2">
                                    {selectedWorkspaceName} /
                                </span>
                            )}

                            {video ? video.title : "Loading..."}

                        </h2>
                        {isLoading ? (
                            <div className="w-full aspect-video flex items-center justify-center bg-gray-800">
                                <div className="animate-spin border-4 border-gray-400 border-t-white rounded-full w-12 h-12"></div>
                            </div>
                        ) : (
                            <div className="w-full max-w-full overflow-hidden">
                                <video
                                    ref={videoRef}
                                    controls
                                    className="w-full max-w-full h-auto aspect-video object-contain"
                                >
                                    <source src={video?.url} type="video/mp4" />
                                </video>
                            </div>
                        )}

                    </div>

                    <div className="md:w-1/3 bg-[#1e293b] p-4 rounded-lg shadow flex flex-col">
                        <h3 className="text-xl font-bold mb-3">Comments</h3>
                        {error && <p className="text-red-500 mb-2">{error}</p>}

                        <div className="w-full p-2 border rounded mb-2 bg-[#1e293b] text-white flex items-center">
                            <span className="mr-2 opacity-50">Name:</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-transparent border-none outline-none flex-1 text-white"
                            />
                        </div>

                        <div className="flex-1 overflow-y-auto max-h-[30vh] md:max-h-[45vh] pr-2">
                            {comments === null ? (
                                <div className="flex justify-center">
                                    <div className="animate-spin border-4 border-gray-400 border-t-white rounded-full w-8 h-8"></div>
                                </div>
                            ) : (
                                comments.map((c, index) => (
                                    <div
                                        key={index}
                                        className="p-2 bg-[#283449] rounded cursor-pointer mb-2"
                                        onClick={() => {
                                            if (c.timestamp !== undefined) {
                                                videoRef.current.currentTime = parseFloat(c.timestamp);
                                                videoRef.current.pause()

                                            }
                                        }}
                                    >
                                        <p className="text-sm font-bold text-white">{c.name || "Unknown"}</p>
                                        <p className="text-white">{c.text || "No comment text"}</p>
                                        <p className="text-xs text-gray-400">
                                            ⏳{" "}
                                            {c.timestamp !== undefined
                                                ? parseFloat(c.timestamp).toFixed(2) + "s"
                                                : "No timestamp"}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="mt-4">
                            <textarea
                                placeholder="Add a comment..."
                                value={commentText}
                                onFocus={() => videoRef.current.pause()}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="w-full p-2 border rounded bg-[#1e293b] text-white placeholder-gray-400"
                            />
                            <button
                                className="w-full bg-blue-500 text-white py-2 rounded mt-2"
                                onClick={handleAddComment}
                            >
                                Add Comment
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {CreateWorkspace && <CreateWorkspaceModal setShowModal={setCreateWorkspace} setWorkspaces={setWorkspaces} />}
            <Footer />
        </div>
    );
}

export default VideoPageEditor;