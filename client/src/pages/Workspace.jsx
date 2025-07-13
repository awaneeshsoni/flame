import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateWorkspaceModal from "../components/CreateWorkspaceModel";
import Footer from "../components/Footer";
import WorkspaceSidebar from "../components/WorkspaceSidebar";
import MembersPanel from "../components/MembersPanel";
import EditWorkspaceModal from "../components/EditWorkspaceModel";
import { FaTrashAlt } from "react-icons/fa";
import { useWorkspaceContext } from "../context/WorkspaceContext";

const API = import.meta.env.VITE_API_URL;

function Workspace() {
    const { wsid } = useParams();
    const navigate = useNavigate();
    const plan = localStorage.getItem("plan");
    const { workspaces, setWorkspaces } = useWorkspaceContext();
    const [currentWorkspace, setCurrentWorkspace] = useState(() => {
        const active = workspaces.find((ws) => ws._id === wsid);
        return active;
    });
    const [videos, setVideos] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [workspaceToEdit, setWorkspaceToEdit] = useState(null);

    useEffect(() => {
        const fetchVideos = async () => {
            if (!wsid) return;
            try {
                const res = await fetch(`${API}/api/video?workspaceId=${wsid}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                const data = await res.json();
                setVideos(data.videos || []);
            } catch (err) {
                console.error("Error fetching videos:", err);
            }
        };
        fetchVideos();
    }, [wsid]);

    useEffect(() => {
        const listener = (e) => {
            const { workspaceId, video } = e.detail;
            if (workspaceId === wsid) {
                setWorkspaces((prev) =>
                    prev.map((ws) =>
                        ws._id === workspaceId
                            ? {
                                ...ws,
                                storageUsed: (ws.storageUsed || 0) + (video.fileSize || 0),
                            }
                            : ws
                    )
                );

                setVideos((prev) => [...prev, video]); 
            }
        };

        window.addEventListener("video-uploaded", listener);
        return () => window.removeEventListener("video-uploaded", listener);
    }, [wsid, setWorkspaces]);

    function onEditClick(workspace) {
        setWorkspaceToEdit(workspace);
        setShowEditModal(true);
    }
    const handleDeleteVideo = async (videoId) => {
        const confirmed = window.confirm("Are you sure you want to delete this video?");
        if (!confirmed) return;
        const video = videos.find((v) => v._id === videoId);
        const fileSize = video?.fileSize || 0;
        try {
            const res = await fetch(`${API}/api/video/${videoId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to delete video");
            }

            setVideos((prev) => prev.filter((v) => v._id !== videoId));
        } catch (err) {
            alert(err.message || "Error deleting video");
        }
    };

    return (
        <div className="bg-black min-h-screen flex flex-col text-white">
            <div className="flex flex-col md:flex-row flex-1">
                <WorkspaceSidebar
                    workspaces={workspaces}
                    currentWorkspaceId={wsid}
                    onCreateClick={() => setShowCreateModal(true)}
                    onEditClick={onEditClick}
                />

                <main className="flex-1 p-6">
                    <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                        <h2 className="text-lg md:text-xl font-bold">
                            {currentWorkspace ? `Videos in "${currentWorkspace.name}"` : "Loading..."}
                        </h2>
                        <button
                            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 text-sm font-semibold rounded"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("open-upload-modal", {
                                        detail: { wsid, workspace: currentWorkspace },
                                    })
                                )
                            }
                        >
                            + Upload
                        </button>
                    </div>

                    {videos.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {videos.map((video) => (
                                <div
                                    key={video._id}
                                    className="relative w-[180px] h-[180px] bg-zinc-800 text-white rounded-lg p-3 cursor-pointer hover:bg-zinc-700 transition flex flex-col justify-center"
                                    onClick={() => navigate(`video/${video._id}`)}
                                >
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteVideo(video._id);
                                        }}
                                        className="absolute top-4 right-3 text-red-500 opacity-60 hover:opacity-100 text-sm"
                                        title="Delete Video"
                                    >
                                        <FaTrashAlt />
                                    </button>

                                    <div className="text-center text-5xl">🎬</div>
                                    <p className="text-sm font-medium text-center mt-2 truncate">
                                        {video.title}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-white/70 text-sm">No videos found. Upload one to get started!</p>
                    )}
                </main>

                <MembersPanel workspace={currentWorkspace} />
            </div>

            {showCreateModal && (
                <CreateWorkspaceModal setShowModal={setShowCreateModal} currentPlan={plan} />
            )}

            {showEditModal && (
                <EditWorkspaceModal
                    workspace={workspaceToEdit}
                    setShowModal={setShowEditModal}
                    setWorkspaces={setWorkspaces}
                    onEditClick={onEditClick}
                />
            )}

            <Footer />
        </div>
    );
}

export default Workspace;
